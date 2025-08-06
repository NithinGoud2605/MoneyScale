# 🚀 Render Deployment Guide for MoneyScale

## 🔧 Fixing Database Connection Issues

### Step 1: Configure Environment Variables in Render

1. **Go to your Render dashboard**
2. **Select your MoneyScale service**
3. **Go to Environment tab**
4. **Add these environment variables:**

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Configuration (for Sequelize with Supabase)
DB_HOST=db.your-project-ref.supabase.co
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_database_password_here
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=10000
NODE_ENV=production
```

### Step 2: Fix Supabase IP Restrictions

1. **Go to Supabase Dashboard**
2. **Navigate to Settings → Database**
3. **Check if IP restrictions are enabled**
4. **If enabled, either:**
   - **Option A**: Disable IP restrictions (for development)
   - **Option B**: Add Render's IP ranges to allowed list

### Step 3: Update Database Configuration

The issue might be with the database host configuration. Update your `config/db.js`:

```javascript
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || 'postgres',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'your_supabase_db_password',
  {
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
  }
);

module.exports = sequelize;
```

### Step 4: Alternative Database Connection String

If the above doesn't work, try using the direct connection string from Supabase:

1. **Go to Supabase Dashboard**
2. **Settings → Database**
3. **Copy the connection string**
4. **Update your environment variables:**

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### Step 5: Update Server Configuration

Make sure your `server.js` handles the database connection properly:

```javascript
// Add this to your server.js
const sequelize = require("./config/db");

// Update the database connection
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
    // Don't exit the process, let it continue
  });
```

## 🔍 Troubleshooting Steps

### 1. Check Supabase Connection
- Verify your Supabase project is active
- Check if you're using the correct database password
- Ensure the project reference is correct

### 2. Test Connection Locally
```bash
# Test the connection string locally
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### 3. Check Render Logs
- Go to your Render service
- Check the logs for more detailed error messages
- Look for any SSL or network-related errors

### 4. Alternative: Use Supabase Client
If Sequelize continues to have issues, you can temporarily use the Supabase client:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

## 🚀 Quick Fix Checklist

- [ ] Environment variables set in Render
- [ ] Supabase IP restrictions disabled or configured
- [ ] Database password is correct
- [ ] Project reference is correct
- [ ] SSL configuration is proper
- [ ] Port is set to 10000 (Render requirement)

## 📞 Getting Help

If you're still having issues:
1. Check the Render troubleshooting guide
2. Verify your Supabase project settings
3. Test the connection string locally
4. Check if your Supabase project is in the same region as Render