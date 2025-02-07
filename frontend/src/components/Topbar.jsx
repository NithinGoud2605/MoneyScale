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

  // Helper function to get display name with first letter capitalized
  const getDisplayName = (user) => {
    if (!user) return "";
    // If the user object has a "username" property, use it.
    // Otherwise, use the part of the email before "@".
    const name = user.username ? user.username : user.email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div
      ref={topbarRef}
      className={`
        navbar flex items-center justify-between px-4 py-3
        border-b transition-colors
        ${theme === "light"
          ? "bg-slate-50 border-slate-200 text-slate-800"
          : "bg-slate-800 border-slate-700 text-slate-200"
        }
      `}
    >
      {/* Left side: App name or greeting */}
      <div className="text-lg font-bold">
        {user ? (
          <span className="bg-gradient-to-r from-teal-500 to-emerald-500 text-transparent bg-clip-text">
            Hello, {getDisplayName(user)}
          </span>
        ) : (
          "MoneyScale"
        )}
      </div>

      {/* Right side: Theme Toggle & Logout/Login */}
      <div className="flex items-center space-x-4">
        <button className="ui-toggle__btn hover:scale-105" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "🌞 Light"}
        </button>
        {user ? (
          <button
            className="button bg-red-500 hover:bg-red-600 text-white font-semibold"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="button bg-teal-500 hover:bg-teal-600 text-white font-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Topbar;
