// GeminiBot.js
import React, { useState, useEffect } from "react";

const GeminiBot = ({ customPrompt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);

  // Call the backend endpoint with your custom prompt
  const fetchGeminiContent = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: customPrompt }),
      });
      const data = await response.json();
      if (data.error) {
        setGeneratedText("Error: " + data.error);
      } else {
        setGeneratedText(data.message);
      }
    } catch (error) {
      console.error("Error fetching Gemini content:", error);
      setGeneratedText("Failed to generate content.");
    }
    setLoading(false);
  };

  // Fetch content when the component mounts or when the prompt changes
  useEffect(() => {
    fetchGeminiContent();
  }, [customPrompt]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: isOpen ? "300px" : "60px",
        height: isOpen ? "400px" : "60px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        transition: "all 0.3s ease-in-out",
        overflow: "hidden",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          padding: "10px",
          cursor: "pointer",
          background: "#34a853", // Using a Google green color
          color: "#fff",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Close Gemini Bot" : "Gemini Bot"}
      </div>
      {isOpen && (
        <div style={{ padding: "10px", height: "calc(100% - 40px)", overflowY: "auto" }}>
          {loading ? <p>Loading...</p> : <p>{generatedText}</p>}
          <button
            onClick={fetchGeminiContent}
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              background: "#34a853",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Get New Content
          </button>
        </div>
      )}
    </div>
  );
};

export default GeminiBot;
