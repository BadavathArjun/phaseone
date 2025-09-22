const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['influencer', 'brand', 'admin'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  // Email verification fields
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  emailVerificationExpires: {
    type: Date,
    default: null
  },
  // Password reset fields
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  // Profile editing fields
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: null
  },
  website: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  // Social media profiles
  socialMedia: {
    instagram: { type: String, default: null },
    twitter: { type: String, default: null },
    linkedin: { type: String, default: null },
    youtube: { type: String, default: null }
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

module.exports = mongoose.model('User', userSchema);