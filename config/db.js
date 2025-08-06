const { Sequelize } = require("sequelize");

// Force IPv4 for all connections
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

// Set Node.js to prefer IPv4
process.env.UV_THREADPOOL_SIZE = 1;

// Log the database configuration for debugging
console.log("Database Configuration:");
console.log("Host:", process.env.DB_HOST);
console.log("Database:", process.env.DB_NAME);
console.log("User:", process.env.DB_USER);
console.log("Port:", process.env.DB_PORT);

// Try using the DATABASE_URL environment variable first
let connectionString;

if (process.env.DATABASE_URL) {
  connectionString = process.env.DATABASE_URL;
  console.log("Using DATABASE_URL environment variable");
} else {
  connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  console.log("Using individual environment variables");
}

console.log("Connection string:", connectionString.replace(/:[^:@]*@/, ':****@'));

// Test DNS resolution
dns.resolve4(process.env.DB_HOST, (err, addresses) => {
  if (err) {
    console.error(`❌ Cannot resolve hostname: ${process.env.DB_HOST}`);
    console.error(`   Error: ${err.message}`);
    console.log(`💡 Please check your Supabase connection settings`);
  } else {
    console.log(`✅ Hostname resolved to IPv4: ${addresses[0]}`);
  }
});

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
  },
  // Force IPv4 connections
  family: 4
});
