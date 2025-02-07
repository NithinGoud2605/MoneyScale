const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Account = sequelize.define(
  "Account",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("CURRENT", "SAVINGS"),
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "accounts",
    timestamps: true,
  }
);

Account.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Account, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = Account;
