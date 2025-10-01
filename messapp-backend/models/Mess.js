// models/Mess.js
const mongoose = require('mongoose');

const messSchema = new mongoose.Schema({
  messName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  ownerName: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
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

messSchema.index({ ownerId: 1 });
messSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Mess', messSchema);