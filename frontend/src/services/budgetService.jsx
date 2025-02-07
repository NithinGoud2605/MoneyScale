import axios from "axios";

const API_URL = "https://moneyscale.onrender.com/api" || "http://localhost:5000/api";

export const getBudgets = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/budgets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching budgets:", error.response?.data || error.message);
    throw error;
  }
};

export const createBudget = async (token, budgetData) => {
  try {
    const res = await axios.post(`${API_URL}/budgets`, budgetData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating budget:", error.response?.data || error.message);
    throw error;
  }
};

export const updateBudget = async (token, budgetId, budgetData) => {
  try {
    const res = await axios.put(`${API_URL}/budgets/${budgetId}`, budgetData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating budget:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteBudget = async (token, budgetId) => {
  try {
    const res = await axios.delete(`${API_URL}/budgets/${budgetId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting budget:", error.response?.data || error.message);
    throw error;
  }
};
