// routes/register.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const UserRole = require('../models/UserRole');
const Mess = require('../models/Mess');
const {
  validateMobile,
  validateEmail,
  validatePassword,
  validateUsername,
  normalizeMobile,
} = require('../utils/validation');
const { authRateLimit } = require('../middleware/auth');

const router = express.Router();

const ROLE_MAP = {
  consumer: 'Mess User',
  owner: 'Mess Owner',
};

// POST /api/auth/register - Register new user
router.post('/', authRateLimit, async (req, res) => {
  try {
    const {
      mobile,
      username,
      email,
      password,
      role,
      fullName,
      address,
      messName,
      ownerName,
      messAddress,
    } = req.body;

    // Validate required fields
    if (!mobile || !username || !email || !password || !role) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Validate role
    const roleName = ROLE_MAP[role];
    if (!roleName) {
      return res.status(400).json({ success: false, error: 'Invalid role provided' });
    }

    // Validate input formats
    if (!validateMobile(mobile)) return res.status(400).json({ success: false, error: 'Invalid mobile number' });
    if (!validateEmail(email)) return res.status(400).json({ success: false, error: 'Invalid email address' });
    if (!validatePassword(password)) return res.status(400).json({ success: false, error: 'Invalid password format' });
    if (!validateUsername(username)) return res.status(400).json({ success: false, error: 'Invalid username' });

    // Role-specific validation
    if (role === 'consumer' && (!fullName || !address)) {
      return res.status(400).json({ success: false, error: 'Full name and address required for Mess User' });
    }
    if (role === 'owner' && (!messName || !ownerName || !messAddress)) {
      return res.status(400).json({ success: false, error: 'Mess details required for Mess Owner' });
    }

    // Normalize mobile
    const normalizedMobile = normalizeMobile(mobile);

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ mobile: normalizedMobile }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userData = {
      username,
      email,
      mobile: normalizedMobile,
      password: hashedPassword,
      ...(role === 'consumer' && { fullName, address }),
    };
    const user = new User(userData);
    await user.save();

    // Assign role
    let roleDoc = await Role.findOne({ roleName });
    if (!roleDoc) {
      roleDoc = new Role({ roleName });
      await roleDoc.save();
    }

    const userRole = new UserRole({ userId: user._id, roleId: roleDoc._id });
    await userRole.save();

    // Create mess for owner
    if (role === 'owner') {
      const mess = new Mess({
        messName,
        ownerId: user._id,
        mobile: normalizedMobile,
        address: messAddress,
        ownerName,
        isActive: true,
      });
      await mess.save();
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          mobile: user.mobile,
        },
        token,
        role: roleName,
      },
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    return res.status(500).json({ success: false, error: `Registration failed: ${error.message}` });
  }
});

module.exports = router;