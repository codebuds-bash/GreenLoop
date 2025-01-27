const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');
const authRoutes = require('./routes/auth'); 
const Product = require('./models/Product'); 
const productRoutes = require('./routes/products');
const profileRoutes = require('./routes/profile');
const User = require('./models/User');  
const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const allowedOrigins = [
  'www.greenloop.site', // Production frontend URL
  'http://127.0.0.1:5500', // Local development frontend URL
];

app.use(cors({
  origin: 'https://www.greenloop.site', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies or authorization headers
}));
app.use(express.json());






app.post('/alexa/order', (req, res) => {
  const alexaRequest = req.body;

  // Check if the request is valid and contains the intent
  if (
    alexaRequest.request &&
    alexaRequest.request.type === 'IntentRequest' &&
    alexaRequest.request.intent.name === 'OrderIntent'
  ) {
    // Extract the 'item' slot value
    const item = alexaRequest.request.intent.slots.item?.value;

    if (item) {
      // Process the order (you can integrate database logic here)
      console.log(`Received order for: ${item}`);

      // Respond to Alexa
      res.json({
        version: '1.0',
        response: {
          outputSpeech: {
            type: 'PlainText',
            text: `Your order for ${item} has been placed successfully!`,
          },
          shouldEndSession: true,
        },
      });
    } else {
      // Handle missing slot value
      res.json({
        version: '1.0',
        response: {
          outputSpeech: {
            type: 'PlainText',
            text: "I didn't catch what you'd like to order. Can you please repeat that?",
          },
          shouldEndSession: false,
        },
      });
    }
  } else {
    // Handle invalid Alexa request
    res.status(400).json({ message: 'Invalid request from Alexa.' });
  }
});

// Use authRoutes for handling authentication
app.use('/api/auth', authRoutes);
// Add the profile routes
app.use('/api/profile', profileRoutes);

app.use('/api/products', productRoutes);

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
// Get Profile Page (using EJS)
app.get('/profile', async (req, res) => {
  const userId = req.query.userId; // You can dynamically set this from session or other means
  try {
    const user = await User.findById(userId);
    if (user) {
      // Render the profile page with user data using EJS
      res.render('profile', { 
        name: user.name, 
        email: user.email, 
        accountType: user.accountType,
        points: user.sustainabilityPoints,
        imageUrl: user.imageUrl || '/images/default-profile.png',
      });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});