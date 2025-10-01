// routes/stats.js
const express = require('express');
const Order = require('../models/Order');
const MessUsers = require('../models/MessUsers');
const Mess = require('../models/Mess');
const { auth, ownerOnly } = require('../middleware/auth');
const { validateObjectId } = require('../utils/validation');

const router = express.Router();

// GET /api/stats/owner/:ownerId - Get statistics for a mess owner
router.get('/owner/:ownerId', auth, ownerOnly, async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!validateObjectId(ownerId)) {
      return res.status(400).json({ success: false, error: 'Invalid owner ID' });
    }

    // Normalize "today" to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all messes owned by this user
    const ownerMesses = await Mess.find({ ownerId }).select('_id');
    const messIds = ownerMesses.map(m => m._id);

    if (!messIds.length) {
      return res.json({
        success: true,
        data: { todayOrders: 0, monthlyRevenue: 0, activeSubscriptions: 0 },
        message: 'No messes found for this owner',
      });
    }

    // Run parallel queries
    const [todayOrders, monthlyRevenue, activeSubscriptions] = await Promise.all([
      Order.countDocuments({
        messId: { $in: messIds },
        createdAt: { $gte: today },
      }),
      Order.aggregate([
        {
          $match: {
            messId: { $in: messIds },
            createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 1) },
            paymentStatus: 'paid',
          },
        },
        {
          $group: { _id: null, total: { $sum: '$amount' } },
        },
      ]),
      MessUsers.countDocuments({
        messId: { $in: messIds },
        status: 'Active',
      }),
    ]);

    return res.json({
      success: true,
      data: {
        todayOrders,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        activeSubscriptions,
      },
      message: 'Statistics fetched successfully',
    });
  } catch (error) {
    console.error('❌ Get owner stats error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
});

module.exports = router;