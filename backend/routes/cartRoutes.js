const express = require("express");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

const router = express.Router();

// Get all cart items (Populate product details)
router.get("/", async (req, res) => {
    try {
        const items = await CartItem.find().populate("product");
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add item to cart
router.post("/add", async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        let cartItem = await CartItem.findOne({ product: productId });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = new CartItem({ product: productId, quantity });
            await cartItem.save();
        }

        res.json({ success: true, cartItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update quantity
router.put("/update/:id", async (req, res) => {
    try {
        const { quantity } = req.body;
        await CartItem.findByIdAndUpdate(req.params.id, { quantity });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete item
router.delete("/delete/:id", async (req, res) => {
    try {
        await CartItem.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
