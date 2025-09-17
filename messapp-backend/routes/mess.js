// routes/mess.js - Updated
const express = require('express');
const Mess = require('../models/Mess');
const MessMenu = require('../models/MessMenu');
const Plan = require('../models/Plan');
const MessUsers = require('../models/MessUsers');
const router = express.Router();

// Get all messes
router.get('/', async (req, res) => {
  try {
    const { lat, lon, radius = 10, foodType } = req.query;
    let query = { isActive: true };

    if (foodType) query.foodType = foodType;

    let messes = await Mess.find(query)
      .populate('ownerId', 'username mobile')
      .sort({ createdAt: -1 });

    // Distance calculation if coords
    if (lat && lon) {
      // Simplified - implement geo query if needed
    }

    res.json(messes);
  } catch (error) {
    console.error('Get messes error:', error);
    res.status(500).json({ error: 'Failed to fetch messes' });
  }
});

// Get mess by ID
router.get('/:id', async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.id).populate('ownerId', 'username mobile');
    
    if (!mess) {
      return res.status(404).json({ error: 'Mess not found' });
    }

    const today = new Date();
    const menus = await MessMenu.find({ messId: mess._id, menuDate: { $gte: today } });

    const plans = await Plan.find({ messId: mess._id, status: 'Active' });

    res.json({ mess, menus, plans });
  } catch (error) {
    console.error('Get mess error:', error);
    res.status(500).json({ error: 'Failed to fetch mess details' });
  }
});

// Create mess
router.post('/', async (req, res) => {
  try {
    const messData = req.body;
    const mess = new Mess(messData);
    await mess.save();
    
    await mess.populate('ownerId');
    res.status(201).json(mess);
  } catch (error) {
    console.error('Create mess error:', error);
    res.status(500).json({ error: 'Failed to create mess' });
  }
});

// Get owner's messes
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const messes = await Mess.find({ ownerId: req.params.ownerId }).sort({ createdAt: -1 });
    res.json(messes);
  } catch (error) {
    console.error('Get owner messes error:', error);
    res.status(500).json({ error: 'Failed to fetch owner messes' });
  }
});

module.exports = router;