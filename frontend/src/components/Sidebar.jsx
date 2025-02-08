import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";

const Sidebar = () => {
  const sidebarRef = useRef(null);
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Run slide-in animation on mount if user does not prefer reduced motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sidebarRef.current && !prefersReducedMotion) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -200, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  const navLinks = [
    { path: "/overview", label: "Overview" },
    { path: "/accounts", label: "Accounts" },
    { path: "/transactions", label: "Transactions" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-teal-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
        aria-label="Toggle Navigation"
      >
        {isSidebarOpen ? (
          // Close (X) Icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Hamburger Menu Icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      <aside
        ref={sidebarRef}
        role="navigation"
        aria-label="Main Navigation"
        className={`
          sidebar fixed md:static inset-y-0 left-0
          w-full md:w-64
          flex flex-col items-start pt-8 px-4
          bg-slate-100 dark:bg-slate-900
          text-slate-700 dark:text-slate-200
          shadow-lg transition-transform duration-300
          z-40
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        {/* Mobile Close Button */}
        <div className="md:hidden w-full flex justify-end mb-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 bg-slate-300 dark:bg-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
            aria-label="Close Navigation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h2
          className={`
            text-xl md:text-2xl font-extrabold mb-6
            bg-gradient-to-r from-teal-500 to-emerald-500
            bg-clip-text text-transparent
          `}
        >
          MoneyScale
        </h2>
        <nav className="space-y-3 w-full">
          <Link
            to="/"
            className={`
              block p-2 rounded transition-colors duration-200
              hover:bg-teal-100 dark:hover:bg-teal-700
              font-semibold text-left w-full
              focus:outline-none focus:ring-2 focus:ring-teal-400
            `}
            onClick={() => setSidebarOpen(false)}
          >
            Home
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`
                block p-2 rounded font-semibold text-left w-full transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-teal-400
                ${
                  location.pathname === link.path
                    ? "bg-teal-200 dark:bg-teal-600 text-teal-900 dark:text-white"
                    : "hover:bg-teal-100 dark:hover:bg-teal-700"
                }
              `}
              onClick={() => setSidebarOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
