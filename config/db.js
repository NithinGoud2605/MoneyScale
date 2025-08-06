const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || 'postgres',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'your_supabase_db_password',
  {
    host: process.env.DB_HOST || 'db.your_supabase_project_ref.supabase.co',
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false, // Disable logging or set to console.log for debugging
    dialectOptions: {
      ssl: {
        require: true,            // Enforce SSL connection
        rejectUnauthorized: false // Disable verification of the certificate
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
