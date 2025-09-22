const express = require('express');
const Brand = require('../models/Brand');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get brand profile
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const brand = await Brand.findOne({ userId: req.params.id }).populate('userId', 'name email');
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update brand profile
router.put('/profile/:id', auth, async (req, res) => {
  try {
    const { companyName, website, description, industry, logo } = req.body;

    // Check if user owns this profile or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const brand = await Brand.findOneAndUpdate(
      { userId: req.params.id },
      { companyName, website, description, industry, logo },
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json({
      message: 'Brand profile updated successfully',
      brand
    });
  } catch (error) {
    console.error('Update brand profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Onboard brand
router.post('/onboard', auth, async (req, res) => {
  try {
    const { companyName, website, description } = req.body;

    // Check if brand profile already exists
    const existingBrand = await Brand.findOne({ userId: req.user.id });
    if (existingBrand) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const brand = new Brand({
      userId: req.user.id,
      companyName,
      website,
      description
    });

    await brand.save();

    // Update user profileCompleted
    await User.findByIdAndUpdate(req.user.id, { profileCompleted: true });

    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
