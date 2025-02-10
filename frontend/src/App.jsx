import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy-load route components to reduce initial bundle size.
const Home = lazy(() => import("./sections/Home"));
const Overview = lazy(() => import("./sections/Overview"));
const Login = lazy(() => import("./sections/Login"));
const Register = lazy(() => import("./sections/Register"));
const Accounts = lazy(() => import("./sections/Accounts"));
const Transactions = lazy(() => import("./sections/Transactions"));

const App = () => {
  return (
    <Router>
      {/* Outer container with a continuous background */}
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        {/* Fixed Navbar */}
        <Navbar />

        {/* Main Content */}
        <main
          className="flex-grow mt-20"
          style={{ minHeight: "calc(100vh - 160px)" }}
        >
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

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
