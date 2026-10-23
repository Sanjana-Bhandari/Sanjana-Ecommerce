const mongoose = require('mongoose');

const CATEGORIES = ['Girls Wear', 'Boys Wear', 'Sarees', 'Cosmetics', 'Aesthetic Items'];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1500, default: '' },
    category: { type: String, enum: CATEGORIES, required: [true, 'Category is required'] },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    mrp: { type: Number, min: 0, default: 0 }, // original price, used to show discount
    image: { type: String, trim: true, default: '' }, // image URL
    stock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model('Product', productSchema);
