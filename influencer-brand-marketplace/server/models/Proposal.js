const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  influencerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  proposedRate: {
    type: Number,
    required: true
  },
  deliverables: [{
    type: String
  }],
  timeline: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'negotiating', 'completed'],
    default: 'pending'
  },
  // Negotiation fields
  negotiationHistory: [{
    from: {
      type: String,
      enum: ['influencer', 'brand'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    proposedRate: {
      type: Number
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  // Final agreed terms
  finalRate: {
    type: Number
  },
  finalDeliverables: [{
    type: String
  }],
  finalTimeline: {
    type: String
  },
  // Payment information
  paymentStatus: {
    type: String,
    enum: ['pending', 'escrow', 'released', 'completed'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number
  },
  paymentDate: {
    type: Date
  },
  // File attachments
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Review and rating (after completion)
  brandRating: {
    type: Number,
    min: 1,
    max: 5
  },
  influencerRating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
proposalSchema.index({ campaignId: 1, influencerId: 1 }, { unique: true });
proposalSchema.index({ status: 1 });
proposalSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Proposal', proposalSchema);
