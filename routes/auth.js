const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword});
        await user.save();
        res.status(201).json({ message: 'User registered succesfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message});
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed'});
        }
        const token = jwt.sign({ userID: user._id}, 'your-secret-key', {
            expiresIn: '1h',
        });
        res.status(200).json({ token});
    } catch (error) {
        res.status(500).json({ error: 'Login failed'});
    }
});

module.exports = router;