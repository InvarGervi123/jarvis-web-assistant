const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

function createToken(user) {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// רישום
router.post('/register', async (req, res, next) => {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res
                .status(409)
                .json({ message: 'User with this email already exists' });
        }

        const passwordHash = await User.hashPassword(password);

        const user = await User.create({
            email,
            name,
            passwordHash
        });

        const token = createToken(user);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
});

// התחברות
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.checkPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = createToken(user);

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
