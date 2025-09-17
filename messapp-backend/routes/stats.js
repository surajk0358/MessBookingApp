// routes/stats.js - Updated for owner
const express = require('express');
const Order = require('../models/Order');
const MessUsers = require('../models/MessUsers');
const router = express.Router();

// Get owner stats
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const { ownerId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ownerMesses = await require('../models/Mess').find({ ownerId }).select('_id');
    const messIds = ownerMesses.map(m => m._id);

    const [todayOrders, monthlyRevenue, activeSubscriptions] = await Promise.all([
      Order.countDocuments({
        messId: { $in: messIds },
        createdAt: { $gte: today }
      }),
      Order.aggregate([
        {
          $match: {
            messId: { $in: messIds },
            createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 1) },
            paymentStatus: 'paid'
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      MessUsers.countDocuments({
        messId: { $in: messIds },
        status: 'Active'
      })
    ]);

    res.json({
      todayOrders,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      activeSubscriptions
    });
  } catch (error) {
    console.error('Get owner stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;