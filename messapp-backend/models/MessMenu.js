//messapp-backend/models/MessMenu.js - Matches MESS_MENU schema
const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  messId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mess',
    required: true
  },
  menuDate: {
    type: Date
  },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner'],
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  modifiedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

menuSchema.index({ messId: 1, menuDate: 1, mealType: 1 }, { unique: true });

module.exports = mongoose.model('MessMenu', menuSchema);