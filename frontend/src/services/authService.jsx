import axios from "axios";

// Use local development server for development
const API_URL = process.env.NODE_ENV === 'production' 
  ? "https://moneyscale.onrender.com/api" 
  : "/api";

// Login function
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data; // Return the response data (e.g., token, user info)
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

// Register function
export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, email, password });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
};

// Logout function (if applicable)
export const logout = () => {
  localStorage.removeItem("authToken"); // Clear token from local storage
};
