const express = require('express');
const MessMenu = require('../models/MessMenu');
const Mess = require('../models/Mess');
const { auth, ownerOnly } = require('../middleware/auth');
const { validateObjectId } = require('../utils/validation');

const router = express.Router();

// GET /api/messMenus/:messId - Get all menu items for a specific mess
router.get('/:messId', async (req, res) => {
  try {
    const { messId } = req.params;

    if (!validateObjectId(messId)) {
      return res.status(400).json({ success: false, error: 'Invalid mess ID' });
    }

    // Verify mess exists
    const mess = await Mess.findById(messId);
    if (!mess) {
      return res.status(404).json({ success: false, error: 'Mess not found' });
    }

    const menus = await MessMenu.find({ messId })
      .sort({ menuDate: -1, mealType: 1 })
      .select('menuDate mealType itemName createdAt');

    return res.json({
      success: true,
      data: menus,
      message: 'Menu items fetched successfully',
    });
  } catch (error) {
    console.error('❌ Get mess menus error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch menu items' });
  }
});

// POST /api/messMenus/:messId - Create a new menu item (Owner only)
router.post('/:messId', auth, ownerOnly, async (req, res) => {
  try {
    const { messId } = req.params;
    const { menuDate, mealType, itemName } = req.body;

    if (!validateObjectId(messId)) {
      return res.status(400).json({ success: false, error: 'Invalid mess ID' });
    }

    if (!menuDate || !['Breakfast', 'Lunch', 'Dinner'].includes(mealType) || !itemName) {
      return res.status(400).json({ success: false, error: 'Missing or invalid required fields' });
    }

    // Verify mess exists and belongs to the authenticated owner
    const mess = await Mess.findOne({ _id: messId, ownerId: req.user.id });
    if (!mess) {
      return res.status(403).json({ success: false, error: 'Mess not found or unauthorized' });
    }

    const menu = new MessMenu({
      messId,
      menuDate: new Date(menuDate),
      mealType,
      itemName,
      createdBy: req.user.id,
    });

    await menu.save();

    return res.status(201).json({
      success: true,
      data: menu,
      message: 'Menu item created successfully',
    });
  } catch (error) {
    console.error('❌ Create mess menu error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Menu item already exists for this date and meal type' });
    }
    return res.status(500).json({ success: false, error: 'Failed to create menu item' });
  }
});

// PUT /api/messMenus/:id - Update a menu item (Owner only)
router.put('/:id', auth, ownerOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { menuDate, mealType, itemName } = req.body;

    if (!validateObjectId(id)) {
      return res.status(400).json({ success: false, error: 'Invalid menu ID' });
    }

    // Verify menu exists and belongs to the owner's mess
    const menu = await MessMenu.findById(id).populate('messId');
    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }
    if (menu.messId.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized to update this menu item' });
    }

    // Update fields if provided
    if (menuDate) menu.menuDate = new Date(menuDate);
    if (mealType) menu.mealType = mealType;
    if (itemName) menu.itemName = itemName;
    menu.modifiedBy = req.user.id;
    menu.modifiedAt = new Date();

    await menu.save();

    return res.json({
      success: true,
      data: menu,
      message: 'Menu item updated successfully',
    });
  } catch (error) {
    console.error('❌ Update mess menu error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Menu item already exists for this date and meal type' });
    }
    return res.status(500).json({ success: false, error: 'Failed to update menu item' });
  }
});

// DELETE /api/messMenus/:id - Delete a menu item (Owner only)
router.delete('/:id', auth, ownerOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ success: false, error: 'Invalid menu ID' });
    }

    // Verify menu exists and belongs to the owner's mess
    const menu = await MessMenu.findById(id).populate('messId');
    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }
    if (menu.messId.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized to delete this menu item' });
    }

    await menu.deleteOne();

    return res.json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete mess menu error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete menu item' });
  }
});

module.exports = router;