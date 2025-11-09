const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  // This is for our "Campus-specific social layer"
  isVerified: {
    type: Boolean,
    default: false, // We'll set this to true if email is a .edu email
  },
  // This is for our "Gamified eco-rewards"
  ecoPoints: {
    type: Number,
    default: 0,
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

module.exports = mongoose.model('User', UserSchema);