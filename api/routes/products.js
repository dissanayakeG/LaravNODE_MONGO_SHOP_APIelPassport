const express = require("express");
const router = express.Router();

const productController = require("../controllers/product");
const AuthCheck = require("../middleware/auth-check");

router.get("/", productController.getAllProducts);

router.post("/", AuthCheck, productController.saveProduct);

router.get("/:productId", productController.getProductById);

router.patch("/:productId", AuthCheck, productController.updateProduct);

router.delete("/:productId", AuthCheck, productController.deleteProduct);

module.exports = router;
