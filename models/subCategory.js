const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID library

// Define the Sub Category schema
const subCategorySchema = new mongoose.Schema({
  subCategoryName: {
    type: String,
    required: true,
    trim: true,
  },
  mainCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MainCategory', // Reference to MainCategory
    required: true,
  }
});

// Middleware to set `updatedAt` on each update
subCategorySchema.pre('save', function (next) {
  this.updatedAt = Date.now(); // Update the `updatedAt` field
  next();
});

// Static method to find Active subcategories
subCategorySchema.statics.findActiveSubCategories = async function () {
  return await this.find({ status: 'Active' }).populate('mainCategory');
};

// Create the model for the Sub Category schema
const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;