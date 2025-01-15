const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { User } = require('../models'); // Import the User model
const authenticate = require('../middleware/authenticate'); // Middleware to verify JWT

const router = express.Router();

// Multer setup to store file in memory
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage }).single('profile-image');

// Upload profile image
router.post('/upload', authenticate, upload, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Upload image to Cloudinary
        const uploadResponse = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'profiles', resource_type: 'image', width: 200, height: 200, crop: 'fill' }, // Resize to 200x200
                (error, result) => (error ? reject(error) : resolve(result))
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

        const imageUrl = uploadResponse.secure_url;

        // Update the user's profile with the image URL
        const userId = req.user.id; // `req.user` is set by the `authenticate` middleware
        await User.findByIdAndUpdate(userId, { imageUrl }, { new: true });

        res.status(200).json({ message: 'Profile image uploaded successfully', imageUrl });
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
});

module.exports = router;
