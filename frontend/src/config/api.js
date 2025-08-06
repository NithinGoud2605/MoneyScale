// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://moneyscale.onrender.com' 
  : 'http://localhost:5000';

export const API_ENDPOINTS = {
  GEMINI: `${API_BASE_URL}/api/gemini`,
  AUTH: `${API_BASE_URL}/api/auth`,
  ACCOUNTS: `${API_BASE_URL}/api/accounts`,
  TRANSACTIONS: `${API_BASE_URL}/api/transactions`,
  BUDGETS: `${API_BASE_URL}/api/budgets`,
};

export default API_ENDPOINTS; 