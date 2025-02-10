import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CombinedInsightBanner = ({ customPrompt, refreshInterval = 45000 }) => {
  const [insight, setInsight] = useState("");

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
      // Remove default prefixes, if any.
      message = message.replace(/^\*\*Actionable Financial Tip:\*\*\s*/, "");
      message = message.replace(/^Actionable Financial Tip:\s*/, "");
      setInsight(message.trim());
    } catch (error) {
      console.error("Error fetching insight:", error);
      setInsight("Failed to load insight.");
    }
  };

  useEffect(() => {
    fetchInsight();
    const interval = setInterval(() => {
      fetchInsight();
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [customPrompt, refreshInterval]);

  // Render the banner only when the insight is ready.
  return (
    <>
      {insight && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto my-4 max-w-2xl px-8 py-4 text-xl font-semibold text-center text-white"
          style={{ backgroundColor: "transparent" }}
        >
          {insight}
        </motion.div>
      )}
    </>
  );
};

export default CombinedInsightBanner;
