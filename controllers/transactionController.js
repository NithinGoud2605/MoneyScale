const { Transaction } = require("../models");

// Create a transaction
exports.createTransaction = async (req, res) => {
  try {
    // The userId here is the primary key from JWT
    const userId = req.user.userId;
    const { type, amount, description, date, category, accountId } = req.body;

    const transaction = await Transaction.create({
      type,
      amount,
      description,
      date,
      category,
      userId,     // references the PK from the User model
      accountId,
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all transactions for the authenticated user
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const transactions = await Transaction.findAll({ where: { userId } });
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, description, date, category } = req.body;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    await transaction.update({ type, amount, description, date, category });
    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    await transaction.destroy();
    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
