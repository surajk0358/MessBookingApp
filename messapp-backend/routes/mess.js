// routes/mess.js
const express = require('express');
const Mess = require('../models/Mess');
const MessMenu = require('../models/MessMenu');
const Plan = require('../models/Plan');
const { auth, ownerOnly } = require('../middleware/auth');
const { validateObjectId } = require('../utils/validation');

const router = express.Router();

// GET /api/messes - Get all active messes with optional filters
router.get('/', async (req, res) => {
  try {
    const { lat, lon, radius = 10, foodType } = req.query;
    let query = { isActive: true };

    if (foodType) query.foodType = foodType;

    let messes;

    if (lat && lon) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ success: false, error: 'Invalid latitude or longitude' });
      }
      const maxDistance = parseFloat(radius) * 1000; // Convert km to meters

      messes = await Mess.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [longitude, latitude] },
            distanceField: 'distance',
            maxDistance,
            spherical: true,
            query,
          },
        },
      ]);

      messes = await Mess.populate(messes, { path: 'ownerId', select: 'username mobile' });
    } else {
      messes = await Mess.find(query)
        .populate('ownerId', 'username mobile')
        .sort({ createdAt: -1 });
    }

    return res.json({
      success: true,
      data: messes,
      message: 'Messes fetched successfully',
    });
  } catch (error) {
    console.error('❌ Get messes error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch messes' });
  }
});

// GET /api/messes/:id - Get mess details by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json({ success: false, error: 'Invalid mess ID' });
    }

    const mess = await Mess.findById(id).populate('ownerId', 'username mobile');
    if (!mess) {
      return res.status(404).json({ success: false, error: 'Mess not found' });
    }

    const today = new Date();
    const menus = await MessMenu.find({ messId: mess._id, menuDate: { $gte: today } });
    const plans = await Plan.find({ messId: mess._id, status: 'Active' });

    return res.json({
      success: true,
      data: { mess, menus, plans },
      message: 'Mess details fetched successfully',
    });
  } catch (error) {
    console.error('❌ Get mess error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch mess details' });
  }
});

// POST /api/messes - Create new mess (Owner only)
router.post('/', auth, ownerOnly, async (req, res) => {
  try {
    const { latitude, longitude, ...otherData } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, error: 'Latitude and longitude are required' });
    }
    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);
    if (isNaN(latNum) || isNaN(lonNum)) {
      return res.status(400).json({ success: false, error: 'Invalid latitude or longitude' });
    }

    const messData = {
      ...otherData,
      ownerId: req.user.id,
      location: {
        type: 'Point',
        coordinates: [lonNum, latNum],
      },
    };
    const mess = new Mess(messData);
    await mess.save();

    await mess.populate('ownerId', 'username mobile');

    return res.status(201).json({
      success: true,
      data: mess,
      message: 'Mess created successfully',
    });
  } catch (error) {
    console.error('❌ Create mess error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create mess' });
  }
});

// GET /api/messes/owner/:ownerId - Get all messes of a specific owner
router.get('/owner/:ownerId', auth, ownerOnly, async (req, res) => {
  try {
    const { ownerId } = req.params;
    if (!validateObjectId(ownerId)) {
      return res.status(400).json({ success: false, error: 'Invalid owner ID' });
    }

    const messes = await Mess.find({ ownerId }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: messes,
      message: 'Owner messes fetched successfully',
    });
  } catch (error) {
    console.error('❌ Get owner messes error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch owner messes' });
  }
});

module.exports = router;