require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API is running!"));

const authRoutes = require("./routes/authRoutes"); // Correct path to routes
app.use("/api/auth", authRoutes); // Mount routes on /api/auth


const accountRoutes = require("./routes/accountRoutes");
app.use("/api/accounts", accountRoutes);

const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);

// Sync database models
sequelize
  .authenticate()
  .then(() => console.log("PostgreSQL connected"))
  .catch((err) => {
    console.error("Unable to connect to PostgreSQL:", err);
    process.exit(1);
  });

sequelize
  .sync({ alter: true }) // Change to { alter: true } in production
  .then(() => console.log("Database models synced"))
  .catch((err) => console.error("Error syncing database models:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
