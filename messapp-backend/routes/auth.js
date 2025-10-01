// routes/auth.js
const express = require('express');
const User = require('../models/User');
const { validateMobile, validatePassword, normalizeMobile } = require('../utils/validation');
const { auth } = require('../middleware/auth');
const router = express.Router();

// GET /api/auth/user/:mobile - Get user by mobile
router.get('/user/:mobile', auth, async (req, res) => {
  try {
    const { mobile } = req.params;
    const user = await User.findOne({ mobile: normalizeMobile(mobile) }).populate('userRoles.roleId');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
      message: 'User fetched successfully',
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

// PATCH /api/auth/user/:id - Update user
router.patch('/user/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password && !validatePassword(updates.password)) {
      return res.status(400).json({ success: false, error: 'Invalid password format' });
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('userRoles.roleId');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('❌ Update user error:', error);
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
});

module.exports = router;