import React, { useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";

const Sidebar = () => {
  const sidebarRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(
      sidebarRef.current,
      { x: -200, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const navLinks = [
    { path: "/overview", label: "Overview" },
    { path: "/accounts", label: "Accounts" },
    { path: "/transactions", label: "Transactions" },
  ];

  return (
    <div
      ref={sidebarRef}
      className="
        sidebar flex flex-col items-start pt-8 px-4
        shadow-lg transition-colors
        bg-slate-100 dark:bg-slate-900
        text-slate-700 dark:text-slate-200
      "
    >
      <h2 className="
        text-2xl font-extrabold mb-6
        bg-gradient-to-r from-teal-500 to-emerald-500
        bg-clip-text text-transparent
      ">
        MoneyScale
      </h2>
      <nav className="space-y-3 w-full">
        <Link
          to="/"
          className="
            block mb-2 p-2 rounded hover:bg-teal-100
            dark:hover:bg-teal-700 transition-colors
            font-semibold text-left w-full
          "
        >
          Home
        </Link>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`
              block p-2 rounded font-semibold text-left
              transition-colors w-full
              ${
                location.pathname === link.path
                  ? "bg-teal-200 dark:bg-teal-600 text-teal-900 dark:text-white"
                  : "hover:bg-teal-100 dark:hover:bg-teal-700"
              }
            `}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
