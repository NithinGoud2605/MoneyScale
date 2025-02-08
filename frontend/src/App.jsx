import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./sections/Home";
import Overview from "./sections/Overview";
import Login from "./sections/Login";
import Register from "./sections/Register";
import Accounts from "./sections/Accounts";
import Transactions from "./sections/Transactions";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./theme/ThemeProvider";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          {/* Top Navigation (visible on all pages) */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-grow">
            <Suspense fallback={<div className="text-center m-4">Loading...</div>}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
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
            </Suspense>
          </main>

          {/* Footer (visible on all pages) */}
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
