const Product = require("../models/Product");

// ✅ CREATE PRODUCT
exports.createProduct = async (req, res) => {
    try {
        // 🟢 If images uploaded through multer
        const imagePaths = req.files ? req.files.map(file => file.path) : [];

        const {
            name,
            reviews,
            price,
            discount,
            coupon,
            offers,
            warranty,
            delivery,
            colors,
            description,
        } = req.body;

        // 🟢 Parse delivery (array of objects) if sent as JSON string in Postman
        let deliveryParsed = [];
        if (delivery) {
            deliveryParsed = typeof delivery === "string" ? JSON.parse(delivery) : delivery;
        }

        // 🟢 Parse colors array if sent as JSON string
        let colorParsed = [];
        if (colors) {
            colorParsed = typeof colors === "string" ? JSON.parse(colors) : colors;
        }

        const newProduct = new Product({
            name,
            reviews,
            price,
            discount,
            coupon,
            offers,
            warranty,
            delivery: deliveryParsed,
            colors: colorParsed,
            description,
            images: imagePaths, // stored array of image paths
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: newProduct,
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single product
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const { name, reviews, price, discount, coupon, offers, warranty, delivery, colors, description } = req.body;

        let updateData = {
            name,
            reviews,
            price,
            discount,
            coupon,
            offers,
            warranty,
            delivery: delivery ? JSON.parse(delivery) : [],
            colors: colors ? JSON.parse(colors) : [],
            description,
        };

        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => file.path); // ✅ replace old images
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
