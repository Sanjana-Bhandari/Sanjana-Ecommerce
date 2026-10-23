// Run once:  npm run seed
// Creates the admin account and adds sample products.
// WARNING: it deletes all existing products first.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

const products = [
  // Girls Wear
  { name: 'Floral Summer Dress', category: 'Girls Wear', price: 899, mrp: 1499, stock: 25, featured: true, description: 'Light and breezy floral dress, perfect for summer outings.' },
  { name: 'Pastel Co-ord Set', category: 'Girls Wear', price: 1199, mrp: 1899, stock: 18, featured: true, description: 'Soft pastel top and pants set with a relaxed fit.' },
  { name: 'Cotton Kurti with Palazzo', category: 'Girls Wear', price: 999, mrp: 1599, stock: 30, description: 'Comfortable cotton kurti paired with flowy palazzo.' },
  { name: 'High-Waist Denim Jeans', category: 'Girls Wear', price: 1099, mrp: 1799, stock: 22, description: 'Stretchable high-waist jeans with a flattering fit.' },
  // Boys Wear
  { name: 'Classic Oxford Shirt', category: 'Boys Wear', price: 799, mrp: 1299, stock: 28, featured: true, description: 'Smart cotton Oxford shirt for everyday wear.' },
  { name: 'Graphic Printed T-Shirt', category: 'Boys Wear', price: 499, mrp: 799, stock: 40, description: 'Soft cotton tee with a cool graphic print.' },
  { name: 'Slim Fit Chinos', category: 'Boys Wear', price: 999, mrp: 1599, stock: 20, description: 'Comfortable slim fit chinos in a versatile shade.' },
  { name: 'Casual Hoodie', category: 'Boys Wear', price: 1299, mrp: 1999, stock: 15, description: 'Warm fleece hoodie with a kangaroo pocket.' },
  // Sarees
  { name: 'Banarasi Silk Saree', category: 'Sarees', price: 3499, mrp: 5499, stock: 8, featured: true, description: 'Rich Banarasi silk saree with golden zari border.' },
  { name: 'Soft Cotton Saree', category: 'Sarees', price: 1299, mrp: 1999, stock: 16, description: 'Lightweight cotton saree for daily elegance.' },
  { name: 'Georgette Party Wear Saree', category: 'Sarees', price: 1899, mrp: 2999, stock: 12, featured: true, description: 'Flowy georgette saree with sequin work.' },
  // Cosmetics
  { name: 'Matte Liquid Lipstick', category: 'Cosmetics', price: 349, mrp: 599, stock: 50, featured: true, description: 'Long-lasting matte finish in a bold shade.' },
  { name: 'Kajal & Eyeliner Combo', category: 'Cosmetics', price: 249, mrp: 449, stock: 60, description: 'Smudge-proof kajal and eyeliner duo.' },
  { name: 'Vitamin C Face Serum', category: 'Cosmetics', price: 549, mrp: 899, stock: 35, description: 'Brightening serum for glowing skin.' },
  { name: 'Rose Glow Compact Powder', category: 'Cosmetics', price: 299, mrp: 499, stock: 45, description: 'Lightweight compact with a natural rosy glow.' },
  // Aesthetic Items
  { name: 'LED Fairy Lights (10 m)', category: 'Aesthetic Items', price: 299, mrp: 599, stock: 70, featured: true, description: 'Warm white fairy lights to make any room cozy.' },
  { name: 'Scented Soy Candle Set', category: 'Aesthetic Items', price: 599, mrp: 999, stock: 30, description: 'Set of 3 hand-poured scented candles.' },
  { name: 'Boho Wall Hanging', category: 'Aesthetic Items', price: 699, mrp: 1199, stock: 14, description: 'Handmade macrame wall hanging for a boho look.' },
];

(async () => {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
  } else {
    await User.create({ name: 'Store Admin', email, password, role: 'admin' });
    console.log(`Admin created: ${email}`);
  }

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Added ${products.length} sample products`);

  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
