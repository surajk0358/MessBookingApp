// utils/validation.js
const mongoose = require('mongoose');

const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const validateMobile = (mobile) => {
  const mobileRegex = /^(\+91|91)?[6-9]\d{9}$/;
  return mobileRegex.test(mobile.replace(/\s/g, ''));
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateCoordinates = (lat, lon) => {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    lat >= -90 && lat <= 90 &&
    lon >= -180 && lon <= 180
  );
};

const sanitizeString = (str, maxLength = 255) => {
  if (typeof str !== 'string') return '';
  return str.trim().substring(0, maxLength);
};

const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

const normalizeMobile = (mobile) => {
  const cleaned = mobile.replace(/\s/g, '');
  if (cleaned.startsWith('+91')) return cleaned;
  if (cleaned.startsWith('91')) return `+${cleaned}`;
  if (/^[6-9]\d{9}$/.test(cleaned)) return `+91${cleaned}`;
  return mobile;
};

const validateRole = (role) => {
  return ['Mess User', 'Mess Owner'].includes(role);
};

module.exports = {
  validateObjectId,
  validateMobile,
  validateEmail,
  validateCoordinates,
  sanitizeString,
  validatePassword,
  validateUsername,
  normalizeMobile,
  validateRole,
};