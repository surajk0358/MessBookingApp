// routes/orders.js - Updated
const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Get orders
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, messId, customerId } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (messId) query.messId = messId;
    if (customerId) query.customerId = customerId;

    const orders = await Order.find(query)
      .populate('customerId', 'username mobile')
      .populate('messId', 'messName mobile')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const orderData = req.body;
    const order = new Order(orderData);
    await order.save();
    
    await order.populate(['customerId', 'messId']);
    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate(['customerId', 'messId']);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;