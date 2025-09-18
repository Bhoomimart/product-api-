const mongoose = require('mongoose');


const ReviewSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    rating: { type: Number, min: 0, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
});


const DeliverySchema = new mongoose.Schema({
    city: { type: String },
    code: { type: String },
});


const ImageSchema = new mongoose.Schema({
    url: { type: String },
    public_id: { type: String },
});


const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    images: [ImageSchema], // array of images stored in Cloudinary
    reviews: [ReviewSchema],
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    coupon: { type: String, default: '' },
    offers: { type: String, default: '' },
    warranty: { type: String, default: '' },
    delivery: [DeliverySchema],
    colors: [String],
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Product', ProductSchema);