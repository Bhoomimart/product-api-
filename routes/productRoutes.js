const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

// ✅ Multiple images
router.post("/", upload.array("images", 5), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
