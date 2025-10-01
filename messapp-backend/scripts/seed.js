// scripts/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const UserRole = require('../models/UserRole');
const Mess = require('../models/Mess');
const MessMenu = require('../models/MessMenu');
const Plan = require('../models/Plan');
const MessUsers = require('../models/MessUsers');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Role.deleteMany({}),
      UserRole.deleteMany({}),
      Mess.deleteMany({}),
      MessMenu.deleteMany({}),
      Plan.deleteMany({}),
      MessUsers.deleteMany({}),
    ]);

    // Seed roles
    const roles = await Role.insertMany([
      { roleName: 'Mess Owner' },
      { roleName: 'Mess User' },
    ]);

    // Seed users
    const hashedPassword = await bcrypt.hash('password123', 12);
    const users = await User.insertMany([
      {
        username: 'johnconsumer',
        email: 'john@example.com',
        mobile: '+919876543210',
        password: hashedPassword,
        isActive: true,
        isLocked: false,
        isEmailVerified: true,
        isMobileVerified: true,
      },
      {
        username: 'sarahowner',
        email: 'sarah@example.com',
        mobile: '+919876543211',
        password: hashedPassword,
        isActive: true,
        isLocked: false,
        isEmailVerified: true,
        isMobileVerified: true,
      },
    ]);

    // Create UserRoles
    await UserRole.insertMany([
      { userId: users[0]._id, roleId: roles[1]._id }, // Consumer
      { userId: users[1]._id, roleId: roles[0]._id }, // Owner
    ]);

    // Seed mess
    const mess = await Mess.create({
      messName: 'Healthy Tiffin Service',
      ownerId: users[1]._id,
      mobile: '+919876543211',
      isActive: true,
    });

    // Seed menu
    const today = new Date();
    await MessMenu.create({
      messId: mess._id,
      menuDate: today,
      mealType: 'Lunch',
      itemName: 'Dal Rice',
    });

    // Seed plan
    const plan = await Plan.create({
      messId: mess._id,
      planName: 'Monthly Plan',
      durationDays: 30,
      status: 'Active',
    });

    // Seed MessUsers (subscription)
    await MessUsers.create({
      messId: mess._id,
      userId: users[0]._id,
      planId: plan._id,
      startDate: today,
      endDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
      status: 'Active',
    });

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📴 MongoDB disconnected');
  }
};

if (require.main === module) {
  seedData();
}