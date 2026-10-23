const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    // RTO = customer did not accept the parcel; CUSTOMER_RETURN = returned after delivery
    type: { type: String, enum: ['RTO', 'CUSTOMER_RETURN'], required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        qty: Number,
        condition: { type: String, enum: ['good', 'damaged', 'missing'], default: 'good' },
      },
    ],
    reason: { type: String, trim: true, maxlength: 500, default: '' },
    status: { type: String, enum: ['received', 'refunded', 'rejected'], default: 'received' },
    receivedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Return', returnSchema);
