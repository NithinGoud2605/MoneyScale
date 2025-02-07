const express = require("express");
const { createAccount, getAccounts, updateAccount, deleteAccount } = require("../controllers/accountController");
const authMiddleware = require("../middleware/authMiddleware"); // Protect routes

const router = express.Router();

router.post("/", authMiddleware, createAccount); // Create an account
router.get("/", authMiddleware, getAccounts); // Get all accounts for the user
router.put("/:id", authMiddleware, updateAccount); // Update account
router.delete("/:id", authMiddleware, deleteAccount); // Delete account

module.exports = router;
