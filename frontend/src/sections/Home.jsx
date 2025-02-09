import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useTheme } from "../theme/ThemeProvider";
import { Link } from "react-router-dom";

const Home = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const tl = gsap.timeline();
    tl.from(heroRef.current.querySelectorAll(".hero-element"), {
      duration: 0.8,
      y: 30,
      opacity: 0,
      stagger: 0.2,
      ease: "power3.out"
    }).from(
      featuresRef.current.querySelectorAll(".feature-card"),
      {
        duration: 0.6,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "back.out(1.7)"
      },
      "-=0.5"
    );
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900"
          : "bg-gradient-to-br from-gray-900 to-blue-900 text-gray-100"
      }`}
    >
      <div ref={heroRef} className="max-w-4xl text-center space-y-8">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 hero-element">
          Take Control of Your Finances
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 hero-element">
          Smart budgeting, expense tracking, and financial insights - all in one beautiful platform
        </p>
        <Link
          to="/register"
          className="inline-block px-8 py-4 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:opacity-90 transition-opacity shadow-xl hero-element"
        >
          Get Started Free
        </Link>
      </div>

      <div
        ref={featuresRef}
        className="mt-16 max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-4"
      >
        <div className="feature-card bg-card backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-border hover:-translate-y-2 transition-transform">
          <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl w-max mx-auto">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-cyan-400">Track Everything</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor income, expenses, and investments across all your accounts in real-time
          </p>
        </div>

        <div className="feature-card bg-card backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-border hover:-translate-y-2 transition-transform">
          <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl w-max mx-auto">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-cyan-400">Smart Budgets</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create custom budgets with automatic spending alerts and progress tracking
          </p>
        </div>

        <div className="feature-card bg-card backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-border hover:-translate-y-2 transition-transform">
          <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl w-max mx-auto">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-cyan-400">Powerful Insights</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Get AI-powered financial recommendations and predictive analytics
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
