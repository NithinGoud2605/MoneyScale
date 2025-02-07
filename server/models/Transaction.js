const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Account = require("./Account");

const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("INCOME", "EXPENSE"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    recurringInterval: {
      type: DataTypes.ENUM("DAILY", "WEEKLY", "MONTHLY", "YEARLY"),
    },
    nextRecurringDate: {
      type: DataTypes.DATE,
    },
    lastProcessed: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"),
      defaultValue: "COMPLETED",
    },
  },
  {
    tableName: "transactions",
    timestamps: true,
  }
);

Transaction.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Transaction.belongsTo(Account, { foreignKey: "accountId", onDelete: "CASCADE" });
User.hasMany(Transaction, { foreignKey: "userId", onDelete: "CASCADE" });
Account.hasMany(Transaction, { foreignKey: "accountId", onDelete: "CASCADE" });

module.exports = Transaction;
