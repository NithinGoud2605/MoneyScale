import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useTheme } from "../theme/ThemeProvider";

const Footer = () => {
  const footerRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`
        w-full mt-auto border-t
        ${theme === "light"
          ? "bg-slate-50 text-slate-800 border-slate-200"
          : "bg-slate-800 text-slate-200 border-slate-700"}
      `}
    >
      <div className="container mx-auto px-4 py-4 md:py-6">
        <p className="text-xs sm:text-sm font-medium text-center">
          © {new Date().getFullYear()}{" "}
          <span className="bg-gradient-to-r from-teal-500 to-emerald-500 text-transparent bg-clip-text font-bold">
            MoneyScale
          </span>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
