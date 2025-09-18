const express = require('express');
const Influencer = require('../models/Influencer');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get influencer profile
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const influencer = await Influencer.findOne({ userId: req.params.id }).populate('userId', 'name email');
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }
    res.json(influencer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update influencer profile
router.put('/update/:id', auth, async (req, res) => {
  try {
    const { bio, categories, socialPlatforms } = req.body;
    const influencer = await Influencer.findOneAndUpdate(
      { userId: req.params.id },
      { bio, categories, socialPlatforms },
      { new: true }
    );
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }
    res.json(influencer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Onboard influencer
router.post('/onboard', auth, async (req, res) => {
  try {
    const { bio, categories, socialPlatforms } = req.body;
    
    // Check if influencer profile already exists
    const existingInfluencer = await Influencer.findOne({ userId: req.user.id });
    if (existingInfluencer) {
      return res.status(400).json({ message: 'Profile already exists' });
    }
    
    const influencer = new Influencer({
      userId: req.user.id,
      bio,
      categories,
      socialPlatforms
    });
    
    await influencer.save();
    
    // Update user profileCompleted
    await User.findByIdAndUpdate(req.user.id, { profileCompleted: true });
    
    res.status(201).json(influencer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Instagram stats
router.get('/:id/instagram-stats', auth, async (req, res) => {
  try {
    const influencer = await Influencer.findOne({ userId: req.params.id });
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }
    res.json(influencer.instagramStats || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
