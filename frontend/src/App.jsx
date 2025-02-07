import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";
import Home from "./sections/Home";
import Overview from "./sections/Overview"; // Overview now includes budget editing
import Login from "./sections/Login";
import Register from "./sections/Register";
import Accounts from "./sections/Accounts";
import Transactions from "./sections/Transactions";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./theme/ThemeProvider";

const App = () => {
  return (
    // Wrap the entire app with our ThemeProvider so that theme toggling works
    <ThemeProvider>
      <Router>
        <div className="flex flex-row min-h-screen" id="appRoot">
          {/* Sidebar with navigation links */}
          <Sidebar />

          {/* Main content container */}
          <div className="flex flex-col w-full transition-colors">
            <Topbar />
            <main className="flex-grow pt-4 pb-6 px-4 md:px-8 dashboard-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/overview"
                  element={
                    <ProtectedRoute>
                      <Overview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/accounts"
                  element={
                    <ProtectedRoute>
                      <Accounts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute>
                      <Transactions />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
