# Supabase Setup Guide for MoneyScale

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `moneyscale`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
6. Click "Create new project"

## Step 2: Get Your Supabase Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-ref.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)
   - **Service role key** (starts with `eyJ...`)

3. Go to **Settings** → **Database**
4. Copy the **Database Password** you created

## Step 3: Create Environment Variables

Create a `.env` file in the root directory with:

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
PORT=5000
NODE_ENV=development
```

## Step 4: Create Database Tables

The application will automatically create the tables when you start the server, but you can also create them manually in the Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  imageUrl VARCHAR,
  password VARCHAR NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounts table
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  balance DECIMAL(12,2) DEFAULT 0,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
  amount DECIMAL(12,2) NOT NULL,
  description VARCHAR,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  category VARCHAR,
  isRecurring BOOLEAN DEFAULT false,
  recurringInterval VARCHAR CHECK (recurringInterval IN ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY')),
  nextRecurringDate TIMESTAMP WITH TIME ZONE,
  lastProcessed TIMESTAMP WITH TIME ZONE,
  status VARCHAR DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  accountId UUID REFERENCES accounts(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets table
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(12,2) NOT NULL,
  lastAlertSent TIMESTAMP WITH TIME ZONE,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 5: Test the Connection

1. Start the server: `node server.js`
2. You should see: "PostgreSQL connected" and "Database models synced"
3. If successful, your Supabase integration is working!

## Troubleshooting

### Connection Issues
- Verify your Supabase URL and keys are correct
- Check that your database password is correct
- Ensure your IP is not blocked by Supabase

### SSL Issues
- Supabase requires SSL connections
- The configuration already includes SSL settings

### Table Creation Issues
- Make sure you have the correct permissions
- Check the SQL syntax in the Supabase SQL Editor

## Next Steps

1. Set up Row Level Security (RLS) policies for data protection
2. Configure authentication with Supabase Auth
3. Set up real-time subscriptions for live updates
4. Configure backup and monitoring

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all sensitive data
- Regularly rotate your API keys
- Set up proper RLS policies in Supabase 