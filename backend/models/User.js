const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['consumer', 'retailer'], // Only consumer and retailer roles
    },
});

// Export the model
module.exports = mongoose.model('User', userSchema);
