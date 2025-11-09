const mongoose = require('mongoose');

const PoolSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // This links it to our User model
  },
  type: {
    type: String,
    required: true,
    enum: ['Ride', 'Food'], // Only allows these two values
  },
  destination: {
    type: String,
    required: true,
  },
  meetUpPoint: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // A list of users who joined
    },
  ],
  maxSize: {
    type: Number,
    default: 5, // Your 5-person limit
  },
  status: {
    type: String,
    default: 'Active',
    enum: ['Active', 'Full', 'Expired', 'Cancelled'],
  },
  expiresAt: {
    type: Date,
    default: null, // It's 'null' for "Book Later" pools
  },
  poolMode: {
    type: String,
    enum: ['now', 'later'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Pool', PoolSchema);