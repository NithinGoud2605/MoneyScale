import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeProvider";

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className={`fixed w-full top-0 z-50 backdrop-blur-lg border-b border-opacity-10 transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900 border-gray-200"
          : "bg-gradient-to-br from-gray-900 to-blue-900 text-gray-100 border-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-cyan-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm3 7H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              MoneyScale
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user && token && (
              <>
                <Link
                  to="/overview"
                  className="hover:text-cyan-500 transition-colors flex items-center space-x-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span>Overview</span>
                </Link>
                <Link
                  to="/accounts"
                  className="hover:text-cyan-500 transition-colors flex items-center space-x-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>Accounts</span>
                </Link>
                <Link
                  to="/transactions"
                  className="hover:text-cyan-500 transition-colors flex items-center space-x-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <span>Transactions</span>
                </Link>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === "light" ? (
                <svg
                  className="w-6 h-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                  />
                </svg>
              )}
            </button>

            {user && token ? (
              <button
                onClick={() => logout().then(() => navigate("/login"))}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {user && token && (
              <>
                <Link className="block hover:text-cyan-500 transition-colors" to="/overview">
                  Overview
                </Link>
                <Link className="block hover:text-cyan-500 transition-colors" to="/accounts">
                  Accounts
                </Link>
                <Link className="block hover:text-cyan-500 transition-colors" to="/transactions">
                  Transactions
                </Link>
              </>
            )}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              {user && token ? (
                <button
                  onClick={() => logout().then(() => navigate("/login"))}
                  className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity block text-center"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
