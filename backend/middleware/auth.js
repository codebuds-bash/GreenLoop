const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the hashed password with the provided password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,  // Ensure you have JWT_SECRET in your .env
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {   
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already taken, please choose a different one' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword,  // Store the hashed password
            role,
            profileImage: null, // Default value
             // Default account type
        });

        await user.save();  // Save the user to the database
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
                
            },
        });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;

