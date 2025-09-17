//messapp-backend/utils/validation.js
const mongoose = require('mongoose');

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateMobile = (mobile) => /^\+91[6-9]\d{9}$/.test(mobile);

const validateEmail = (email) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

const validateCoordinates = (lat, lon) => (
  typeof lat === 'number' && typeof lon === 'number' &&
  lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
);

const sanitizeString = (str, maxLength = 255) => {
  if (typeof str !== 'string') return '';
  return str.trim().substring(0, maxLength);
};

module.exports = {
  validateObjectId,
  validateMobile,
  validateEmail,
  validateCoordinates,
  sanitizeString
};