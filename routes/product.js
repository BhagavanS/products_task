var express = require("express");
const ProductController = require("../controllers/ProductController");

var router = express.Router();

router.get("/", ProductController.getAllProducts);
router.post("/", ProductController.addProducts);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;