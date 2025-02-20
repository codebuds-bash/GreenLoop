const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  quantity: { type: Number, default: 1 }
});

// Fix the OverwriteModelError issue
const CartItem = mongoose.models.CartItem || mongoose.model('CartItem', CartItemSchema);

module.exports = CartItem;
