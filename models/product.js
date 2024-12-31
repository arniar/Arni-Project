const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID library

// Define the Product schema
const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    unique: true,
    default: uuidv4, // Automatically generate a unique UUID
    immutable: true, // Prevent updates to productId
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: ['Electronics', 'Fashion', 'Furniture', 'Beauty', 'Food'],
      message: '{VALUE} is not a valid category',
    },
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function (value) {
        return value.every((url) => /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(url));
      },
      message: 'One or more image URLs are invalid.',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: {
      values: ['Available', 'Out of Stock', 'Discontinued'],
      message: '{VALUE} is not a valid status',
    },
    default: 'Available',
  },
});

// Middleware to auto-update the updatedAt field on document save
productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
