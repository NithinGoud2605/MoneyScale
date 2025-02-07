import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const Card = ({ title, children }) => {
  const cardRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      ref={cardRef}
      className="card rounded-xl shadow-xl p-6 bg-white dark:bg-gray-800 
        transition-transform hover:scale-105 transform 
        hover:shadow-2xl overflow-hidden"
    >
      {title && (
        <h2 className="text-xl font-bold mb-4 text-center 
          text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500
        ">
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
