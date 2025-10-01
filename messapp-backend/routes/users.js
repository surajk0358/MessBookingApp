// routes/users.js
const express = require('express');
const MessUsers = require('../models/MessUsers');
const { auth, consumerOnly } = require('../middleware/auth');
const { validateObjectId } = require('../utils/validation');

const router = express.Router();

// GET /api/users/:userId/subscriptions - Get all subscriptions of a user
router.get('/:userId/subscriptions', auth, consumerOnly, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!validateObjectId(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    const subscriptions = await MessUsers.find({ userId })
      .populate('messId', 'messName mobile')
      .populate('planId', 'planName durationDays')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: subscriptions,
      message: 'Subscriptions fetched successfully',
    });
  } catch (error) {
    console.error('❌ Get user subscriptions error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch subscriptions' });
  }
});

// POST /api/users/:userId/subscriptions - Create a new subscription for a user
router.post('/:userId/subscriptions', auth, consumerOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    const { messId, planId, startDate, endDate } = req.body;

    if (!validateObjectId(userId) || !validateObjectId(messId) || !validateObjectId(planId)) {
      return res.status(400).json({ success: false, error: 'Invalid input data' });
    }

    // Ensure no overlapping active subscriptions
    const active = await MessUsers.findOne({
      userId,
      status: 'Active',
      endDate: { $gte: new Date() },
    });

    if (active) {
      return res.status(400).json({ success: false, error: 'Active subscription exists' });
    }

    const subscription = new MessUsers({
      messId,
      userId,
      planId,
      startDate,
      endDate,
      status: 'Active',
    });

    await subscription.save();
    await subscription.populate(['messId', 'planId']);

    return res.status(201).json({
      success: true,
      data: subscription,
      message: 'Subscription created successfully',
    });
  } catch (error) {
    console.error('❌ Create subscription error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create subscription' });
  }
});

module.exports = router;