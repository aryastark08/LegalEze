const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const pdf = require("pdf-parse");
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
const app = express();
const port = process.env.PORT || 3000;

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const API_KEY = "AIzaSyCAsKrHdBwjLvfaPm3HnK0dgiuMVZAYbEE";
const MODEL_NAME = "models/chat-bison-001";

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// Endpoint to upload a PDF file and process its text with PaLM
app.post("/upload", upload.single("pdfFile"), async (req, res) => {
  //fileurl from index.html ln 10
  try {
    // Access the uploaded file through req.file
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const pdfBuffer = req.file.buffer;
    console.log({ pdfBuffer });

    // res.status(200).send("File uploaded successfully.");

    // Extract text from the PDF using your PDF processing library (e.g., pdf-parse)
    const text = await pdf(pdfBuffer);
    console.log(text);
    const pdfText = text.text;

    // Function to process text with PaLM AI
    async function processTextWithPaLM(text) {
      try {
        const result = await client.generateMessage({
          model: "models/chat-bison-001",
          temperature: 0.5,
          candidateCount: 1,
          prompt: {
            context: `Simplify the text that follows and translate it into ${"Hindi"}.`,

            messages: [{ content: text }],
          },
        });

        // Access the simplified text from the result
        const simplifiedText = result[0].candidates[0].content;

        // You can now do something with the simplified text
        console.log("Simplified Text:", simplifiedText);

        return simplifiedText;
      } catch (error) {
        console.error("Error processing text with PaLM:", error.message);
        throw error;
      }
    }
    // Call the function to process the text
    const result = await processTextWithPaLM(pdfText);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// const response = simplifiedText;

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
