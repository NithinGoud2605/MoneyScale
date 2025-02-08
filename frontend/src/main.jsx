import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./theme/ThemeProvider";
import "./index.css";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // Remove or comment out StrictMode if double-render is causing flicker
  // <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  // </React.StrictMode>
);
