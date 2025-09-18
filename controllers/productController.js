const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinary');

// helper function
async function uploadBufferToCloudinary(buffer, folder = 'products') {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve({ url: result.secure_url, public_id: result.public_id });
            }
        );
        stream.end(buffer);
    });
}

// create product
const createProduct = async (req, res, next) => {
    try {
        const { name, price, discount, coupon, offers, warranty, delivery, colors, description } = req.body;

        const product = new Product({
            name,
            price,
            discount: discount || 0,
            coupon: coupon || '',
            offers: offers || '',
            warranty: warranty || '',
            description: description || '',
        });

        if (delivery) {
            product.delivery = typeof delivery === 'string' ? JSON.parse(delivery) : delivery;
        }
        if (colors) {
            product.colors = typeof colors === 'string' ? JSON.parse(colors) : colors;
        }

        if (req.files && req.files.length > 0) {
            const uploaded = await Promise.all(req.files.map(f => uploadBufferToCloudinary(f.buffer)));
            product.images = uploaded;
        }

        const saved = await product.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

// get all
const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        next(err);
    }
};

// get by id
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        next(err);
    }
};

// update
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const updates = req.body || {};
        if (updates.delivery) updates.delivery = typeof updates.delivery === 'string' ? JSON.parse(updates.delivery) : updates.delivery;
        if (updates.colors) updates.colors = typeof updates.colors === 'string' ? JSON.parse(updates.colors) : updates.colors;

        Object.assign(product, updates);

        if (req.files && req.files.length > 0) {
            const uploaded = await Promise.all(req.files.map(f => uploadBufferToCloudinary(f.buffer)));
            product.images = product.images.concat(uploaded);
        }

        const saved = await product.save();
        res.json(saved);
    } catch (err) {
        next(err);
    }
};

// delete
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (product.images?.length) {
            await Promise.all(product.images.map(img => cloudinary.uploader.destroy(img.public_id).catch(() => null)));
        }

        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } catch (err) {
        next(err);
    }
};

// ✅ CommonJS proper export
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
