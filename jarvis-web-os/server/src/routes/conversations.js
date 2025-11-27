const express = require('express');
const auth = require('../middleware/auth');
const Conversation = require('../models/conversation');
const aiService = require('../services/aiService');

const router = express.Router();

// קבלת כל השיחות של המשתמש
router.get('/', auth, async (req, res, next) => {
    try {
        const conversations = await Conversation.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(conversations);
    } catch (err) {
        next(err);
    }
});

// יצירת שיחה חדשה + תשובת AI
router.post('/', auth, async (req, res, next) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const aiReply = await aiService.reply({
            message,
            user: req.user,
            context
        });

        const conversation = await Conversation.create({
            userId: req.user._id,
            title: message.slice(0, 40),
            messages: [
                { role: 'user', content: message },
                { role: 'assistant', content: aiReply }
            ]
        });

        res.status(201).json({
            conversationId: conversation._id,
            reply: aiReply,
            conversation
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
