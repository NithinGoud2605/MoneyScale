import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeProvider";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const topbarRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      topbarRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
    );
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper function: capitalize the first letter of the username or email prefix.
  const getDisplayName = (user) => {
    if (!user) return "";
    const name = user.username ? user.username : user.email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div
      ref={topbarRef}
      className={`
        navbar sticky top-0 z-50 flex flex-wrap items-center justify-between
        px-4 py-3 md:px-8 border-b transition-colors duration-300 shadow-sm
        ${theme === "light"
          ? "bg-slate-50 border-slate-200 text-slate-800"
          : "bg-slate-800 border-slate-700 text-slate-200"
        }
      `}
    >
      {/* Left Side: Greeting or App Name */}
      <div className="flex items-center space-x-2">
        <div className="text-base sm:text-lg md:text-xl font-bold">
          {user ? (
            <span className="bg-gradient-to-r from-teal-500 to-emerald-500 text-transparent bg-clip-text">
              Hello, {getDisplayName(user)}
            </span>
          ) : (
            "MoneyScale"
          )}
        </div>
      </div>

      {/* Right Side: Theme Toggle and Login/Logout Button */}
      <div className="flex items-center space-x-3 mt-2 md:mt-0">
        <button 
          onClick={toggleTheme}
          className="ui-toggle__btn px-3 py-1 rounded transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? "🌙 Dark" : "🌞 Light"}
        </button>
        {user ? (
          <button
            onClick={handleLogout}
            className="button px-4 py-1 rounded bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="button px-4 py-1 rounded bg-teal-500 hover:bg-teal-600 text-white font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Topbar;
