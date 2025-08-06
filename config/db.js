const { Sequelize } = require("sequelize");

// Log the database configuration for debugging
console.log("Database Configuration:");
console.log("Host:", process.env.DB_HOST);
console.log("Database:", process.env.DB_NAME);
console.log("User:", process.env.DB_USER);
console.log("Port:", process.env.DB_PORT);

// Try using connection string approach for better compatibility
let sequelize;

if (process.env.DATABASE_URL) {
  // Use connection string if available
  sequelize = new Sequelize(process.env.DATABASE_URL, {
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
} else {
  // Use individual parameters with explicit IPv4 configuration
  const connectionConfig = {
    host: process.env.DB_HOST || 'db.your_supabase_project_ref.supabase.co',
    port: process.env.DB_PORT || 5432,
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
  };

  // Add IPv4 family configuration
  if (process.env.NODE_ENV === 'production') {
    connectionConfig.family = 4;
  }

  sequelize = new Sequelize(
    process.env.DB_NAME || 'postgres',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'your_supabase_db_password',
    connectionConfig
  );
}

module.exports = sequelize;
