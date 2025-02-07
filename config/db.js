const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false, // Disable logging or set to console.log for debugging
    dialectOptions: {
      ssl: {
        require: true,            // Enforce SSL connection
        rejectUnauthorized: false // Disable verification of the RDS certificate
      }
    }
  }
);

module.exports = sequelize;
