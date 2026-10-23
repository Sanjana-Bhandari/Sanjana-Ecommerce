const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Return = require('../models/Return');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/admin/stats
exports.getStats = asyncHandler(async (req, res) => {
  const [totalOrders, delivered, failedOrRefused, returned, products, customers, revenueAgg, recentOrders, returnsCount, lowStock] =
    await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: { $in: ['delivery_failed', 'refused', 'rto_received'] } }),
      Order.countDocuments({ status: 'returned' }),
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([{ $match: { status: 'delivered' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.find().sort({ createdAt: -1 }).limit(6).populate('user', 'name'),
      Return.countDocuments(),
      Product.find({ stock: { $lte: 3 } }).select('name stock').sort({ stock: 1 }).limit(6),
    ]);

  res.json({
    stats: {
      totalOrders,
      delivered,
      failedOrRefused,
      returned,
      returnsCount,
      products,
      customers,
      revenue: revenueAgg[0] ? revenueAgg[0].total : 0,
    },
    recentOrders,
    lowStock,
  });
});
