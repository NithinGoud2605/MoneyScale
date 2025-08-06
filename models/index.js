const sequelize = require("../config/db");

// Import models after sequelize is initialized
const User = require("./User");
const Account = require("./Account");
const Transaction = require("./Transaction");
const Budget = require("./Budget");

// Relationships
User.hasMany(Account, { foreignKey: "userId", onDelete: "CASCADE" });
Account.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

User.hasMany(Transaction, { foreignKey: "userId", onDelete: "CASCADE" });
Transaction.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

Account.hasMany(Transaction, { foreignKey: "accountId", onDelete: "CASCADE" });
Transaction.belongsTo(Account, { foreignKey: "accountId", onDelete: "CASCADE" });

User.hasOne(Budget, { foreignKey: "userId", onDelete: "CASCADE" });
Budget.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = { sequelize, User, Account, Transaction, Budget };
