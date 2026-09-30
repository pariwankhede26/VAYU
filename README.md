# VAYU

VAYU transforms citizen pollution evidence into localized environmental intelligence. It combines citizen-submitted images, Google Gemini Vision analysis, a severity-based VAYU Risk Score, prototype hotspot/weather context, and a simplified wind-direction prediction.

## What VAYU Does

Citizens can submit an image, optional description, and optional browser or manually entered location. Gemini Vision classifies visible pollution evidence. The intelligence backend applies the existing VAYU Risk Engine, serves prototype environmental records and weather context, and estimates possible movement using its prediction endpoint.

## Problem

Environmental observations may be difficult to classify and route for timely follow-up. VAYU demonstrates a connected workflow that turns submitted visual evidence into a transparent, localized decision-support signal.

## Solution

The prototype connects citizen reports to Gemini Vision, a reusable risk engine, hotspot and weather context, and a simplified spread estimate. It is a demonstration and does not verify reports, measure air quality, dispatch responders, or connect to official environmental services.

## Google Gemini AI Integration

`AI-BACKEND/server.js` accepts multipart image uploads at `POST /api/analyze` and sends the image bytes and report context to Google Gemini through `@google/genai`. The response includes event type, severity, confidence, possible source, visual evidence, and a recommended action. A model fallback list is retained.

If Gemini calls fail or return invalid JSON, the route may return a description-based result marked `source: "prototype_fallback"`. The frontend distinguishes this from `source: "gemini"`; fallback output is not image analysis and must not be represented as Gemini output.

## Architecture

```text
Frontend (Vite, default :5173)
  ├── AI-BACKEND (:5000) -> Google Gemini Vision
  └── INTELLIGENCE-BACKEND (:5001)
        ├── Prototype hotspot records
        ├── Prototype weather context
        ├── VAYU Risk Engine
        ├── Simplified spread prediction
        └── Country-context configuration
```

The frontend calls the two backends directly. CORS is enabled in both Express services. No database, authentication, or production deployment configuration is included.

## End-to-End Flow

1. A citizen selects an image and may add a description and location.
2. Browser geolocation is requested only after the user clicks **Use my location**. Manual coordinates and an explicitly labeled Jaipur prototype location are also available; location is optional.
3. The report image and context are sent to `POST /api/analyze` on port 5000.
4. Gemini Vision classifies the image, or the backend identifies a prototype text fallback in its response.
5. The frontend sends the resulting event type, severity, and confidence to `POST /api/risk` on port 5001.
6. The report obtains prototype weather context from `GET /api/weather` and, when coordinates are available, calls `POST /api/predict`.
7. The map loads `GET /api/hotspots`, weather, and predictions for a selected record.

## VAYU Risk Score

The VAYU Risk Score is a 0–100 environmental decision-support indicator, not official AQI. The existing risk engine maps severity to these bands: low 0–30, moderate 31–60, high 61–80, and critical 81–100. Confidence determines a position within the severity band; event categories can adjust the score without crossing the band. The score does not use official sensor readings.

**VAYU Risk Score is not an official government AQI measurement.**

## Hotspot Intelligence

`GET /api/hotspots` returns records from `INTELLIGENCE-BACKEND/data/pollution_events.json`, their coordinates and risk values. The current 24 records are synthetic prototype examples, not real incidents or citizen reports. The frontend map is a schematic coordinate visualization and does not provide geographically precise mapping.

## Weather + Wind

`GET /api/weather` currently returns fixed prototype values for temperature, humidity, wind speed, direction, and condition. They are not live weather observations and do not come from an external weather provider.

## Pollution Spread Prediction

`POST /api/predict` uses latitude, longitude, VAYU Risk Score, wind speed, and wind direction to return estimated zones at 30 and 60 minutes. This is simplified prototype logic, not a physical atmospheric dispersion model. The map plots the returned coordinates on its schematic visualization.

## BRICS Scalability

`INTELLIGENCE-BACKEND/config/countryConfig.js` defines configurable pollution-source categories for India, Brazil, Russia, China, and South Africa. `GET /api/country-config` serves those settings to the frontend. These are architecture examples only; VAYU is not deployed across these countries and includes no country-specific environmental datasets beyond the Indian prototype examples.

## Technology Stack

- Frontend: React, React Router, Vite, Tailwind CSS
- AI backend: Node.js, Express, Multer, Google GenAI SDK
- Intelligence backend: Node.js, Express, the local JSON prototype feed, and `helpers/riskEngine.js`

## Setup Instructions

Requirements: Node.js 20.19 or newer and npm. Install each app's locked dependencies with `npm ci` from its directory. The Gemini API key must be provided to the AI backend through its existing environment-variable name. Do not put keys in frontend code or commit local environment files.

## Environment Variables

The AI backend reads `GEMINI_API_KEY` via `dotenv`:

```dotenv
GEMINI_API_KEY=your_key_here
```

This is an example placeholder, not a real key. The current frontend uses the local backend URLs and does not require API keys.

## Running Locally

Run each command in its own terminal from the repository root:

AI backend:

```powershell
cd .\AI-BACKEND
npm ci
node server.js
```

Intelligence backend:

```powershell
cd .\INTELLIGENCE-BACKEND
npm ci
node server.js
```

Frontend:

```powershell
cd .\FRONTEND
npm ci
npm run dev
```

The services use ports 5000 and 5001. Vite uses its default development port 5173 unless that port is already occupied.

## Prototype Data Disclaimer

Hotspot events, their event confidence/severity, and weather context are simulated prototype values. The application has no official AQI or PM2.5 feed, government or environmental sensor integration, live weather provider, or persisted citizen-report database. Do not treat prototype values as real measurements or incidents.

## AI Transparency

The Report page identifies whether an analysis came from Gemini or the prototype fallback. Gemini can describe visible evidence but cannot establish that an incident is real or derive AQI from an image. VAYU outputs are environmental decision-support information, not an official government AQI measurement.

## Third-Party Attribution

See [LICENSES.md](LICENSES.md) for direct project dependencies and their lockfile license metadata. No external environmental dataset or weather provider is used. The repository does not contain a project-level `LICENSE` file.