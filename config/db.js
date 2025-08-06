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

// Try using Supabase connection pooler (port 6543) instead of direct connection (port 5432)
if (process.env.NODE_ENV === 'production') {
  const poolerConnectionString = connectionString.replace(':5432/', ':6543/');
  console.log("Trying connection pooler for production...");
  connectionString = poolerConnectionString;
}

// Try alternative hostname format - use project URL instead of db hostname
if (process.env.NODE_ENV === 'production' && connectionString.includes('db.zikplbezatpwgoblbyso.supabase.co')) {
  const alternativeConnectionString = connectionString.replace('db.zikplbezatpwgoblbyso.supabase.co', 'zikplbezatpwgoblbyso.supabase.co');
  console.log("Trying alternative hostname format (project URL)...");
  connectionString = alternativeConnectionString;
}

// Use the correct Supabase connection format
console.log("Using Supabase connection pooler format...");

console.log("Connection string:", connectionString.replace(/:[^:@]*@/, ':****@'));

// Extract hostname from connection string for debugging
const hostnameMatch = connectionString.match(/@([^:]+):/);
if (hostnameMatch) {
  const hostname = hostnameMatch[1];
  console.log("Using hostname:", hostname);
  
  // Test DNS resolution for this hostname
  dns.resolve4(hostname, (err, addresses) => {
    if (err) {
      console.log(`❌ IPv4 resolution failed for ${hostname}: ${err.message}`);
    } else {
      console.log(`✅ IPv4 resolution successful for ${hostname}: ${addresses[0]}`);
    }
  });
}

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

// Create sequelize instance with connection pooler
const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    // Additional connection options for better compatibility
    connectTimeout: 60000,
    query_timeout: 60000
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000, // Increased from 30000
    idle: 10000
  },
  retry: {
    max: 5, // Increased from 3
    timeout: 30000 // Increased from 10000
  },
  // Force IPv4 connections
  family: 4,
  // Additional options for better connection handling
  define: {
    timestamps: true
  }
});

// Test the connection to ensure it's working
sequelize.authenticate()
  .then(() => {
    console.log("✅ Sequelize connection established successfully");
  })
  .catch((err) => {
    console.error("❌ Sequelize connection failed:", err.message);
  });

module.exports = sequelize;
