import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useTheme } from "../theme/ThemeProvider";
import { Link } from "react-router-dom";

const Home = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll(".fade-in"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "power3.out" }
      );
    }
    if (featuresRef.current) {
      gsap.fromTo(
        featuresRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out", delay: 0.5 }
      );
    }
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors ${
        theme === "light"
          ? "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800"
          : "bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200"
      }`}
    >
      <div ref={heroRef} className="max-w-3xl text-center space-y-6 fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-500">
          Welcome to MoneyScale
        </h1>
        <p className="text-base sm:text-lg md:text-xl">
          A smarter way to track your finances, budgets, and transactions—all in one place.
        </p>
        <Link
          to="/login"
          className="inline-block bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-3 rounded-full text-base sm:text-lg hover:opacity-90 transition-transform transform hover:scale-105 shadow-lg font-semibold"
        >
          Get Started
        </Link>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="mt-12 max-w-4xl w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 .74.405 1.385 1 1.723V18h4v-5.277c.595-.338 1-.983 1-1.723 0-1.657-1.343-3-3-3z" />
          </svg>
          <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-100">Budgeting</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Set and manage budgets with ease.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h4l3 8 4-16 3 8h4" />
          </svg>
          <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-100">Transactions</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">View, add, and track every transaction.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-5l-2-2m4 7v-5l2-2m5 7v-3a2 2 0 00-2-2h-3m-4 5v-3a2 2 0 00-2-2H7m7-5a2 2 0 012 2v1m0-1a2 2 0 00-2-2H7m4 0V4m4 4v1" />
          </svg>
          <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-100">Insights</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Visualize your spending trends.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
