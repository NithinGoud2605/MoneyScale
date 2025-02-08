import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Reference for GSAP animation on form container
  const formContainerRef = useRef(null);

  useEffect(() => {
    if (formContainerRef.current) {
      gsap.fromTo(
        formContainerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPass) {
      setErrorMsg("Passwords do not match");
      return;
    }

    const success = await register(username, email, password);
    if (success) {
      navigate("/login");
    } else {
      setErrorMsg("Registration failed. Possibly user already exists.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 transition-colors p-4">
      <div
        ref={formContainerRef}
        className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700"
        role="form"
        aria-label="Registration Form"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-slate-700 dark:text-slate-200 font-semibold mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              aria-label="Enter your username"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 border-slate-300"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-slate-700 dark:text-slate-200 font-semibold mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              aria-label="Enter your email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 border-slate-300"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-slate-700 dark:text-slate-200 font-semibold mb-1">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              aria-label="Enter your password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 border-slate-300 pr-10"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.03.165-2.019.474-2.955M21 21l-4.35-4.35M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirmPass" className="block text-slate-700 dark:text-slate-200 font-semibold mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPass"
              type={showConfirmPassword ? "text" : "password"}
              aria-label="Confirm your password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 border-slate-300 pr-10"
              placeholder="Confirm your password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.03.165-2.019.474-2.955M21 21l-4.35-4.35M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
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
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-2 rounded hover:from-teal-600 hover:to-emerald-600 transition-colors font-semibold mt-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Sign Up"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-teal-500 cursor-pointer hover:underline font-bold"
            aria-label="Go to Login Page"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
