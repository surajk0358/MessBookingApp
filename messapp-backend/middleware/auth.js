// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserRole = require('../models/UserRole');

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided. Access denied.',
      });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided. Access denied.',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token. User not found.',
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Account is deactivated. Please contact support.',
        });
      }

      if (user.isLocked) {
        return res.status(401).json({
          success: false,
          error: 'Account is temporarily locked.',
        });
      }

      const userRoleMapping = await UserRole.findOne({ userId: user._id })
        .populate('roleId', 'roleName');

      const role = userRoleMapping ? userRoleMapping.roleId.roleName : null;

      req.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role,
        isEmailVerified: user.isEmailVerified,
        isMobileVerified: user.isMobileVerified,
      };

      next();
    } catch (tokenError) {
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token expired. Please login again.',
          code: 'TOKEN_EXPIRED',
        });
      }

      if (tokenError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: 'Invalid token format.',
          code: 'INVALID_TOKEN',
        });
      }

      throw tokenError;
    }
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    return res.status(500).json({ success: false, error: 'Authentication failed' });
  }
};

// Owner-only middleware
const ownerOnly = async (req, res, next) => {
  if (req.user.role !== 'Mess Owner') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Mess Owner role required.',
    });
  }
  next();
};

// Consumer-only middleware
const consumerOnly = async (req, res, next) => {
  if (req.user.role !== 'Mess User') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Mess User role required.',
    });
  }
  next();
};

// Verified-only middleware
const verifiedOnly = async (req, res, next) => {
  if (!req.user.isEmailVerified || !req.user.isMobileVerified) {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Email and mobile verification required.',
    });
  }
  next();
};

// Rate limiting middleware for auth routes
const authRateLimit = (() => {
  const attempts = new Map();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  return (req, res, next) => {
    const ip = req.ip;
    const identifier = req.body.email || req.body.mobile || req.body.username || ip;
    const key = `${ip}-${identifier}`;

    const now = Date.now();
    let userAttempts = attempts.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > userAttempts.resetTime) {
      userAttempts = { count: 0, resetTime: now + windowMs };
    }

    if (userAttempts.count >= maxAttempts) {
      const timeLeft = Math.ceil((userAttempts.resetTime - now) / 1000 / 60);
      return res.status(429).json({
        success: false,
        error: `Too many attempts. Try again in ${timeLeft} minutes.`,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: timeLeft * 60,
      });
    }

    userAttempts.count += 1;
    attempts.set(key, userAttempts);

    if (Math.random() < 0.1) {
      const cutoff = now - windowMs;
      for (const [k, v] of attempts.entries()) {
        if (v.resetTime < cutoff) {
          attempts.delete(k);
        }
      }
    }

    next();
  };
})();

// Optional authentication middleware
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      const user = await User.findById(decoded.userId);

      if (user && user.isActive && !user.isLocked) {
        const userRoleMapping = await UserRole.findOne({ userId: user._id })
          .populate('roleId', 'roleName');

        const role = userRoleMapping ? userRoleMapping.roleId.roleName : null;

        req.user = {
          id: user._id,
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          role,
          isEmailVerified: user.isEmailVerified,
          isMobileVerified: user.isMobileVerified,
        };
      }
    } catch (tokenError) {
      console.log('❌ Optional auth failed:', tokenError.message);
    }

    next();
  } catch (error) {
    console.error('❌ Optional auth middleware error:', error);
    next();
  }
};

module.exports = {
  auth,
  ownerOnly,
  consumerOnly,
  verifiedOnly,
  authRateLimit,
  optionalAuth,
};