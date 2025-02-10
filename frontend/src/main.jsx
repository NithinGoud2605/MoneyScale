import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./theme/ThemeProvider";
import "./index.css";
import "./App.css";

// Lazy-load App component.
const App = lazy(() => import("./App"));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </AuthProvider>
  </ThemeProvider>
);
