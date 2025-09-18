const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    reviews: { type: Number, default: 0 },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    coupon: { type: String },
    offers: { type: String },
    warranty: { type: String },
    delivery: [
        {
            city: String,
            code: String,
        },
    ],
    colors: [String],
    description: { type: String },
    images: [String], // ✅ multiple images array
});

module.exports = mongoose.model("Product", productSchema);
