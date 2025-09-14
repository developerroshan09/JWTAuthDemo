require('dotenv').config();

const blacklist = require("../blacklist");
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    // Check blacklist
    if (blacklist.has(token)) {
        return res.status(403).json({ error: "Token is invalid (loggedout)" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: error.message});
    }
};

module.exports = verifyToken;