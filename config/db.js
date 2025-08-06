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

// Try to resolve the hostname to IPv4 and use the IP directly
const dns = require('dns');
const util = require('util');
const resolve4 = util.promisify(dns.resolve4);

let sequelize;

async function createConnection() {
  try {
    // Try to resolve the hostname to IPv4
    const addresses = await resolve4(process.env.DB_HOST);
    console.log(`✅ Hostname resolved to IPv4: ${addresses[0]}`);
    
    // Use the resolved IP address instead of hostname
    const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${addresses[0]}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    console.log("Connection string with IP:", connectionString.replace(/:[^:@]*@/, ':****@'));
    
    sequelize = new Sequelize(connectionString, {
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
  } catch (error) {
    console.error(`❌ Cannot resolve hostname: ${process.env.DB_HOST}`);
    console.error(`   Error: ${error.message}`);
    console.log(`💡 Falling back to hostname connection...`);
    
    // Fallback to hostname connection
    const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    console.log("Connection string with hostname:", connectionString.replace(/:[^:@]*@/, ':****@'));
    
    sequelize = new Sequelize(connectionString, {
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
      family: 4
    });
  }
}

// Create the connection
createConnection();

module.exports = sequelize;
