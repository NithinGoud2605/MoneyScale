# 💰 MoneyScale - Personal Finance Tracker

A personal finance management app I built to track my expenses, budgets, and get AI-powered financial insights. This is my personal project for learning full-stack development with React, Node.js, and AI integration.

## 🌟 What I Built

This is a full-stack web application that helps me:
- **Track my spending** across multiple accounts
- **Set and monitor budgets** to stay on track
- **Get AI-powered insights** about my spending patterns
- **Visualize my finances** with charts and analytics
- **Manage transactions** with a clean, intuitive interface

## 🚀 Live Demo

**Try it out:** [https://moneyscale.onrender.com](https://moneyscale.onrender.com)

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI with hooks and context
- **Vite** - Fast development and building
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **ECharts** - Beautiful data visualizations

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database (via Supabase)
- **Sequelize** - ORM for database management
- **JWT** - Authentication

### AI & External Services
- **Google Gemini AI** - Financial insights and recommendations
- **Supabase** - Database hosting and authentication
- **Render** - Application hosting

## 🎯 Key Features

### 📊 Dashboard & Analytics
- Real-time overview of accounts and balances
- Monthly spending trends and patterns
- Interactive charts and visualizations
- Net worth tracking over time

### 💰 Budget Management
- Set monthly spending limits
- Track budget vs actual spending
- Get alerts when approaching limits
- Category-based budget tracking

### 🔄 Transaction Management
- Add, edit, and categorize transactions
- Multi-account support
- Search and filter transactions
- Bulk transaction operations

### 🤖 AI-Powered Insights
- Smart financial recommendations
- Spending pattern analysis
- Personalized money-saving tips
- Predictive expense trends

### 🔐 User Authentication
- Secure login and registration
- JWT-based authentication
- Protected routes and data

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Supabase account (free tier works great)
- Google Gemini API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/moneyscale.git
   cd moneyscale
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp config.env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   
   # Database Configuration
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

4. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and API keys
   - Update the `.env` file with your credentials

5. **Get Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

6. **Start the development servers**
   ```bash
   # Start the backend server
   npm start
   
   # In a new terminal, start the frontend
   cd frontend
   npm run dev
   ```

7. **Open your browser**
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173

## 📁 Project Structure

```
MoneyScale/
├── config/                 # Configuration files
├── controllers/           # Backend controllers
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── sections/     # Page components
│   │   ├── services/     # API services
│   │   └── context/      # React context
├── middleware/           # Express middleware
├── models/              # Database models
├── routes/              # API routes
└── server.js           # Main server file
```

## 🎨 Features I'm Proud Of

### AI Integration
- **Smart Insights**: The AI analyzes spending patterns and provides personalized financial advice
- **Dynamic Prompts**: Context-aware prompts based on user's financial data
- **Real-time Responses**: Fast AI responses for immediate feedback

### Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion animations for better user experience
- **Dark/Light Mode**: Theme support for user preference
- **Interactive Charts**: Beautiful data visualizations with ECharts

### Robust Backend
- **RESTful API**: Clean, well-structured API endpoints
- **Database Design**: Proper relationships and constraints
- **Error Handling**: Comprehensive error handling and logging
- **Security**: JWT authentication and data validation

## 🔧 Development Notes

### What I Learned
- **Full-stack Development**: Building both frontend and backend from scratch
- **AI Integration**: Working with Google's Gemini API for smart features
- **Database Design**: Proper schema design with PostgreSQL
- **State Management**: Using React Context for global state
- **Deployment**: Deploying to Render and managing environment variables

### Challenges I Solved
- **AI API Integration**: Handling API responses and error cases
- **Real-time Updates**: Keeping UI in sync with backend data
- **Responsive Design**: Making the app work on all screen sizes
- **Data Visualization**: Creating meaningful charts and graphs

## 🚀 Deployment

The app is deployed on **Render**:
- **Frontend**: Static site hosting
- **Backend**: Node.js service
- **Database**: Supabase PostgreSQL

## 📈 Future Plans

Some ideas I'm considering for future updates:
- [ ] **Mobile App**: React Native version
- [ ] **Investment Tracking**: Stock and crypto portfolio management
- [ ] **Bill Reminders**: Automated bill payment reminders
- [ ] **Export Features**: PDF reports and data export
- [ ] **Multi-currency**: Support for different currencies
- [ ] **Recurring Transactions**: Automatic transaction creation

## 🤝 Contributing

This is my personal project, but I'm always open to learning from others! If you have suggestions or want to discuss the code, feel free to reach out.

## 📝 License

This project is for personal use and learning purposes.

---

**Built with ❤️ and lots of coffee ☕**

*This project represents my journey in full-stack development, from learning React and Node.js to integrating AI services and deploying to the cloud. It's been an amazing learning experience!*
