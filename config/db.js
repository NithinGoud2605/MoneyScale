const { Sequelize } = require("sequelize");

// Log the database configuration for debugging
console.log("Database Configuration:");
console.log("Host:", process.env.DB_HOST);
console.log("Database:", process.env.DB_NAME);
console.log("User:", process.env.DB_USER);
console.log("Port:", process.env.DB_PORT);
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");

// Create connection string if not provided
const getConnectionString = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Build connection string from individual parameters
  const host = process.env.DB_HOST || 'db.your_supabase_project_ref.supabase.co';
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || 'your_supabase_db_password';
  const database = process.env.DB_NAME || 'postgres';
  const port = process.env.DB_PORT || 5432;
  
  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
};

const connectionString = getConnectionString();
console.log("Using connection string:", connectionString.replace(/:[^:@]*@/, ':****@'));

// Use connection string approach for better compatibility
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
