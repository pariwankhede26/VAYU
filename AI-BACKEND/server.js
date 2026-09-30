const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");
const { calculateRisk } = require("../INTELLIGENCE-BACKEND/helpers/riskEngine");
const pollutionEvents = require("../INTELLIGENCE-BACKEND/data/pollution_events.json");
const countryConfig = require("../INTELLIGENCE-BACKEND/config/countryConfig");

const fs = require("fs");
const { execSync } = require("child_process");

dotenv.config({ path: path.join(__dirname, "..", ".env") });
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.DEFAULT_APP_PORT
  ? parseInt(process.env.DEFAULT_APP_PORT, 10)
  : (process.env.PORT && process.env.PORT !== "8080" ? parseInt(process.env.PORT, 10) : 3000);
const HOST = "0.0.0.0";
const frontendDist = path.join(__dirname, "..", "FRONTEND", "dist");

if (!fs.existsSync(path.join(frontendDist, "index.html"))) {
  console.log("Frontend build not found; compiling frontend...");
  try {
    execSync("npm run build --prefix FRONTEND", { stdio: "inherit" });
  } catch (err) {
    console.warn("Auto-build frontend failed:", err.message);
  }
}

// Health check endpoints for Cloud Run and ingress probes
app.get(["/health", "/healthz", "/api/health"], (req, res) => {
  res.status(200).json({ status: "ok" });
});

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

let ai = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });
  } catch (error) {
    console.warn("Failed to initialize GoogleGenAI:", error.message);
  }
}

// ==================================================
// TEST GEMINI
// ==================================================

app.get("/api/test-ai", async (req, res) => {
  if (!ai || !process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      success: false,
      error: "GEMINI_API_KEY is not configured"
    });
  }

  try {

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",

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

      if (!req.file || !req.file.mimetype?.startsWith("image/")) {

        return res.status(400).json({
          success: false,
          error: "Please upload a valid pollution image."
        });

      }

      // ------------------------------------------------
      // GET FORM DATA
      // ------------------------------------------------

      const description = req.body.description || "";

      const latitude = req.body.latitude ?? "";

      const longitude = req.body.longitude ?? "";

      const locationName = req.body.locationName || "";

      const hasLatitude = latitude !== "";
      const hasLongitude = longitude !== "";

      if (
        hasLatitude !== hasLongitude ||
        (hasLatitude &&
          (!Number.isFinite(Number(latitude)) ||
            Number(latitude) < -90 ||
            Number(latitude) > 90 ||
            !Number.isFinite(Number(longitude)) ||
            Number(longitude) < -180 ||
            Number(longitude) > 180))
      ) {
        return res.status(400).json({
          success: false,
          error: "Enter a valid latitude and longitude, or omit both."
        });
      }

      const latitudeValue = hasLatitude ? Number(latitude) : null;
      const longitudeValue = hasLongitude ? Number(longitude) : null;

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
${locationName || "Location name not provided"}
Latitude: ${latitudeValue ?? "not provided"}
Longitude: ${longitudeValue ?? "not provided"}

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
        "gemini-3.8-flash",
        "gemini-3.1-flash-lite"
      ];

      let response = null;

      let successfulModel = null;

      let lastError = null;

      // ------------------------------------------------
      // TRY GEMINI MODELS
      // ------------------------------------------------

      if (ai && process.env.GEMINI_API_KEY) {
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

              latitude: latitudeValue,

              longitude: longitudeValue

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

          latitude: latitudeValue,

          longitude: longitudeValue

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
// ENVIRONMENTAL INTELLIGENCE APIs
// ==================================================

app.get("/api/hotspots", (req, res) => {
  const hotspots = pollutionEvents.map((event) => {
    const risk = calculateRisk(event);

    return {
      id: event.id,
      city: event.city,
      latitude: event.latitude,
      longitude: event.longitude,
      type: event.type,
      severity: event.severity,
      confidence: event.confidence,
      riskScore: risk.riskScore,
      riskLevel: risk.riskLevel
    };
  });

  res.json({
    success: true,
    source: "prototype_data",
    hotspots
  });
});

app.get("/api/weather", (req, res) => {
  const weather = {
    temperature: 31,
    humidity: 58,
    windSpeed: 14,
    windDirection: "NW",
    condition: "Partly Cloudy"
  };

  res.json({
    success: true,
    source: "prototype_data",
    notice: "Prototype weather data",
    weather
  });
});

app.post("/api/predict", (req, res) => {
  const {
    latitude,
    longitude,
    riskScore,
    windSpeed,
    windDirection
  } = req.body;

  if (
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180 ||
    !Number.isFinite(riskScore) ||
    riskScore < 0 ||
    riskScore > 100 ||
    !Number.isFinite(windSpeed) ||
    windSpeed < 0 ||
    typeof windDirection !== "string" ||
    !["N", "S", "E", "W", "NE", "NW", "SE", "SW"].includes(
      windDirection.toUpperCase()
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        "latitude, longitude, riskScore, windSpeed and windDirection are required"
    });
  }

  const distance30 = windSpeed * 0.5;
  const distance60 = windSpeed;
  const coordinateChange30 = distance30 / 111;
  const coordinateChange60 = distance60 / 111;
  let latitude30 = latitude;
  let longitude30 = longitude;
  let latitude60 = latitude;
  let longitude60 = longitude;

  switch (windDirection.toUpperCase()) {
    case "N":
      latitude30 += coordinateChange30;
      latitude60 += coordinateChange60;
      break;
    case "S":
      latitude30 -= coordinateChange30;
      latitude60 -= coordinateChange60;
      break;
    case "E":
      longitude30 += coordinateChange30;
      longitude60 += coordinateChange60;
      break;
    case "W":
      longitude30 -= coordinateChange30;
      longitude60 -= coordinateChange60;
      break;
    case "NE":
      latitude30 += coordinateChange30 * 0.7;
      longitude30 += coordinateChange30 * 0.7;
      latitude60 += coordinateChange60 * 0.7;
      longitude60 += coordinateChange60 * 0.7;
      break;
    case "NW":
      latitude30 += coordinateChange30 * 0.7;
      longitude30 -= coordinateChange30 * 0.7;
      latitude60 += coordinateChange60 * 0.7;
      longitude60 -= coordinateChange60 * 0.7;
      break;
    case "SE":
      latitude30 -= coordinateChange30 * 0.7;
      longitude30 += coordinateChange30 * 0.7;
      latitude60 -= coordinateChange60 * 0.7;
      longitude60 += coordinateChange60 * 0.7;
      break;
    case "SW":
      latitude30 -= coordinateChange30 * 0.7;
      longitude30 -= coordinateChange30 * 0.7;
      latitude60 -= coordinateChange60 * 0.7;
      longitude60 -= coordinateChange60 * 0.7;
      break;
  }

  const risk30 = Math.max(Math.round(riskScore * 0.88), 0);
  const risk60 = Math.max(Math.round(riskScore * 0.75), 0);

  res.json({
    success: true,
    source: "prototype_prediction",
    prediction: {
      currentRisk: riskScore,
      windDirection: windDirection.toUpperCase(),
      windSpeed,
      predictedZones: [
        {
          latitude: Number(latitude30.toFixed(4)),
          longitude: Number(longitude30.toFixed(4)),
          risk: risk30,
          etaMinutes: 30
        },
        {
          latitude: Number(latitude60.toFixed(4)),
          longitude: Number(longitude60.toFixed(4)),
          risk: risk60,
          etaMinutes: 60
        }
      ]
    }
  });
});

app.post("/api/risk", (req, res) => {
  const { type, severity, confidence } = req.body;
  const validSeverities = ["low", "moderate", "high", "critical"];
  const validTypes = [
    "industrial_emission",
    "crop_burning",
    "garbage_burning",
    "construction_dust",
    "vehicle_emission",
    "fire_smoke",
    "dust_storm",
    "other",
    "unclear"
  ];

  if (
    !validTypes.includes(type) ||
    !validSeverities.includes(severity) ||
    !Number.isFinite(confidence) ||
    confidence < 0 ||
    confidence > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "type, severity and confidence (0-100) are required"
    });
  }

  res.json({
    success: true,
    source: "vayu_risk_engine",
    risk: calculateRisk({ type, severity, confidence })
  });
});

app.get("/api/country-config", (req, res) => {
  res.json({
    success: true,
    countries: countryConfig
  });
});

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    error: "API route not found"
  });
});

app.use(express.static(frontendDist));

app.use((req, res) => {
  if (req.method === "GET" || req.method === "HEAD") {
    res.sendFile(path.join(frontendDist, "index.html"), (error) => {
      if (error && !res.headersSent) {
        res.status(404).json({
          success: false,
          error: "Frontend build not found. Run npm run build --prefix FRONTEND."
        });
      }
    });
  } else {
    res.status(404).json({
      success: false,
      error: "Not found"
    });
  }
});

// ==================================================
// START SERVER
// ==================================================

const server = app.listen(PORT, HOST, () => {
  console.log(
    `VAYU Backend running on http://${HOST}:${PORT}`
  );
});

server.on("error", (err) => {
  console.error("VAYU server listen error:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

module.exports = app;