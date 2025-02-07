import axios from "axios";

const API_URL = "https://moneyscale.onrender.com/api" || "http://localhost:5000/api";

export const getTransactions = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching transactions:", error.response?.data || error.message);
    throw error;
  }
};

export const createTransaction = async (token, transactionData) => {
  try {
    const res = await axios.post(`${API_URL}/transactions`, transactionData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating transaction:", error.response?.data || error.message);
    throw error;
  }
};

export const updateTransaction = async (token, transactionId, transactionData) => {
  try {
    const res = await axios.put(`${API_URL}/transactions/${transactionId}`, transactionData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating transaction:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteTransaction = async (token, transactionId) => {
  try {
    const res = await axios.delete(`${API_URL}/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting transaction:", error.response?.data || error.message);
    throw error;
  }
};
