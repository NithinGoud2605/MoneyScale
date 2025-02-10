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

const App = () => {
  return (
    <Router>
      {/* Outer container with a continuous background */}
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <Navbar />
        <main className="flex-grow mt-20" style={{ minHeight: "calc(100vh - 160px)" }}>
          <Suspense fallback={<div className="text-center m-4">Loading...</div>}>
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
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
