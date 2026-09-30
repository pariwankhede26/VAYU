const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = 5000;

// ==================================================
// MIDDLEWARE
// ==================================================

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage()
});

// ==================================================
// GEMINI
// ==================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// ==================================================
// HOME
// ==================================================

app.get("/", (req, res) => {
  res.json({
    message: "VAYU Backend is running!"
  });
});

// ==================================================
// TEST GEMINI
// ==================================================

app.get("/api/test-ai", async (req, res) => {
  try {

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",

      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Say exactly: Hello, VAYU!"
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      message: response.text
    });

  } catch (error) {

    console.error("Test AI error:", error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
});

// ==================================================
// PROTOTYPE FALLBACK
// ==================================================

function prototypeFallback(description) {

  const text = description.toLowerCase();

  let eventType = "unclear";
  let severity = "moderate";
  let possibleSource = "unknown pollution source";

  if (
    text.includes("fire") ||
    text.includes("burning") ||
    text.includes("flame")
  ) {
    eventType = "fire_smoke";
    severity = "high";
    possibleSource = "open burning or fire";
  }

  else if (
    text.includes("factory") ||
    text.includes("industrial") ||
    text.includes("chimney")
  ) {
    eventType = "industrial_emission";
    severity = "high";
    possibleSource = "industrial emission";
  }

  else if (
    text.includes("dust") ||
    text.includes("construction")
  ) {
    eventType = "construction_dust";
    severity = "moderate";
    possibleSource = "construction activity";
  }

  else if (
    text.includes("garbage") ||
    text.includes("waste")
  ) {
    eventType = "garbage_burning";
    severity = "high";
    possibleSource = "garbage burning";
  }

  else if (
    text.includes("vehicle") ||
    text.includes("car") ||
    text.includes("truck") ||
    text.includes("traffic")
  ) {
    eventType = "vehicle_emission";
    severity = "moderate";
    possibleSource = "vehicle emissions";
  }

  else if (
    text.includes("crop") ||
    text.includes("farm") ||
    text.includes("stubble")
  ) {
    eventType = "crop_burning";
    severity = "high";
    possibleSource = "agricultural burning";
  }

  else if (text.includes("smoke")) {
    eventType = "fire_smoke";
    severity = "high";
    possibleSource = "visible smoke emission";
  }

  return {
    eventType: eventType,

    severity: severity,

    confidence: eventType === "unclear" ? 35 : 70,

    possibleSource: possibleSource,

    evidence: [
      "user-provided description indicates a possible pollution event"
    ],

    recommendedAction:
      eventType === "unclear"
        ? "Collect additional evidence and inspect the reported location."
        : "Investigate the reported pollution source and monitor the surrounding area."
  };
}

// ==================================================
// ANALYZE POLLUTION IMAGE
// ==================================================

app.post(
  "/api/analyze",
  upload.single("image"),
  async (req, res) => {

    try {

      // ------------------------------------------------
      // CHECK IMAGE
      // ------------------------------------------------

      if (!req.file) {

        return res.status(400).json({
          success: false,
          error: "Image is required."
        });

      }

      // ------------------------------------------------
      // GET FORM DATA
      // ------------------------------------------------

      const description = req.body.description || "";

      const latitude = req.body.latitude || "";

      const longitude = req.body.longitude || "";

      // ------------------------------------------------
      // PROMPT
      // ------------------------------------------------

      const prompt = `
You are VAYU, an AI-powered hyper-local pollution intelligence system.

Analyze the provided image, user description, and location context.

Identify whether the image provides evidence of a pollution-related event.

Classify the event into exactly ONE of:

industrial_emission
crop_burning
garbage_burning
construction_dust
vehicle_emission
fire_smoke
dust_storm
other
unclear

Classify severity as exactly ONE of:

low
moderate
high
critical

Return these fields:

eventType
severity
confidence
possibleSource
evidence
recommendedAction

Confidence must be a number from 0 to 100.

Do not claim that this is an official AQI measurement.

Do not invent sensor readings.

If the image is unclear, use "unclear".

User description:
${description}

Location:
Latitude: ${latitude}
Longitude: ${longitude}

Return ONLY valid JSON.

Example:

{
  "eventType": "industrial_emission",
  "severity": "high",
  "confidence": 91,
  "possibleSource": "industrial combustion",
  "evidence": [
    "dense smoke plume",
    "large emission source"
  ],
  "recommendedAction": "inspect industrial zone"
}
`;

      // ------------------------------------------------
      // IMAGE → BASE64
      // ------------------------------------------------

      const imageBase64 =
        req.file.buffer.toString("base64");

      // ------------------------------------------------
      // GEMINI MODEL FALLBACK
      // ------------------------------------------------

      const models = [
        "gemini-3.7-flash",
        "gemini-3.6-flash",
        "gemini-3.5-flash"
      ];

      let response = null;

      let successfulModel = null;

      let lastError = null;

      // ------------------------------------------------
      // TRY GEMINI MODELS
      // ------------------------------------------------

      for (const model of models) {

        try {

          console.log(
            `Trying Gemini model: ${model}`
          );

          response =
            await ai.models.generateContent({

              model: model,

              contents: [
                {
                  role: "user",

                  parts: [

                    {
                      text: prompt
                    },

                    {
                      inlineData: {
                        mimeType: req.file.mimetype,
                        data: imageBase64
                      }
                    }

                  ]
                }
              ]

            });

          successfulModel = model;

          console.log(
            `Gemini success: ${model}`
          );

          break;

        }

        catch (error) {

          lastError = error;

          console.log(
            `Gemini ${model} failed: ${error.message}`
          );

        }

      }

      // ==================================================
      // GEMINI SUCCESS
      // ==================================================

      if (response) {

        try {

          let text = response.text.trim();

          // Remove ```json ... ``` if Gemini adds it
          text = text.replace(
            /^```json\s*/i,
            ""
          );

          text = text.replace(
            /^```\s*/i,
            ""
          );

          text = text.replace(
            /\s*```$/i,
            ""
          );

          const result = JSON.parse(text);

          return res.json({

            success: true,

            source: "gemini",

            model: successfulModel,

            result: {

              eventType: result.eventType,

              severity: result.severity,

              confidence: result.confidence,

              possibleSource:
                result.possibleSource,

              evidence:
                result.evidence,

              recommendedAction:
                result.recommendedAction,

              latitude:
                Number(latitude),

              longitude:
                Number(longitude)

            }

          });

        }

        catch (parseError) {

          console.log(
            "Gemini returned invalid JSON."
          );

          console.log(
            response.text
          );

          // Continue to prototype fallback
        }

      }

      // ==================================================
      // PROTOTYPE FALLBACK
      // ==================================================

      console.log(
        "Gemini unavailable. Using prototype fallback."
      );

      const fallback =
        prototypeFallback(description);

      return res.json({

        success: true,

        source: "prototype_fallback",

        notice:
          "Gemini was temporarily unavailable. This is a prototype fallback result.",

        result: {

          eventType:
            fallback.eventType,

          severity:
            fallback.severity,

          confidence:
            fallback.confidence,

          possibleSource:
            fallback.possibleSource,

          evidence:
            fallback.evidence,

          recommendedAction:
            fallback.recommendedAction,

          latitude:
            Number(latitude),

          longitude:
            Number(longitude)

        }

      });

    }

    catch (error) {

      console.error(
        "VAYU analyze error:",
        error.message
      );

      res.status(500).json({

        success: false,

        error: error.message

      });

    }

  }
);

// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, () => {

  console.log(
    `VAYU Backend running on http://localhost:${PORT}`
  );

});