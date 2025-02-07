const { Budget } = require("../models");

// Create a budget
//sd
exports.createBudget = async (req, res) => {
  try {
    const { amount, name } = req.body;
    const userId = req.user.userId; // Extracted from JWT

    const existingBudget = await Budget.findOne({ where: { userId } });
    if (existingBudget) {
      return res.status(400).json({ message: "Budget already exists" });
    }

    const budget = await Budget.create({
      name,
      amount,
      userId,
    });

    res.status(201).json(budget);
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all budgets for the authenticated user
exports.getBudgets = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from JWT

    const budgets = await Budget.findAll({ where: { userId } });
    res.status(200).json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a budget
exports.updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount } = req.body;

    const budget = await Budget.findByPk(id);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    await budget.update({ name, amount });
    res.status(200).json(budget);
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findByPk(id);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    await budget.destroy();
    res.status(200).json({ message: "Budget deleted" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
