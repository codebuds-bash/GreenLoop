const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

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

// Add New Product Route
app.post('/api/products', async (req, res) => {
  console.log('Request Body:', req.body); // Log the body
  try {
    const { name, description, price } = req.body;

    // Log each field to check their values
    console.log('Name:', name);
    console.log('Description:', description);
    console.log('Price:', price);

    if (!name || !description || !price) {
      return res.status(400).json({ error: 'All fields are required!' });
    }

    const newProduct = new Product({ name, description, price });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully!', product: newProduct });
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
