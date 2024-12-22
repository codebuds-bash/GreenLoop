const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');
const bcrypt = require('bcrypt'); // Ensure bcrypt is included for password hashing
const jwt = require('jsonwebtoken'); // Include jwt for token generation

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON data

// MongoDB User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Login Route
// Consumer and Retailer Login Endpoint
router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user (either consumer or retailer)
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare the provided password with the stored password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        // Send token and success response
        res.status(200).json({ message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Login Successful`, token });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;

// Configure CORS to allow requests from specific origins
app.use(cors({
  origin: '*', // specify the frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware to parse JSON and handle form data
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Product Schema and Model
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true }, // Field to store image URL
});

const Product = mongoose.model('Product', productSchema);

// Setup Multer storage in memory to upload the image to Cloudinary
const multerStorage = multer.memoryStorage(); // Store file in memory
const upload = multer({ 
  storage: multerStorage, 
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB file size limit
}).single('product-image'); // 'product-image' matches the input field name in the form

// Get All Products Route
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// Add New Product Route
app.post('/api/products', upload, async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Uploaded file:', req.file);

  if (!req.body.name || !req.body.description || !req.body.price) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required!' });
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
        }

        const imageUrl = result.secure_url;
        const { name, description, price } = req.body;
        const newProduct = new Product({
          name,
          description,
          price,
          imageUrl
        });

        try {
          await newProduct.save();
          res.status(201).json({ message: 'Product added successfully!', product: newProduct });
        } catch (error) {
          console.error('Error saving product:', error);
          res.status(500).json({ error: 'Error saving product to database' });
        }
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadResponse);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Product Route
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

// Route to get product information by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Transform the response data
    const productData = {
      _id: product._id.toString(), // Convert ObjectId to string
      name: product.name,
      description: product.description,
      price: product.price, // Assuming price is already a number
      imageUrl: product.imageUrl,
    };

    res.status(200).json(productData);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
