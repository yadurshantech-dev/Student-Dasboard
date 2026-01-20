const mongoose = require('mongoose');

const adminSchema = mongoose.Schema(
    {
        mobile: {
            type: String,
            required: true,
            unique: true,
        },
        // In a real app, this would be a hashed password. 
        // For this demo, we are authentication logic in the controller/middleware directly or using a simple check.
        // However, storing the mobile number is enough to "register" them as per requirements.
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Admin', adminSchema);
