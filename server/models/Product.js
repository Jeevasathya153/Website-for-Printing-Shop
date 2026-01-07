const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'Business Cards',
        'Banners',
        'Flyers',
        'Brochures',
        'Posters',
        'Stickers',
        'Wedding Cards',
        'ID Cards',
        'T-Shirts',
        'Mugs',
        'Other',
      ],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    image: {
      type: String,
      required: [true, 'Please provide a product image'],
    },
    specifications: {
      size: String,
      material: String,
      color: String,
      quantity: String,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);