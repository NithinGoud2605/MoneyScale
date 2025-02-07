import axios from "axios";

// Login function
export const login = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });
    return response.data; // Return the response data (e.g., token, user info)
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Register function
export const register = async (username, email, password) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        username,
        email,
        password,
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

// Logout function (if applicable)
export const logout = () => {
  localStorage.removeItem("authToken"); // Clear token from local storage
};
