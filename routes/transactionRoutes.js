const express = require("express");
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a transaction
router.post("/", authMiddleware, createTransaction);

// Get all transactions for the authenticated user
router.get("/", authMiddleware, getTransactions);

// Update a transaction
router.put("/:id", authMiddleware, updateTransaction);

// Delete a transaction
router.delete("/:id", authMiddleware, deleteTransaction);

module.exports = router;
