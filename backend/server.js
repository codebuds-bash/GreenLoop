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

// Multer configuration for file upload
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage });

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
  imageUrl: { type: String, required: true }, // Store the Cloudinary URL
});

const Product = mongoose.model('Product', productSchema);

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

// Add New Product Route with Image Upload
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required!' });
    }

    // Upload the image to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary Error:', error);
          return res.status(500).json({ error: 'Image upload failed!' });
        }

        const imageUrl = result.secure_url;

        // Create and save the product
        const newProduct = new Product({
          name,
          description,
          price,
          imageUrl,
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
      }
    );

    // Stream file buffer to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (error) {
    console.error('Error adding product:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
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
