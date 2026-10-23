const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const { isConfigured, createRazorpayOrder, verifySignature } = require('../utils/razorpay');

const SHIPPING_FEE = 49;
const FREE_SHIPPING_ABOVE = 999;

async function restock(order) {
  for (const it of order.items) {
    await Product.updateOne({ _id: it.product }, { $inc: { stock: it.qty } });
  }
}

// Starts an online payment for an order. Real Razorpay if keys are set, otherwise demo mode.
async function startOnlinePayment(order) {
  if (!isConfigured()) return { mode: 'demo' };
  const rzp = await createRazorpayOrder({ amountRupees: order.totalPrice, receipt: String(order._id) });
  order.payment.razorpayOrderId = rzp.id;
  await order.save();
  return {
    mode: 'razorpay',
    keyId: process.env.RAZORPAY_KEY_ID,
    razorpayOrderId: rzp.id,
    amount: rzp.amount,
    currency: rzp.currency,
  };
}

// POST /api/orders
exports.createOrder = asyncHandler(async (req, res) => {
  const { items, address, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }
  const required = ['name', 'phone', 'line1', 'city', 'state', 'pincode'];
  if (!address || required.some((f) => !String(address[f] || '').trim())) {
    res.status(400);
    throw new Error('Please fill in the full delivery address');
  }
  if (!['COD', 'ONLINE'].includes(paymentMethod)) {
    res.status(400);
    throw new Error('Please choose a payment method');
  }

  // Merge duplicate lines and validate quantities
  const qtyById = new Map();
  for (const it of items) {
    const qty = Math.floor(Number(it.qty));
    if (!it.product || !(qty > 0)) {
      res.status(400);
      throw new Error('Invalid item in cart');
    }
    const key = String(it.product);
    qtyById.set(key, (qtyById.get(key) || 0) + qty);
  }

  const products = await Product.find({ _id: { $in: [...qtyById.keys()] } });
  if (products.length !== qtyById.size) {
    res.status(404);
    throw new Error('Some products are no longer available');
  }

  // Prices always come from the database, never from the browser.
  const lines = products.map((p) => ({
    product: p._id,
    name: p.name,
    price: p.price,
    qty: qtyById.get(String(p._id)),
    image: p.image,
  }));

  // Reserve stock; roll back if any line is short.
  const reserved = [];
  for (const line of lines) {
    const result = await Product.updateOne(
      { _id: line.product, stock: { $gte: line.qty } },
      { $inc: { stock: -line.qty } }
    );
    if (result.modifiedCount === 0) {
      for (const r of reserved) await Product.updateOne({ _id: r.product }, { $inc: { stock: r.qty } });
      res.status(400);
      throw new Error(`Not enough stock for "${line.name}"`);
    }
    reserved.push(line);
  }

  const itemsPrice = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const shippingPrice = itemsPrice >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    items: lines,
    address: {
      name: String(address.name).trim(),
      phone: String(address.phone).trim(),
      line1: String(address.line1).trim(),
      city: String(address.city).trim(),
      state: String(address.state).trim(),
      pincode: String(address.pincode).trim(),
    },
    payment: { method: paymentMethod, status: 'pending' },
    itemsPrice,
    shippingPrice,
    totalPrice,
    statusHistory: [{ status: 'placed', note: 'Order placed' }],
  });

  let payment = null;
  if (paymentMethod === 'ONLINE') {
    try {
      payment = await startOnlinePayment(order);
    } catch (err) {
      // Could not start the payment: cancel this order and give the stock back.
      order.status = 'cancelled';
      order.statusHistory.push({ status: 'cancelled', note: 'Online payment could not be started' });
      await order.save();
      await restock(order);
      res.status(502);
      throw new Error(err.message || 'Could not start online payment');
    }
  }

  res.status(201).json({ order, payment });
});

// GET /api/orders/mine
exports.myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

const loadOwnedOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const isOwner = String(order.user) === String(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not allowed');
  }
  return { order, isOwner };
};

// GET /api/orders/:id
exports.getOrder = asyncHandler(async (req, res) => {
  const { order } = await loadOwnedOrder(req, res);
  res.json({ order });
});

// POST /api/orders/:id/pay  (retry paying for an unpaid online order)
exports.initPayment = asyncHandler(async (req, res) => {
  const { order, isOwner } = await loadOwnedOrder(req, res);
  if (!isOwner || order.payment.method !== 'ONLINE' || order.payment.status !== 'pending' || order.status === 'cancelled') {
    res.status(400);
    throw new Error('This order does not need a payment');
  }
  const payment = await startOnlinePayment(order);
  res.json({ order, payment });
});

// POST /api/orders/:id/verify-payment  (Razorpay success callback)
exports.verifyPayment = asyncHandler(async (req, res) => {
  const { order, isOwner } = await loadOwnedOrder(req, res);
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!isOwner || !isConfigured() || order.payment.razorpayOrderId !== razorpay_order_id) {
    res.status(400);
    throw new Error('Payment details do not match this order');
  }
  const ok = verifySignature({ orderId: razorpay_order_id, paymentId: razorpay_payment_id, signature: razorpay_signature });
  if (!ok) {
    order.payment.status = 'failed';
    await order.save();
    res.status(400);
    throw new Error('Payment verification failed');
  }
  order.payment.status = 'paid';
  order.payment.razorpayPaymentId = razorpay_payment_id;
  order.statusHistory.push({ status: order.status, note: 'Online payment received' });
  await order.save();
  res.json({ order });
});

// POST /api/orders/:id/demo-pay  (only when Razorpay keys are NOT configured)
exports.demoPay = asyncHandler(async (req, res) => {
  const { order, isOwner } = await loadOwnedOrder(req, res);
  if (isConfigured()) {
    res.status(403);
    throw new Error('Demo payment is disabled');
  }
  if (!isOwner || order.payment.method !== 'ONLINE' || order.payment.status !== 'pending') {
    res.status(400);
    throw new Error('This order does not need a payment');
  }
  order.payment.status = 'paid_demo';
  order.statusHistory.push({ status: order.status, note: 'Demo payment (no real money)' });
  await order.save();
  res.json({ order });
});

// GET /api/orders  (admin)
exports.listOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(300).populate('user', 'name email phone');
  res.json({ orders });
});

// PATCH /api/orders/:id/status  (admin)
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  if (!Order.STATUSES.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const previous = order.status;
  if (previous === status) {
    res.json({ order });
    return;
  }

  // Cancelling an order that never reached the customer gives its stock back.
  if (status === 'cancelled' && !['delivered', 'rto_received', 'returned'].includes(previous)) {
    await restock(order);
  }
  if (previous === 'cancelled') {
    res.status(400);
    throw new Error('A cancelled order cannot be changed');
  }
  if (status === 'delivered' && order.payment.method === 'COD') {
    order.payment.status = 'paid';
  }

  order.status = status;
  order.statusHistory.push({ status, note: note || '' });
  await order.save();
  res.json({ order });
});
