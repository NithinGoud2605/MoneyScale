import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeProvider";

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 py-4 px-8 flex items-center justify-between
        ${theme === "light" ? "bg-slate-100 text-slate-800" : "bg-slate-800 text-slate-100"}
      `}
    >
      {/* App Logo / Name */}
      <div className="text-2xl font-bold">
        <Link to="/" className="hover:opacity-90">
          MoneyScale
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center space-x-4">
        {user && token && (
          <>
            <Link
              to="/overview"
              className="hover:text-teal-500 transition-colors text-slate-800 dark:text-slate-100"
            >
              Overview
            </Link>
            <Link
              to="/accounts"
              className="hover:text-teal-500 transition-colors text-slate-800 dark:text-slate-100"
            >
              Accounts
            </Link>
            <Link
              to="/transactions"
              className="hover:text-teal-500 transition-colors text-slate-800 dark:text-slate-100"
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

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? (
            // Close (X) Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger Menu Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-100 dark:bg-slate-800 shadow-md p-4 md:hidden">
          <div className="flex flex-col space-y-3">
            {user && token && (
              <>
                <Link
                  to="/overview"
                  className="hover:text-teal-500 transition-colors text-slate-800 dark:text-slate-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Overview
                </Link>
                <Link
                  to="/accounts"
                  className="hover:text-teal-500 transition-colors text-slate-800 dark:text-slate-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Accounts
                </Link>
                <Link
                  to="/transactions"
                  className="hover:text-teal-500 transition-colors text-slate-800 dark:text-slate-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Transactions
                </Link>
              </>
            )}
            <button
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1 rounded hover:opacity-80 transition-colors text-slate-800 dark:text-slate-100"
            >
              {theme === "light" ? "🌙" : "🌞"}
            </button>
            {user && token ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-teal-500 hover:bg-teal-600 text-white py-1 px-4 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
