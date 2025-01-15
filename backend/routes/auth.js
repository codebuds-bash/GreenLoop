const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models'); // Import the User model

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password, role, username } = req.body; // Destructure from body

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already taken, please choose a different one' });
        }

        // Create a new user
        const user = new User({
            name,
            email,
            password,  // Password will be hashed automatically due to the pre-save hook
            role,
            username,
            profileImage: null, // Default value
            accountType: 'Basic', // Default account type
        });

        await user.save();  // Save the user to the database

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                username: user.username,
                profileImage: user.profileImage,
                accountType: user.accountType,
            },
        });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
