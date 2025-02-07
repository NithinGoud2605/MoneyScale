import React, { createContext, useState, useEffect } from "react";
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
} from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setToken(authToken);
      // You might fetch user data from your backend here:
      // setUser(...)
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { token } = await loginService(email, password);
      setToken(token);
      localStorage.setItem("authToken", token);
      setUser({ email }); // Placeholder: Replace with actual user data from response if needed
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      await registerService(username, email, password);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const logout = () => {
    logoutService();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};
