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
        py-6 px-4 text-center border-t transition-colors mt-auto
        ${theme === "light"
          ? "bg-slate-50 text-slate-800 border-slate-200"
          : "bg-slate-800 text-slate-200 border-slate-700"
        }
      `}
    >
      <p className="text-sm font-medium">
        © {new Date().getFullYear()}{" "}
        <span className="
          bg-gradient-to-r from-teal-500 to-emerald-500
          text-transparent bg-clip-text font-bold
        ">
          MoneyScale
        </span>
        . All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
