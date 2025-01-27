const express = require('express');
const router = express.Router();

// Import the RecyclingItem model
const RecyclingItem = require('../models/recyclingItem');

// Middleware to log requests (optional)
router.use((req, res, next) => {
  console.log('Recycling item route accessed');
  next(); // Pass control to the next middleware or route handler
});

// GET all recycling items
router.get('/', async (req, res) => {
  try {
    const items = await RecyclingItem.find(); // Fetch all recycling items
    res.status(200).json(items); // Return the list of items
  } catch (error) {
    console.error('Error fetching recycling items:', error);
    res.status(500).json({ error: 'Error fetching recycling items' });
  }
});

// GET recycling item by ID
router.get('/:id', async (req, res) => {
  const itemId = req.params.id;
  try {
    const item = await RecyclingItem.findById(itemId); // Fetch item by ID
    if (!item) {
      return res.status(404).json({ message: 'Recycling item not found' });
    }
    res.status(200).json(item); // Return the item
  } catch (error) {
    console.error('Error fetching recycling item:', error);
    res.status(500).json({ error: 'Error fetching recycling item' });
  }
});

// POST a new recycling item
router.post('/', async (req, res) => {
  try {
    const newItem = new RecyclingItem(req.body);

    // Save the new item to the database
    await newItem.save();
    res.status(201).json({ message: 'Recycling item created', item: newItem });
  } catch (error) {
    console.error('Error creating recycling item:', error);
    res.status(500).json({ error: 'Error creating recycling item' });
  }
});

// PUT (update) a recycling item by ID
router.put('/:id', async (req, res) => {
  const itemId = req.params.id;
  try {
    const updatedItem = await RecyclingItem.findByIdAndUpdate(itemId, req.body, {
      new: true, // Return the updated document
    });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Recycling item not found' });
    }

    res.status(200).json({ message: 'Recycling item updated', item: updatedItem });
  } catch (error) {
    console.error('Error updating recycling item:', error);
    res.status(500).json({ error: 'Error updating recycling item' });
  }
});

// DELETE a recycling item by ID
router.delete('/:id', async (req, res) => {
  const itemId = req.params.id;
  try {
    const deletedItem = await RecyclingItem.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Recycling item not found' });
    }

    res.status(200).json({ message: 'Recycling item deleted', item: deletedItem });
  } catch (error) {
    console.error('Error deleting recycling item:', error);
    res.status(500).json({ error: 'Error deleting recycling item' });
  }
});

module.exports = router; // Export the router to use in app.js
