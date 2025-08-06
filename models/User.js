// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Debug: Check if sequelize is properly imported
console.log("User model - sequelize type:", typeof sequelize);
console.log("User model - sequelize.define type:", typeof sequelize.define);

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Renamed from `userId` => `username`
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    name: {
      type: DataTypes.STRING,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Password is required
    },
  },
  {
    tableName: "users",
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = User;
