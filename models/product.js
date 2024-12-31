const mongoose = require('mongoose');

// Define the Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,  // Remove extra spaces
  },
  description: {
    type: String,
    required: true,  // Ensure description is provided
    trim: true,
  },
  price: {
    type: Number,
    required: true,  // Ensure price is provided
    min: [0, 'Price cannot be negative'],  // Prevent negative price
  },
  category: {
    type: String,
    required: true,  // Ensure category is provided
    enum: ['Electronics', 'Fashion', 'Furniture', 'Beauty', 'Food'],  // Limit to specific categories
  },
  stock: {
    type: Number,
    default: 0,  // Default stock is 0 if not provided
    min: [0, 'Stock cannot be negative'],  // Prevent negative stock
  },
  images: [{
    type: String,  // Array of image URLs
    default: [],  // Default to an empty array if no images
  }],
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically set the creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now,  // Automatically set the update date
  },
  status: {
    type: String,
    enum: ['Available', 'Out of Stock', 'Discontinued'],  // Enum for product status
    default: 'Available',  // Default status is 'Available'
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

