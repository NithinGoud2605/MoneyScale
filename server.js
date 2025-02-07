require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => res.send("API is running!"));

// Mount your API routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const accountRoutes = require("./routes/accountRoutes");
app.use("/api/accounts", accountRoutes);

const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);

// Serve static files from the React app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

// Sync database models
sequelize
  .authenticate()
  .then(() => console.log("PostgreSQL connected"))
  .catch((err) => {
    console.error("Unable to connect to PostgreSQL:", err);
    process.exit(1);
  });

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database models synced"))
  .catch((err) => console.error("Error syncing database models:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
