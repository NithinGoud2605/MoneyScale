// routes/geminiRoutes.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

// Use your Gemini API key stored in your .env file
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post("/gemini", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
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
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // Assuming the Gemini API returns content inside the first candidate’s "content" field.
    const generatedContent =
      response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content
        ? response.data.candidates[0].content
        : "No content generated.";
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
