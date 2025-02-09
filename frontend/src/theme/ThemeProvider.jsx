import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  // Function to update CSS variables based on the current theme
  const applyTheme = (currentTheme) => {
    document.documentElement.className = currentTheme;
    if (currentTheme === "light") {
      document.documentElement.style.setProperty("--color-primary", "#4F46E5");   // Indigo 600
      document.documentElement.style.setProperty("--color-secondary", "#9333EA"); // Purple 600
      document.documentElement.style.setProperty("--color-accent", "#F59E0B");    // Amber 500
      document.documentElement.style.setProperty("--color-background", "#F3F4F6"); // Gray 100
      document.documentElement.style.setProperty("--color-card", "#FFFFFF");
      document.documentElement.style.setProperty("--color-text", "#1F2937");      // Gray 800
    } else {
      document.documentElement.style.setProperty("--color-primary", "#A5B4FC");   // Indigo 200
      document.documentElement.style.setProperty("--color-secondary", "#D8B4FE"); // Purple 200
      document.documentElement.style.setProperty("--color-accent", "#FBBF24");    // Amber 400
      document.documentElement.style.setProperty("--color-background", "#111827"); // Gray 900
      document.documentElement.style.setProperty("--color-card", "#1F2937");      // Gray 800
      document.documentElement.style.setProperty("--color-text", "#F9FAFB");      // Gray 50
    }
  };

  // On mount, read theme from localStorage (or default to light)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
