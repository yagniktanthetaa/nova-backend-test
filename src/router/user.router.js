const express = require("express");
const router = express.Router();

// Controller
const userController = require("../controller/user.controller");

// Router
router.post("/getAssets", userController.getAssetsFromWallet);
router.post("/getAssetsWallet", userController.getAssetsFromWalletBlockForest);

// Router Exports
module.exports = router;
