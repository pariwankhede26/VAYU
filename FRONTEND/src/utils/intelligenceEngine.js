import defaultEvents from "../data/pollution_events.json";

export function analyzeEventClient(description = "", latitude = null, longitude = null) {
  const text = String(description).toLowerCase();
  let eventType = "unclear";
  let severity = "low";
  let possibleSource = "unidentified";

  if (
    text.includes("factory") ||
    text.includes("industrial") ||
    text.includes("chimney") ||
    text.includes("plant") ||
    text.includes("refinery")
  ) {
    eventType = "industrial_emission";
    severity = "high";
    possibleSource = "industrial facility / factory stack";
  } else if (text.includes("dust") || text.includes("construction") || text.includes("demolition")) {
    eventType = "construction_dust";
    severity = "moderate";
    possibleSource = "construction / unpaved site activity";
  } else if (text.includes("garbage") || text.includes("waste") || text.includes("trash") || text.includes("landfill")) {
    eventType = "garbage_burning";
    severity = "high";
    possibleSource = "municipal solid waste or open burning";
  } else if (text.includes("vehicle") || text.includes("car") || text.includes("truck") || text.includes("traffic") || text.includes("exhaust")) {
    eventType = "vehicle_emission";
    severity = "moderate";
    possibleSource = "vehicular exhaust in traffic corridor";
  } else if (text.includes("crop") || text.includes("farm") || text.includes("stubble") || text.includes("field")) {
    eventType = "crop_burning";
    severity = "high";
    possibleSource = "agricultural stubble burning";
  } else if (text.includes("smoke") || text.includes("fire")) {
    eventType = "fire_smoke";
    severity = "high";
    possibleSource = "combustion / open fire smoke";
  }

  const confidence = eventType === "unclear" ? 45 : 75;

  return {
    eventType,
    severity,
    confidence,
    possibleSource,
    evidence: [
      text.trim()
        ? `Citizen observation: "${description.trim()}"`
        : "Citizen visual evidence submitted",
      `Event classified as ${eventType.replace(/_/g, " ")} based on visual cues`
    ],
    recommendedAction:
      eventType === "unclear"
        ? "Collect additional photographic evidence and inspect the reported coordinate."
        : `Inspect the reported ${possibleSource} zone and deploy localized monitoring.`,
    latitude,
    longitude
  };
}

export function calculateRiskClient(event) {
  const severityBands = {
    low: [0, 30],
    moderate: [31, 60],
    high: [61, 80],
    critical: [81, 100]
  };
  const severity = severityBands[event.severity] ? event.severity : "moderate";
  const [minimum, maximum] = severityBands[severity];
  const confidence = Math.max(0, Math.min(Number(event.confidence) || 0, 100));

  const typeAdjustment = {
    industrial_emission: 5,
    crop_burning: 5,
    garbage_burning: 5,
    fire_smoke: 5,
    construction_dust: 3,
    dust_storm: 3,
    vehicle_emission: 2
  }[event.type || event.eventType] || 0;

  const score = Math.min(
    maximum,
    minimum + Math.round(((maximum - minimum) * confidence) / 100) + typeAdjustment
  );

  return {
    riskScore: score,
    riskLevel: severity
  };
}

export function getDefaultWeatherClient() {
  return {
    temperature: 31,
    humidity: 58,
    windSpeed: 14,
    windDirection: "NW",
    condition: "Partly Cloudy"
  };
}

export function predictSpreadClient(latitude, longitude, riskScore, windSpeed = 14, windDirection = "NW") {
  const distance30 = windSpeed * 0.5;
  const distance60 = windSpeed;
  const coordinateChange30 = distance30 / 111;
  const coordinateChange60 = distance60 / 111;

  let latitude30 = latitude;
  let longitude30 = longitude;
  let latitude60 = latitude;
  let longitude60 = longitude;

  switch (String(windDirection).toUpperCase()) {
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
      latitude60 += coordinateChange60 * 0.7;
      longitude60 += coordinateChange60 * 0.7;
      break;
    case "SW":
      latitude30 -= coordinateChange30 * 0.7;
      longitude30 -= coordinateChange30 * 0.7;
      latitude60 += coordinateChange60 * 0.7;
      longitude60 -= coordinateChange60 * 0.7;
      break;
    default:
      latitude30 += coordinateChange30 * 0.7;
      longitude30 -= coordinateChange30 * 0.7;
      latitude60 += coordinateChange60 * 0.7;
      longitude60 -= coordinateChange60 * 0.7;
  }

  const radiusKm = Math.max(1, Math.round((riskScore / 100) * 12));

  return {
    origin: { latitude, longitude },
    spread30Min: {
      latitude: Number(latitude30.toFixed(4)),
      longitude: Number(longitude30.toFixed(4)),
      distanceKm: Number(distance30.toFixed(1))
    },
    spread60Min: {
      latitude: Number(latitude60.toFixed(4)),
      longitude: Number(longitude60.toFixed(4)),
      distanceKm: Number(distance60.toFixed(1))
    },
    plumeRadiusKm: radiusKm,
    windConditions: {
      speed: windSpeed,
      direction: windDirection
    }
  };
}

export function getDefaultHotspotsClient() {
  return defaultEvents.map((event) => {
    const risk = calculateRiskClient(event);
    return {
      ...event,
      riskScore: risk.riskScore,
      riskLevel: risk.riskLevel
    };
  });
}
