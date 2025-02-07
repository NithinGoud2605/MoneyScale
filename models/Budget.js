const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Budget = sequelize.define(
  "Budget",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    lastAlertSent: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "budgets",
    timestamps: true,
  }
);

Budget.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasOne(Budget, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = Budget;
