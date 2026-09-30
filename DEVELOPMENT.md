# VAYU Development

This document describes the implementation present in the repository. It does not record unverified dates, authorship, commits, or hackathon history.

## Existing Components

- `FRONTEND/` contains the React/Vite application and the Landing, Report, Map, and Dashboard pages.
- `AI-BACKEND/server.js` serves the Gemini-backed image-analysis endpoint on port 5000.
- `INTELLIGENCE-BACKEND/server.js` serves hotspot, weather, risk-score, country-context, and prediction endpoints on port 5001.
- `INTELLIGENCE-BACKEND/helpers/riskEngine.js` is the shared VAYU Risk Score implementation.

## Gemini Integration

The AI backend uses `@google/genai` with the existing `GEMINI_API_KEY` environment variable. It sends uploaded image bytes and report context to Gemini Vision and retains its configured model fallback list. When Gemini output is unavailable or invalid, the description-based fallback is identified as `prototype_fallback` in the API response.

## Pollution Analysis

The analysis schema contains event type, severity, confidence, possible source, visual evidence, and recommended action. Supported event types are `industrial_emission`, `crop_burning`, `garbage_burning`, `construction_dust`, `vehicle_emission`, `fire_smoke`, `dust_storm`, `other`, and `unclear`.

## Frontend Integration

The Report page sends a selected image and context to port 5000, then sends the returned classification to the existing risk engine endpoint. It requests browser location only on explicit user action and accepts manual coordinates or an explicitly labeled prototype location. Weather and prediction context are displayed only when their endpoints return successfully.

The map and dashboard read hotspot/weather data from port 5001. The map remains a schematic visualization; its markers and forecast zones use API coordinates but are not a geographically precise map.

## Hotspot Intelligence

The backend loads `data/pollution_events.json` and calculates scores through the existing `calculateRisk` helper. Current event records are marked `prototype_simulated` and contain no PM2.5 measurements or citizen-report counts.

## Weather/Wind

The `/api/weather` response is fixed prototype data. No live weather service is configured.

## Prediction

The existing `/api/predict` endpoint estimates 30- and 60-minute coordinates from supplied wind direction and speed. It is simplified prototype logic, not a physical dispersion model.

## Geolocation

The browser's Geolocation API is invoked only after the user clicks **Use my location**. Denial, unavailable geolocation, and timeout have separate user messages. Location is optional for image analysis and risk scoring, but coordinates are required for a spread prediction.

## BRICS Architecture

`config/countryConfig.js` holds country-specific source categories and is served through `/api/country-config`. The configuration is an extensibility example, not evidence of deployments or country-level datasets.

## Prototype Data

The intelligence backend contains 24 synthetic event examples across Indian city contexts. Event coordinates, severity, and confidence are demonstration values and must not be represented as real incidents, official readings, or citizen reports.

## Error Handling

The frontend validates image type and coordinates, allows optional location, and presents separate analysis/intelligence errors. Gemini fallback output remains explicitly identified. Backend routes validate risk and prediction inputs.

## Documentation

Repository-level setup, architecture, limitations, and dependency-license metadata are in `README.md` and `LICENSES.md`.

## Testing

The frontend production build is available with `npm run build` from `FRONTEND/`. Both backend files can be syntax checked with `node --check server.js` from their respective directories. The package manifests do not define automated project test suites; their current `test` scripts are placeholders.