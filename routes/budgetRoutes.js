const express = require("express");
const {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a budget
router.post("/", authMiddleware, createBudget);

// Get all budgets for the authenticated user
router.get("/", authMiddleware, getBudgets);

// Update a specific budget
router.put("/:id", authMiddleware, updateBudget);

// Delete a specific budget
router.delete("/:id", authMiddleware, deleteBudget);

module.exports = router;
