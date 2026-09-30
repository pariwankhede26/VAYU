const express = require("express");
const cors = require("cors");

const { calculateRisk } = require("./helpers/riskEngine");
const pollutionEvents = require("./data/pollution_events.json");
const countryConfig = require("./config/countryConfig");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// ------------------------------------
// HOME / TEST ROUTE
// ------------------------------------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VAYU Environmental Intelligence Backend is running!"
  });
});

// ------------------------------------
// HOTSPOTS API
// ------------------------------------
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
    hotspots: hotspots
  });
});

// ------------------------------------
// WEATHER API
// ------------------------------------

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
    weather: weather
  });
});
// ------------------------------------
// POLLUTION PREDICTION API
// ------------------------------------

app.post("/api/predict", (req, res) => {
  const {
    latitude,
    longitude,
    riskScore,
    windSpeed,
    windDirection
  } = req.body;

  // Check required values
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

  // ------------------------------------
  // CALCULATE MOVEMENT DISTANCE
  // ------------------------------------

  // Wind speed is in km/h.
  // Calculate approximate movement for
  // 30 minutes and 60 minutes.

  const distance30 = windSpeed * 0.5;
  const distance60 = windSpeed * 1;

  // Approximate coordinate conversion.
  // This is only for prototype demonstration.

  const coordinateChange30 = distance30 / 111;
  const coordinateChange60 = distance60 / 111;

  let latitude30 = latitude;
  let longitude30 = longitude;

  let latitude60 = latitude;
  let longitude60 = longitude;

  // ------------------------------------
  // MOVE BASED ON WIND DIRECTION
  // ------------------------------------

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

    default:
      return res.status(400).json({
        success: false,
        message:
          "Invalid wind direction. Use N, S, E, W, NE, NW, SE or SW."
      });
  }

  // ------------------------------------
  // REDUCE RISK OVER DISTANCE
  // ------------------------------------

  const risk30 = Math.max(
    Math.round(riskScore * 0.88),
    0
  );

  const risk60 = Math.max(
    Math.round(riskScore * 0.75),
    0
  );

  // ------------------------------------
  // SEND PREDICTION RESPONSE
  // ------------------------------------

  res.json({
    success: true,
    source: "prototype_prediction",

    prediction: {
      currentRisk: riskScore,
      windDirection: windDirection.toUpperCase(),
      windSpeed: windSpeed,

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

// ------------------------------------
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

// START SERVER
// ------------------------------------
app.listen(PORT, () => {
  console.log(
    `VAYU Person 3 Backend running on http://localhost:${PORT}`
  );
});