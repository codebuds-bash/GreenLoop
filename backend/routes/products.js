const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Adjust the path as needed

// Edit Product Endpoint
router.put('/:productId', async (req, res) => {
  const { productId } = req.params;
  const { name, description, price, imageUrl } = req.body;

  try {
    // Find the product by ID and update its details
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, price, imageUrl },
      { new: true, runValidators: true } // Options: return updated document and validate schema
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product', error });
  }
});

module.exports = router;
