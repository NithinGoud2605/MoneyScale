import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useTheme } from "../theme/ThemeProvider";

const Home = () => {
  const heroRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    gsap.fromTo(
      heroRef.current.querySelectorAll(".fade-in"),
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      className={`
        min-h-screen flex flex-col justify-center items-center
        transition-colors
        ${theme === "light"
          ? "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800"
          : "bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200"
        }
      `}
    >
      <div ref={heroRef} className="max-w-3xl text-center px-4">
        <h1
          className="
            text-5xl md:text-7xl font-extrabold mb-6 fade-in
            text-transparent bg-clip-text
            bg-gradient-to-r from-teal-500 to-emerald-500
          "
        >
          Welcome to MoneyScale
        </h1>
        <p className="text-lg md:text-xl mb-8 fade-in">
          The modern way to track your finances, budgets, and transactions
          all in one place—experience the future of personal finance.
        </p>
        <div className="fade-in">
          <Link
            to="/login"
            className="
              inline-block bg-gradient-to-r from-teal-500 to-emerald-500
              text-white px-6 py-3 rounded-full text-lg
              hover:opacity-90 transition-transform transform hover:scale-105
              shadow-lg font-semibold
            "
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
