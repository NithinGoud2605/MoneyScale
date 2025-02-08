import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const Card = ({ title, children, className = "" }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    // Respect user's reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      ref={cardRef}
      role="region"
      tabIndex="0"
      aria-label={title ? title : "Card"}
      className={`
        w-full max-w-md mx-auto my-4 p-6 rounded-xl shadow-xl 
        bg-white dark:bg-gray-800 
        transition-transform duration-300 ease-in-out 
        hover:scale-105 hover:shadow-2xl overflow-hidden ${className}
      `}
    >
      {title && (
        <h2 className={`
          text-xl font-bold mb-4 text-center 
          text-transparent bg-clip-text 
          bg-gradient-to-r from-green-400 to-blue-500
        `}>
          {title}
        </h2>
      )}
      {children ? (
        children
      ) : (
        <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-md" />
      )}
    </div>
  );
};

export default Card;
