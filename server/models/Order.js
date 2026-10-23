const mongoose = require('mongoose');

const ORDER_STATUSES = [
  'placed',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
  'delivery_failed',
  'refused',
  'rto_received',
  'returned',
  'cancelled',
];

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Snapshot of each product at the time of ordering (name/price can change later)
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        price: Number,
        qty: Number,
        image: String,
      },
    ],
    address: { name: String, phone: String, line1: String, city: String, state: String, pincode: String },
    payment: {
      method: { type: String, enum: ['COD', 'ONLINE'], required: true },
      status: { type: String, enum: ['pending', 'paid', 'paid_demo', 'failed'], default: 'pending' },
      razorpayOrderId: String,
      razorpayPaymentId: String,
    },
    itemsPrice: Number,
    shippingPrice: Number,
    totalPrice: Number,
    status: { type: String, enum: ORDER_STATUSES, default: 'placed' },
    statusHistory: [{ status: String, note: String, at: { type: Date, default: Date.now } }],
  },
  { timestamps: true }
);

orderSchema.statics.STATUSES = ORDER_STATUSES;

module.exports = mongoose.model('Order', orderSchema);
