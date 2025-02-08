import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeProvider";

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`
        w-full py-4 px-8 flex items-center justify-between
        ${theme === "light" ? "bg-slate-100 text-slate-800" : "bg-slate-800 text-slate-100"}
      `}
    >
      {/* App Logo / Name */}
      <div className="text-2xl font-bold">
        <Link to="/" className="hover:opacity-90">
          MoneyScale
        </Link>
      </div>

      {/* Right Side: dynamic links, theme toggle, login/logout */}
      <div className="flex items-center space-x-4">
        {/* Only show these links if user is logged in */}
        {user && token && (
          <>
            <Link
              to="/overview"
              className="hover:text-teal-500 transition-colors"
            >
              Overview
            </Link>
            <Link
              to="/accounts"
              className="hover:text-teal-500 transition-colors"
            >
              Accounts
            </Link>
            <Link
              to="/transactions"
              className="hover:text-teal-500 transition-colors"
            >
              Transactions
            </Link>
          </>
        )}

        {/* Theme toggler */}
        <button
          onClick={toggleTheme}
          className="px-3 py-1 rounded hover:opacity-80 transition-colors"
        >
          {theme === "light" ? "🌙" : "🌞"}
        </button>

        {/* Login/Logout button */}
        {user && token ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-teal-500 hover:bg-teal-600 text-white py-1 px-4 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
