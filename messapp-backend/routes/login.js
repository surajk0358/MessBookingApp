// routes/login.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { normalizeMobile } = require('../utils/validation');
const { authRateLimit } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login - Login user with username, email, or mobile
router.post('/', authRateLimit, async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, error: 'Identifier and password are required' });
    }

    // Find user
    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { mobile: normalizeMobile(identifier) },
      ],
    }).populate('userRoles.roleId');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Extract roles
    const roles = user.userRoles?.map(ur => ur.roleId?.roleName) || [];

    // Return safe user info
    const safeUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
    };

    return res.json({
      success: true,
      data: { user: safeUser, token, roles },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return res.status(500).json({ success: false, error: `Login failed: ${error.message}` });
  }
});

module.exports = router;