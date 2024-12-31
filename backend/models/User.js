const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Add name field
    email: { type: String, required: true, unique: true },  // Add email field (unique)
  // Retain username
    password: { type: String, required: true },  // Retain password
    role: { type: String, enum: ['consumer', 'retailer', 'manufacturer'], required: true },  // Retain role
});

// Hash password before saving to database
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
