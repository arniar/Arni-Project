const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


 // Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,  // Ensure the email is unique
    trim: true,
    lowercase: true,  // Automatically convert to lowercase
    default: null,
  },
  phone: {
    type: String,  // Now a single phone number as a string
    default: null,  // Default is null (not provided)
  },
  password: {
    type: String
  },
  address: {
    type: String,  // Address can be a single string (optional)
    default: null,  // Default to null
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'], // Optional: Enum of gender options
    default: null,  // Default to null (not provided)
  },
  role: {
    type: String,
    enum: ['User', 'Admin', 'Manager'],  // Optional: Enum of roles
    default: 'User',  // Default to 'User' role
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],  // Optional: Enum of statuses
    default: 'Active',  // Default to 'Active' status
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically set the creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now,  // Automatically set the update date
  },
});

// Password hashing before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // If the password isn't modified, skip hashing

  try {
    // Hash the password with a salt rounds of 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password); // Compare provided password with hashed password
  } catch (error) {
    throw new Error('Password DOES NOT match');
  }
};

// Create the model for the User schema
const User = mongoose.model('User', userSchema);

module.exports = User;
