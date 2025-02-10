<<<<<<< HEAD
// src/sections/Login.jsx
import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
=======
import React, { useState, useContext, useRef, useEffect } from "react";
>>>>>>> parent of 66452a9 (deploy)
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useTheme } from "../theme/ThemeProvider";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Form field states and error message state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD
  const [isSubmitting, setIsSubmitting] = useState(false);
=======

  // Ref for the login card container to apply animations
>>>>>>> parent of 66452a9 (deploy)
  const cardRef = useRef(null);

  // Animate the login card on mount using GSAP
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

<<<<<<< HEAD
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log("Submit event fired with email:", email);
      setErrorMsg("");
      setIsSubmitting(true);
      try {
        const success = await login(email, password);
        console.log("Login function returned:", success);
        if (!success) {
          setErrorMsg("Invalid credentials. Please try again.");
        } else {
          navigate("/overview");
        }
      } catch (error) {
        console.error("Error during login:", error);
        setErrorMsg("An error occurred during login.");
      }
      setIsSubmitting(false);
    },
    [email, password, login, navigate]
  );
=======
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Call the login function from AuthContext
    const success = await login(email, password);
    if (!success) {
      setErrorMsg("Invalid credentials. Please try again.");
    } else {
      navigate("/overview");
    }
  };
>>>>>>> parent of 66452a9 (deploy)

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900"
          : "bg-gradient-to-br from-gray-900 to-blue-900 text-gray-100"
      }`}
    >
      <div
        ref={cardRef}
        className="w-full max-w-md glass-container backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-border"
      >
        <div className="text-center mb-8">
          <div className="mb-6 inline-block p-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to manage your finances
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Login Form">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-border focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-border focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all pr-12"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {showPassword ? (
<<<<<<< HEAD
=======
                    // Eye Off Icon
>>>>>>> parent of 66452a9 (deploy)
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.03.165-2.019.474-2.955M21 21l-4.35-4.35M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  ) : (
                    // Eye Icon
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <p className="text-red-500 text-center" role="alert">
              {errorMsg}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-cyan-500 hover:underline font-semibold cursor-pointer"
            aria-label="Go to Register Page"
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
