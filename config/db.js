const { Sequelize } = require("sequelize");

// Force IPv4 for all connections
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

// Log the database configuration for debugging
console.log("Database Configuration:");
console.log("Host:", process.env.DB_HOST);
console.log("Database:", process.env.DB_NAME);
console.log("User:", process.env.DB_USER);
console.log("Port:", process.env.DB_PORT);

// Use connection string with explicit IPv4 configuration
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
console.log("Connection string:", connectionString.replace(/:[^:@]*@/, ':****@'));

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    max: 3,
    timeout: 10000
  }
});

module.exports = sequelize;
