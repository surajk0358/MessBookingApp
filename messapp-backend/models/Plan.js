// models/Plan.js
const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  messId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mess',
    required: true,
  },
  planName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  durationDays: {
    type: Number,
    min: 1,
  },
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

planSchema.index({ messId: 1 });

module.exports = mongoose.model('Plan', planSchema);