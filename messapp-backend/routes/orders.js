// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MessMenu = require('../models/MessMenu');
const MessUsers = require('../models/MessUsers');
const { auth, consumerOnly } = require('../middleware/auth');
const { validateObjectId } = require('../utils/validation');

// GET /api/orders - Get all orders of the logged-in user
router.get('/', auth, consumerOnly, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id })
      .populate('messId', 'messName')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: orders,
      message: 'Orders fetched successfully',
    });
  } catch (error) {
    console.error('❌ Get orders error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// POST /api/orders - Create a new order for logged-in user
router.post('/', auth, consumerOnly, async (req, res) => {
  try {
    const { messId, mealType, items, amount, specialInstructions } = req.body;

    if (!validateObjectId(messId) || !['Breakfast', 'Lunch', 'Dinner'].includes(mealType) || !amount) {
      return res.status(400).json({ success: false, error: 'Invalid input data' });
    }

    // Check active subscription
    const subscription = await MessUsers.findOne({
      userId: req.user.id,
      messId,
      status: 'Active',
      endDate: { $gte: new Date() },
    });

    if (!subscription) {
      return res.status(400).json({ success: false, error: 'No active subscription found' });
    }

    // Check menu availability for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const menu = await MessMenu.findOne({
      messId,
      mealType,
      menuDate: { $gte: today },
    });

    if (!menu) {
      return res.status(400).json({ success: false, error: 'No menu available for this meal' });
    }

    // Create order
    const order = new Order({
      customerId: req.user.id,
      messId,
      subscriptionId: subscription._id,
      orderDate: new Date(),
      mealType,
      items: items || menu.itemName,
      amount,
      specialInstructions,
    });

    await order.save();
    await order.populate('messId', 'messName');

    return res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('❌ Create order error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

module.exports = router;