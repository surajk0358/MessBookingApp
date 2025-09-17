// routes/auth.js - Updated with login
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const UserRole = require('../models/UserRole');
const { validateMobile, validateEmail } = require('../utils/validation');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { mobile, username, email, password, role: roleName } = req.body;

    if (!mobile || !username || !email || !password || !roleName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validateMobile(mobile) || !validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid mobile or email format' });
    }

    // Check if user exists
    let user = await User.findOne({ mobile });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    user = new User({
      username,
      email,
      mobile,
      password: hashedPassword
    });
    await user.save();

    // Find or create role
    let role = await Role.findOne({ roleName: roleName === 'consumer' ? 'Mess User' : 'Mess Owner' });
    if (!role) {
      role = new Role({ roleName: roleName === 'consumer' ? 'Mess User' : 'Mess Owner' });
      await role.save();
    }

    // Create UserRole
    const userRole = new UserRole({
      userId: user._id,
      roleId: role._id
    });
    await userRole.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user, token, role: role.roleName });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be username, email, or mobile

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and password required' });
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }, { mobile: identifier }]
    }).populate('userRoles.roleId');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const roles = user.userRoles.map(ur => ur.roleId.roleName);

    res.json({ user, token, role: roles[0] }); // Assume single role
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get user by mobile
router.get('/user/:mobile', async (req, res) => {
  try {
    const { mobile } = req.params;
    const user = await User.findOne({ mobile }).populate('userRoles.roleId');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user
router.patch('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(id, updates, { 
      new: true, 
      runValidators: true 
    }).populate('userRoles.roleId');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;