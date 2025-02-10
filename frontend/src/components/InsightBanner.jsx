import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const InsightBanner = ({ customPrompt }) => {
  const [insight, setInsight] = useState("");
  const bannerRef = useRef(null);
  const wordsRef = useRef([]);

  const fetchInsight = async () => {
    if (!customPrompt || customPrompt.trim() === "") {
      setInsight("No prompt provided.");
      return;
    }
    try {
      const response = await fetch("https://moneyscale.onrender.com/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: customPrompt }),
      });
      const data = await response.json();
      let message = "";
      if (data.error) {
        message = "Error: " + data.error;
      } else if (data.message) {
        if (typeof data.message === "string") {
          message = data.message;
        } else if (
          data.message.parts &&
          Array.isArray(data.message.parts) &&
          data.message.parts.length > 0 &&
          data.message.parts[0].text
        ) {
          message = data.message.parts[0].text;
        } else {
          message = "No insight provided.";
        }
      } else {
        message = "No insight provided.";
      }
      // Extract only the first sentence.
      if (message) {
        const sentences = message.match(/[^.!?]+[.!?]+/g);
        if (sentences && sentences.length > 0) {
          message = sentences[0].trim();
        }
      }
      setInsight(message);
    } catch (error) {
      console.error("Error fetching insight:", error);
      setInsight("Failed to load insights.");
    }
  };

  const animateWords = () => {
    if (bannerRef.current && insight) {
      bannerRef.current.innerHTML = "";
      wordsRef.current = [];
      const words = insight.split(" ");
      words.forEach((word) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        span.style.opacity = 0;
        bannerRef.current.appendChild(span);
        wordsRef.current.push(span);
      });
      gsap.to(wordsRef.current, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
      });
    }
  };

  useEffect(() => {
    fetchInsight();
    const interval = setInterval(() => {
      fetchInsight();
    }, 15000);
    return () => clearInterval(interval);
  }, [customPrompt]);

  useEffect(() => {
    if (insight) {
      animateWords();
    }
  }, [insight]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "600px",
        minHeight: "40px",
        background: "transparent",
        color: "#fff",
        padding: "10px 20px",
        fontSize: "18px",
        textAlign: "center",
        pointerEvents: "none",
        zIndex: 1000,
        overflow: "hidden",
        textShadow: "1px 1px 2px rgba(0,0,0,0.8)"
      }}
    >
      <div ref={bannerRef} />
    </div>
  );
};

export default InsightBanner;
