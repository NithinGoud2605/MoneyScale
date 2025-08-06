require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => res.send("API is running!"));

// Test database connection endpoint
app.get("/api/test-db", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      status: "success", 
      message: "Database connection successful",
      config: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        port: process.env.DB_PORT
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Database connection failed",
      error: error.message,
      config: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        port: process.env.DB_PORT
      }
    });
  }
});

// Mount your API routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const accountRoutes = require("./routes/accountRoutes");
app.use("/api/accounts", accountRoutes);

const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);

const geminiRoutes = require("./routes/geminiRoutes");
app.use("/api", geminiRoutes);

// Serve static files from the React app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

// Sync database models
console.log("Attempting to connect to database...");
console.log("Connection URL:", `postgresql://${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

// Test DNS resolution
const dns = require('dns');
dns.lookup(process.env.DB_HOST, { family: 4 }, (err, address, family) => {
  if (err) {
    console.error("DNS lookup failed:", err);
  } else {
    console.log(`DNS resolved ${process.env.DB_HOST} to ${address} (IPv${family})`);
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("PostgreSQL connected successfully");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Database models synced");
  })
  .catch((err) => {
    console.error("Unable to connect to PostgreSQL:", err);
    console.log("Server will continue without database connection...");
    // Don't exit the process, let it continue for development
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
