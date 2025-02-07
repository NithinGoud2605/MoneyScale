import axios from "axios";

// Directly use the API endpoint from the environment variable if needed.
// Alternatively, you can use the full path here if your auth routes are not behind the same proxy.
const API_URL = "https://moneyscale.onrender.com/api" || "http://localhost:5000/api";

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
