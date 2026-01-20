const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');

// Simple middleware to protect admin routes
// In a full production app, verify JWT here.
// For this specific requirement, we will assume if the client sends a custom header 'x-admin-auth', they are logged in.
// Or we can just let the login endpoint happen and assume the frontend handles the gatekeeping for this simple demo.
// But to be "secure", let's check for a mock token.

const protect = asyncHandler(async (req, res, next) => {
    // Check for specialized header acting as a "token"
    // The frontend will send '1234-admin-token' if logged in.
    const token = req.headers.authorization;

    if (token && token === 'Bearer 1234-admin-token') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized, admin access only');
    }
});

module.exports = { protect };
