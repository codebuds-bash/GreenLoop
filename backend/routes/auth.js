const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Import the User model

const router = express.Router();

// Registration endpoint
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

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
        });

        await user.save();  // Save the user to the database
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
});


// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            // Return a generic error message (don't specify if the email or password is incorrect)
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Return a generic error message (don't specify if the email or password is incorrect)
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create a JWT token with the user's ID and role
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Send the token and user information (excluding password) as the response
        const userProfile = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        // Successful login response
        res.json({ token, userProfile });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;
