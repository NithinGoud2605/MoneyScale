// routes/geminiRoutes.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post("/gemini", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
  
  // Check if API key is configured
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.error("Gemini API key not configured");
    return res.status(500).json({ error: "AI service not configured. Please set up GEMINI_API_KEY." });
  }
  
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        // Optionally, add additional parameters if needed:
        // store: true,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    
    // Log the entire response for debugging
    console.log("Gemini API response:", response.data);
    
    let generatedContent = "No content generated.";
    // Adjust the extraction logic based on the actual response structure.
    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content
    ) {
      const content = response.data.candidates[0].content;
      if (typeof content === "string") {
        generatedContent = content;
      } else if (content.parts && Array.isArray(content.parts)) {
        generatedContent = content.parts.map((part) => part.text).join(" ");
      } else {
        generatedContent = JSON.stringify(content);
      }
    }
    
    res.json({ message: generatedContent });
  } catch (error) {
    console.error(
      "Error calling Gemini API:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to generate content with Gemini API" });
  }
});

module.exports = router;
