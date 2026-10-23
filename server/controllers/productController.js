const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/products?category=&search=&sort=&featured=&limit=
exports.listProducts = asyncHandler(async (req, res) => {
  const { category, search, sort, featured, limit } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (featured === 'true') filter.featured = true;
  if (search) filter.name = { $regex: escapeRegex(String(search)), $options: 'i' };

  const sorts = { price_asc: { price: 1 }, price_desc: { price: -1 }, newest: { createdAt: -1 } };
  const max = Math.min(parseInt(limit, 10) || 60, 100);

  const products = await Product.find(filter)
    .sort(sorts[sort] || { createdAt: -1 })
    .limit(max);
  res.json({ products });
});

// GET /api/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ product });
});

const pickFields = (b) => {
  const out = {};
  ['name', 'description', 'category', 'price', 'mrp', 'image', 'stock', 'rating', 'featured'].forEach((k) => {
    if (b[k] !== undefined) out[k] = b[k];
  });
  return out;
};

// POST /api/products (admin)
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(pickFields(req.body));
  res.status(201).json({ product });
});

// PUT /api/products/:id (admin)
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, pickFields(req.body), {
    new: true,
    runValidators: true,
  });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ product });
});

// DELETE /api/products/:id (admin)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true });
});
