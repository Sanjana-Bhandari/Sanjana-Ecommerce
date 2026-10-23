const Order = require('../models/Order');
const Product = require('../models/Product');
const Return = require('../models/Return');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/returns  (admin) — record items that came back to you
exports.createReturn = asyncHandler(async (req, res) => {
  const { orderId, type, items, reason } = req.body;
  if (!['RTO', 'CUSTOMER_RETURN'].includes(type)) {
    res.status(400);
    throw new Error('Choose a return type');
  }
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Add at least one returned item');
  }

  const lines = [];
  for (const it of items) {
    const original = order.items.find((o) => String(o.product) === String(it.product));
    const qty = Math.floor(Number(it.qty));
    if (!original || !(qty > 0) || qty > original.qty) {
      res.status(400);
      throw new Error('Invalid returned item or quantity');
    }
    const condition = ['good', 'damaged', 'missing'].includes(it.condition) ? it.condition : 'good';
    lines.push({ product: original.product, name: original.name, qty, condition });
  }

  // Items that came back in good condition go back on the shelf.
  for (const l of lines) {
    if (l.condition === 'good') {
      await Product.updateOne({ _id: l.product }, { $inc: { stock: l.qty } });
    }
  }

  const ret = await Return.create({ order: order._id, type, items: lines, reason });

  order.status = type === 'RTO' ? 'rto_received' : 'returned';
  order.statusHistory.push({
    status: order.status,
    note: type === 'RTO' ? 'Parcel came back (customer did not accept)' : 'Customer return received',
  });
  await order.save();

  res.status(201).json({ return: ret, order });
});

// GET /api/returns  (admin)
exports.listReturns = asyncHandler(async (req, res) => {
  const returns = await Return.find().sort({ createdAt: -1 }).limit(300).populate({
    path: 'order',
    select: 'totalPrice address createdAt',
  });
  res.json({ returns });
});
