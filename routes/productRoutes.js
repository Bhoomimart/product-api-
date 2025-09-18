const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const productController = require('../controllers/productController');

router.post('/', upload.array('images', 6), productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', upload.array('images', 6), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
