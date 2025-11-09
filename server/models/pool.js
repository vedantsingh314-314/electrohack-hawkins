const mongoose = require('mongoose');

const PoolSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  type: {
    type: String,
    required: true,
    enum: ['Ride', 'Food'],
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
      ref: 'User',
    },
  ],
  maxSize: {
    type: Number,
    default: 5,
  },
  status: {
    type: String,
    default: 'Active',
    enum: ['Active', 'Full', 'Expired', 'Cancelled', 'Finalized'],
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  poolMode: {
    type: String,
    enum: ['now', 'later'],
    required: true,
  },
  baseCost: {
    type: Number,
    default: 0,
  },
  splitCost: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Pool', PoolSchema);