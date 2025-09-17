// routes/users.js - Updated
const express = require('express');
const User = require('../models/User');
const MessUsers = require('../models/MessUsers');
const router = express.Router();

// Get user subscriptions
router.get('/:userId/subscriptions', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const subscriptions = await MessUsers.find({ userId })
      .populate('messId', 'messName mobile')
      .populate('planId', 'planName durationDays')
      .sort({ createdAt: -1 });

    res.json(subscriptions);
  } catch (error) {
    console.error('Get user subscriptions error:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Create subscription
router.post('/:userId/subscriptions', async (req, res) => {
  try {
    const { userId } = req.params;
    const subscriptionData = { ...req.body, userId };

    // Check active
    const active = await MessUsers.findOne({
      userId,
      status: 'Active',
      endDate: { $gte: new Date() }
    });

    if (active) {
      return res.status(400).json({ error: 'Active subscription exists' });
    }

    const subscription = new MessUsers(subscriptionData);
    await subscription.save();
    
    await subscription.populate(['messId', 'planId']);

    res.status(201).json(subscription);
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

module.exports = router;