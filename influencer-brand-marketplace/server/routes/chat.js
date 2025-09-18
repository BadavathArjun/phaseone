const express = require('express');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user's chats
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate('participants', 'name email')
      .sort({ lastMessage: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a chat
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).populate('messages.sender', 'name');
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Check if user is participant
    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(chat.messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/:id/send', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Check if user is participant
    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const newMessage = {
      sender: req.user.id,
      content: message
    };
    
    chat.messages.push(newMessage);
    chat.lastMessage = new Date();
    await chat.save();
    
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or get chat between two users
router.post('/create', auth, async (req, res) => {
  try {
    const { recipientId } = req.body;
    
    // Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: { $all: [req.user.id, recipientId] }
    });
    
    if (existingChat) {
      return res.json(existingChat);
    }
    
    const chat = new Chat({
      participants: [req.user.id, recipientId]
    });
    
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
