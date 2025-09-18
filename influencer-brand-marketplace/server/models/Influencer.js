const mongoose = require('mongoose');

const socialPlatformSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  followers: {
    type: Number,
    default: 0
  }
});

const influencerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  categories: [{
    type: String,
    required: true
  }],
  socialPlatforms: [socialPlatformSchema],
  instagramStats: {
    followers: Number,
    engagementRate: Number,
    posts: [{
      likes: Number,
      comments: Number,
      date: Date
    }],
    followersHistory: [{
      count: Number,
      date: Date
    }],
    engagementHistory: [{
      rate: Number,
      date: Date
    }]
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Influencer', influencerSchema);