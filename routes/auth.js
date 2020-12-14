var express = require("express");
const auth = require("../middlewares/jwt");
const AuthController = require("../controllers/AuthController");

var router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/reset-password", AuthController.forgotPassword);

    
module.exports = router;