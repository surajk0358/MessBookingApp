//Authentication Middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('userRoles.roleId', 'roleName');
    
    if (!user) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

const ownerOnly = (req, res, next) => {
  const role = req.user.userRoles.find(r => r.roleId.roleName === 'Mess Owner');
  if (!role) {
    return res.status(403).json({ error: 'Access denied. Owner role required.' });
  }
  next();
};

const consumerOnly = (req, res, next) => {
  const role = req.user.userRoles.find(r => r.roleId.roleName === 'Mess User');
  if (!role) {
    return res.status(403).json({ error: 'Access denied. Consumer role required.' });
  }
  next();
};

module.exports = { auth, ownerOnly, consumerOnly };