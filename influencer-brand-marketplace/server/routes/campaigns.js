const express = require('express');
const Campaign = require('../models/Campaign');
const Brand = require('../models/Brand');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all campaigns
router.get('/', auth, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'active' }).populate('brandId', 'companyName');
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get campaign by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('brandId', 'companyName website');
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create campaign
router.post('/create', auth, async (req, res) => {
  try {
    const { title, description, budget, requirements, categories, platforms, deadline } = req.body;
    
    // Check if user is a brand
    const brand = await Brand.findOne({ userId: req.user.id });
    if (!brand) {
      return res.status(403).json({ message: 'Only brands can create campaigns' });
    }
    
    const campaign = new Campaign({
      brandId: brand._id,
      title,
      description,
      budget,
      requirements,
      categories,
      platforms,
      deadline
    });
    
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update campaign
router.put('/:id', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    // Check if user owns the campaign
    const brand = await Brand.findOne({ userId: req.user.id });
    if (!brand || campaign.brandId.toString() !== brand._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updates = req.body;
    const updatedCampaign = await Campaign.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply to campaign
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    // Check if user is an influencer
    if (req.user.role !== 'influencer') {
      return res.status(403).json({ message: 'Only influencers can apply' });
    }
    
    // Check if already applied
    const existingProposal = campaign.proposals.find(p => p.influencerId.toString() === req.user.id);
    if (existingProposal) {
      return res.status(400).json({ message: 'Already applied' });
    }
    
    campaign.proposals.push({
      influencerId: req.user.id,
      message
    });
    
    await campaign.save();
    res.json({ message: 'Application submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept or reject proposal
router.put('/:id/proposals/:proposalId', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if user owns the campaign
    const brand = await Brand.findOne({ userId: req.user.id });
    if (!brand || campaign.brandId.toString() !== brand._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const proposal = campaign.proposals.id(req.params.proposalId);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    proposal.status = status;
    await campaign.save();

    res.json({ message: `Proposal ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
