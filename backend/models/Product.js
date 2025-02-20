const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, default: 1 }
});

module.exports = mongoose.model("CartItem", CartItemSchema);
