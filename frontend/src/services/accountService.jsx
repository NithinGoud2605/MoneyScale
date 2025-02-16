import axios from "axios";

// Use the Vite environment variable; if not defined, fallback to localhost (development)
const API_URL = "https://moneyscale.onrender.com/api" || "http://localhost:5000/api";

export const getAccounts = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching accounts:", error.response?.data || error.message);
    throw error;
  }
};

export const createAccount = async (token, accountData) => {
  try {
    const res = await axios.post(`${API_URL}/accounts`, accountData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating account:", error.response?.data || error.message);
    throw error;
  }
};

export const updateAccount = async (token, accountId, accountData) => {
  try {
    const res = await axios.put(`${API_URL}/accounts/${accountId}`, accountData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating account:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteAccount = async (token, accountId) => {
  try {
    const res = await axios.delete(`${API_URL}/accounts/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting account:", error.response?.data || error.message);
    throw error;
  }
};
