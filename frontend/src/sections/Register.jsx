import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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
    <div className="
      flex items-center justify-center min-h-screen
      bg-gradient-to-br from-slate-50 to-white
      dark:from-slate-900 dark:to-slate-800
      transition-colors
    ">
      <div className="
        max-w-md w-full bg-white dark:bg-slate-800
        p-8 rounded-xl shadow-xl
      ">
        <h2
          className="
            text-3xl font-extrabold mb-6 text-center
            text-transparent bg-clip-text
            bg-gradient-to-r from-teal-500 to-emerald-500
          "
        >
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-1">
              Username
            </label>
            <input
              type="text"
              className="
                w-full px-3 py-2 border rounded-md
                focus:outline-none focus:ring-2 focus:ring-teal-500
                dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200
                border-slate-300
              "
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              className="
                w-full px-3 py-2 border rounded-md
                focus:outline-none focus:ring-2 focus:ring-teal-500
                dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200
                border-slate-300
              "
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              className="
                w-full px-3 py-2 border rounded-md
                focus:outline-none focus:ring-2 focus:ring-teal-500
                dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200
                border-slate-300
              "
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="
                w-full px-3 py-2 border rounded-md
                focus:outline-none focus:ring-2 focus:ring-teal-500
                dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200
                border-slate-300
              "
              placeholder="Confirm your password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="
              w-full bg-teal-500 text-white py-2 rounded
              hover:bg-teal-600 transition-colors
              font-semibold mt-2
            "
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-teal-500 cursor-pointer hover:underline font-bold"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
