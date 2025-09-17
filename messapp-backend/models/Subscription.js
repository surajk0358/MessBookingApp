// models/Subscription.js - User Subscription Model
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mess',
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled', 'paused'],
    default: 'active'
  },
  paymentDetails: {
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ['wallet', 'upi', 'card', 'cash']
    },
    transactionId: String,
    paidAt: Date
  },
  mealsConsumed: {
    breakfast: { type: Number, default: 0 },
    lunch: { type: Number, default: 0 },
    dinner: { type: Number, default: 0 }
  },
  rating: {
    stars: { type: Number, min: 1, max: 5 },
    review: String,
    createdAt: Date
  }
}, {
  timestamps: true
});

subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ messId: 1, status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
