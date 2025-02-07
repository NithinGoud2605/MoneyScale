const { Account } = require("../models");

// Create an account
exports.createAccount = async (req, res) => {
  try {
    const { name, type, balance, isDefault } = req.body;
    const userId = req.user.userId; // Extract from JWT
    const account = await Account.create({ name, type, balance, isDefault, userId });
    res.status(201).json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all accounts for the authenticated user
exports.getAccounts = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract from JWT
    const accounts = await Account.findAll({ where: { userId } });
    res.status(200).json(accounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an account
exports.updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, balance, isDefault } = req.body;
    const account = await Account.findByPk(id);
    if (!account) return res.status(404).json({ message: "Account not found" });

    await account.update({ name, type, balance, isDefault });
    res.status(200).json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete an account
exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findByPk(id);
    if (!account) return res.status(404).json({ message: "Account not found" });

    await account.destroy();
    res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
