const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS to allow requests from specific origins
const allowedOrigins = ['http://127.0.0.1:5500']; // Update with your frontend URL
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware to parse JSON and handle form data
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (HTML, CSS, JS) from the frontend/public folder
app.use(express.static(path.join(__dirname, 'frontend/public')));

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
  console.log('Request Body:', req.body); // Log the body
  console.log('Uploaded file:', req.file); // Check the uploaded file

  // Check if the required fields are provided
  if (!req.body.name || !req.body.description || !req.body.price) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // Check if an image is uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required!' });
  }

  // Upload the image to Cloudinary
  try {
    const uploadResponse = await cloudinary.uploader.upload_stream(
      { resource_type: 'image' }, 
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
        }

        // Image URL from Cloudinary's response
        const imageUrl = result.secure_url;

        // Create a new product and save to the database
        const { name, description, price } = req.body;
        const newProduct = new Product({
          name,
          description,
          price,
          imageUrl // Store Cloudinary image URL
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

    // Write the file to the Cloudinary upload stream
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

    // Find and delete the product by its ID
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
// Delete Product Route
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Find and delete the product by its ID
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
// Catch-all Route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
