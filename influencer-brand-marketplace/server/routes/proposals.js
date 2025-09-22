const express = require('express');
const mongoose = require('mongoose');
const Proposal = require('../models/Proposal');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const { sendProposalNotification } = require('../services/emailService');
const router = express.Router();

// Middleware to check authentication
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Submit a proposal to a campaign
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { campaignId, message, proposedRate, deliverables, timeline } = req.body;
    const influencerId = req.user.id;

    // Check if campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if user is an influencer
    const user = await User.findById(influencerId);
    if (user.role !== 'influencer') {
      return res.status(403).json({ message: 'Only influencers can submit proposals' });
    }

    // Check if proposal already exists
    const existingProposal = await Proposal.findOne({ campaignId, influencerId });
    if (existingProposal) {
      return res.status(400).json({ message: 'You have already submitted a proposal for this campaign' });
    }

    // Create proposal
    const proposal = new Proposal({
      campaignId,
      influencerId,
      brandId: campaign.brandId,
      message,
      proposedRate,
      deliverables,
      timeline,
      status: 'pending'
    });

    await proposal.save();

    // Send notification to brand
    const brand = await User.findById(campaign.brandId);
    if (brand && brand.email) {
      await sendProposalNotification(brand.email, campaign.title, user.name);
    }

    res.status(201).json({
      message: 'Proposal submitted successfully',
      proposal: {
        id: proposal._id,
        campaignId: proposal.campaignId,
        message: proposal.message,
        proposedRate: proposal.proposedRate,
        deliverables: proposal.deliverables,
        timeline: proposal.timeline,
        status: proposal.status,
        createdAt: proposal.createdAt
      }
    });
  } catch (error) {
    console.error('Submit proposal error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get proposals for a campaign (for brands)
router.get('/campaign/:campaignId', authMiddleware, async (req, res) => {
  try {
    const { campaignId } = req.params;
    const userId = req.user.id;

    // Check if campaign exists and user is the brand
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.brandId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const proposals = await Proposal.find({ campaignId })
      .populate('influencerId', 'name email bio avatar socialMedia')
      .sort({ createdAt: -1 });

    res.json({ proposals });
  } catch (error) {
    console.error('Get campaign proposals error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get proposals by an influencer
router.get('/my-proposals', authMiddleware, async (req, res) => {
  try {
    const influencerId = req.user.id;

    const proposals = await Proposal.find({ influencerId })
      .populate('campaignId', 'title description budget categories')
      .populate('brandId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ proposals });
  } catch (error) {
    console.error('Get my proposals error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Update proposal status (for brands)
router.put('/:proposalId/status', authMiddleware, async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { status, message } = req.body;
    const userId = req.user.id;

    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Check if user is the brand
    if (proposal.brandId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update status
    proposal.status = status;

    // Add to negotiation history if there's a message
    if (message) {
      proposal.negotiationHistory.push({
        from: 'brand',
        message,
        timestamp: new Date()
      });
    }

    proposal.updatedAt = new Date();
    await proposal.save();

    res.json({
      message: 'Proposal status updated successfully',
      proposal: {
        id: proposal._id,
        status: proposal.status,
        negotiationHistory: proposal.negotiationHistory
      }
    });
  } catch (error) {
    console.error('Update proposal status error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Negotiate proposal (for influencers)
router.put('/:proposalId/negotiate', authMiddleware, async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { message, proposedRate } = req.body;
    const userId = req.user.id;

    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Check if user is the influencer
    if (proposal.influencerId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Add to negotiation history
    proposal.negotiationHistory.push({
      from: 'influencer',
      message,
      proposedRate,
      timestamp: new Date()
    });

    // Update proposal status to negotiating
    proposal.status = 'negotiating';
    proposal.updatedAt = new Date();
    await proposal.save();

    res.json({
      message: 'Negotiation message sent successfully',
      proposal: {
        id: proposal._id,
        status: proposal.status,
        negotiationHistory: proposal.negotiationHistory
      }
    });
  } catch (error) {
    console.error('Negotiate proposal error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Accept final terms (for both parties)
router.put('/:proposalId/accept', authMiddleware, async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { finalRate, finalDeliverables, finalTimeline } = req.body;
    const userId = req.user.id;

    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Check if user is involved in the proposal
    if (proposal.influencerId.toString() !== userId && proposal.brandId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update final terms
    proposal.finalRate = finalRate;
    proposal.finalDeliverables = finalDeliverables;
    proposal.finalTimeline = finalTimeline;
    proposal.status = 'accepted';
    proposal.updatedAt = new Date();

    await proposal.save();

    res.json({
      message: 'Proposal terms accepted successfully',
      proposal: {
        id: proposal._id,
        status: proposal.status,
        finalRate: proposal.finalRate,
        finalDeliverables: proposal.finalDeliverables,
        finalTimeline: proposal.finalTimeline
      }
    });
  } catch (error) {
    console.error('Accept proposal error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get proposal details
router.get('/:proposalId', authMiddleware, async (req, res) => {
  try {
    const { proposalId } = req.params;
    const userId = req.user.id;

    const proposal = await Proposal.findById(proposalId)
      .populate('campaignId', 'title description budget categories platforms')
      .populate('influencerId', 'name email bio avatar socialMedia')
      .populate('brandId', 'name email');

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Check if user is involved in the proposal
    if (proposal.influencerId._id.toString() !== userId && proposal.brandId._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ proposal });
  } catch (error) {
    console.error('Get proposal details error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
