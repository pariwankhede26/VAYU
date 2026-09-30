import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5001";

function getPosition(latitude, longitude) {
  const x = 8 + ((longitude - 68) / 30) * 84;
  const y = 8 + ((36 - latitude) / 28) * 84;

  return {
    x: `${Math.max(5, Math.min(x, 95))}%`,
    y: `${Math.max(5, Math.min(y, 95))}%`,
    numericX: Math.max(5, Math.min(x, 95)),
    numericY: Math.max(5, Math.min(y, 95)),
  };
}

function getRiskColor(riskLevel) {
  switch (riskLevel?.toLowerCase()) {
    case "critical":
      return "bg-red-500";
    case "high":
      return "bg-orange-400";
    case "moderate":
      return "bg-yellow-300";
    case "low":
      return "bg-emerald-400";
    default:
      return "bg-slate-400";
  }
}

function getRiskLabel(riskLevel) {
  if (!riskLevel) return "UNKNOWN";

  return riskLevel.toUpperCase();
}

export default function MapView() {
  const [hotspots, setHotspots] = useState([]);
  const [weather, setWeather] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [selectedHotspotId, setSelectedHotspotId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [hotspotError, setHotspotError] = useState("");
  const [weatherError, setWeatherError] = useState("");
  const [predictionError, setPredictionError] = useState("");

  useEffect(() => {
    async function loadEnvironmentalData() {
      const loadHotspots = async () => {
        try {
          const response = await fetch(`${API_URL}/api/hotspots`);
          const data = await response.json();
          if (!response.ok || !data.success) throw new Error();
          const loadedHotspots = data.hotspots || [];
          setHotspots(loadedHotspots);
          setSelectedHotspotId(loadedHotspots[0]?.id ?? null);
        } catch (error) {
          console.error("Hotspot service error:", error);
          setHotspotError("Environmental intelligence service unavailable.");
        } finally {
          setLoading(false);
        }
      };

      const loadWeather = async () => {
        try {
          const response = await fetch(`${API_URL}/api/weather`);
          const data = await response.json();
          if (!response.ok || !data.success) throw new Error();
          setWeather(data.weather || null);
        } catch (error) {
          console.error("Weather service error:", error);
          setWeatherError("Weather context unavailable.");
        }
      };

      await Promise.all([loadHotspots(), loadWeather()]);
    }

    loadEnvironmentalData();
  }, []);

  const selectedHotspot = hotspots.find(
    (hotspot) => hotspot.id === selectedHotspotId
  ) || hotspots[0] || null;

  useEffect(() => {
    if (!selectedHotspot || !weather) return undefined;

    let cancelled = false;
    setPrediction(null);
    setPredictionError("");
    setPredictionLoading(true);

    fetch(`${API_URL}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude: selectedHotspot.latitude,
        longitude: selectedHotspot.longitude,
        riskScore: selectedHotspot.riskScore,
        windSpeed: weather.windSpeed,
        windDirection: weather.windDirection,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error();
        if (!cancelled) setPrediction(data.prediction || null);
      })
      .catch((error) => {
        console.error("Prediction service error:", error);
        if (!cancelled) setPredictionError("Spread prediction temporarily unavailable.");
      })
      .finally(() => {
        if (!cancelled) setPredictionLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedHotspot, weather]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 font-black text-slate-950">
              V
            </div>

            <div>
              <div className="text-xl font-bold">VAYU</div>

              <div className="text-[9px] tracking-[0.25em] text-emerald-400">
                AIR INTELLIGENCE
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <Link
              to="/"
              className="text-sm text-slate-400 hover:text-white"
            >
              Home
            </Link>

            <Link
              to="/report"
              className="text-sm text-slate-400 hover:text-white"
            >
              Report Pollution
            </Link>

            <span className="text-sm font-semibold text-white">
              Live Map
            </span>

            <Link
              to="/dashboard"
              className="text-sm text-slate-400 hover:text-white"
            >
              Command Center
            </Link>
          </div>

          <Link
            to="/report"
            className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300"
          >
            Report Pollution
          </Link>
        </div>
      </nav>

      {/* PAGE */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-xs text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              PROTOTYPE ENVIRONMENTAL INTELLIGENCE
            </div>

            <h1 className="text-4xl font-black sm:text-5xl">
              Hyper-local Pollution Map
            </h1>

            <p className="mt-4 max-w-2xl text-slate-400">
              See where pollution signals are emerging, understand their
              severity and identify areas that may require intervention.
            </p>
          </div>

          {/* CITY */}
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-[10px] uppercase tracking-widest text-slate-500">
              Monitoring city
            </p>

            <p className="mt-1 font-semibold">
              {selectedHotspot?.city || "Prototype coverage"}
            </p>
          </div>
        </div>

        {/* ERROR */}
        {hotspotError && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
            {hotspotError}
          </div>
        )}

        {/* MAP + SIDEBAR */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* MAP */}
          <div className="relative min-h-[650px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
            {/* GRID */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
                backgroundSize: "45px 45px",
              }}
            />

            {/* ROAD LINES */}
            <div className="absolute left-[10%] top-[48%] h-[2px] w-[80%] rotate-12 bg-white/10" />

            <div className="absolute left-[5%] top-[65%] h-[2px] w-[90%] -rotate-6 bg-white/10" />

            <div className="absolute left-[42%] top-[5%] h-[90%] w-[2px] rotate-[15deg] bg-white/10" />

            <div className="absolute left-[65%] top-[10%] h-[80%] w-[2px] -rotate-[30deg] bg-white/10" />

            {/* MAP LABEL */}
            <div className="absolute left-6 top-6 rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur">
              <p className="text-xs text-slate-500">MAP LAYER</p>

              <p className="mt-1 font-semibold">
                Prototype coordinate plot
              </p>
            </div>

            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <marker id="prediction-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                  <path d="M0,0 L5,2.5 L0,5 Z" fill="#fb923c" />
                </marker>
              </defs>
              {prediction?.predictedZones?.map((zone, index) => {
                const sourcePosition = getPosition(selectedHotspot.latitude, selectedHotspot.longitude);
                const targetPosition = getPosition(zone.latitude, zone.longitude);
                return (
                  <line
                    key={`path-${index}`}
                    x1={sourcePosition.numericX}
                    y1={sourcePosition.numericY}
                    x2={targetPosition.numericX}
                    y2={targetPosition.numericY}
                    stroke="#fb923c"
                    strokeWidth="0.6"
                    strokeDasharray="2 1"
                    markerEnd="url(#prediction-arrow)"
                  />
                );
              })}
            </svg>

            {/* LOADING */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-xl border border-white/10 bg-slate-950/90 px-6 py-4 text-sm text-slate-300 backdrop-blur">
                  Loading environmental intelligence...
                </div>
              </div>
            )}

            {/* HOTSPOTS */}
            {!loading &&
              hotspots.map((hotspot) => {
                const position = getPosition(hotspot.latitude, hotspot.longitude);
                const color = getRiskColor(hotspot.riskLevel);

                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    aria-label={`${hotspot.city}: VAYU risk ${hotspot.riskScore}, ${getRiskLabel(hotspot.riskLevel)}. Select hotspot.`}
                    onClick={() => setSelectedHotspotId(hotspot.id)}
                    className="absolute text-left"
                    style={{
                      left: position.x,
                      top: position.y,
                    }}
                  >
                    {/* GLOW */}
                    <div
                      className={`absolute -left-8 -top-8 h-16 w-16 animate-pulse rounded-full ${color} opacity-10 blur-xl`}
                    />

                    {/* DOT */}
                    <div
                      className={`relative h-5 w-5 rounded-full ${color} shadow-lg ${selectedHotspot?.id === hotspot.id ? "ring-4 ring-white/70" : ""}`}
                    />

                    {/* LABEL */}
                    <div className="absolute left-7 top-0 whitespace-nowrap rounded-lg border border-white/10 bg-slate-950/90 px-3 py-2 text-xs backdrop-blur">
                      <p className="font-semibold">{hotspot.city}</p>

                      <p className="mt-1 text-slate-500">
                        {hotspot.riskScore} / 100 · {getRiskLabel(hotspot.riskLevel)}
                      </p>
                    </div>
                  </button>
                );
              })}

            {/* PREDICTED ZONES */}
            {prediction?.predictedZones?.map((zone, index) => (
              <div
                key={`prediction-${index}`}
                className="absolute h-4 w-4 rounded-full border border-orange-300 bg-orange-400/80"
                style={{
                  left: getPosition(zone.latitude, zone.longitude).x,
                  top: getPosition(zone.latitude, zone.longitude).y,
                }}
                title={`Predicted risk ${zone.risk} in ${zone.etaMinutes} minutes`}
              />
            ))}

            {/* PROTOTYPE LABEL */}
            <div className="absolute bottom-5 left-5 rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-500 backdrop-blur">
              Prototype spatial visualization; positions are not geographically precise
            </div>

            {/* LEGEND */}
            <div className="absolute bottom-5 right-5 rounded-xl border border-white/10 bg-slate-950/90 p-4 backdrop-blur">
              <p className="mb-3 text-xs font-semibold">
                RISK SEVERITY
              </p>

              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Low
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
                  Moderate
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                  High
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  Critical
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-5">
            {/* SUMMARY */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs tracking-widest text-slate-500">
                SELECTED PROTOTYPE HOTSPOT
              </p>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-5xl font-black text-orange-400">
                    {selectedHotspot?.riskScore ?? "--"}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    VAYU Risk Score
                  </p>
                  {selectedHotspot && (
                    <p className="mt-2 text-xs text-slate-500">
                      {selectedHotspot.city} · {selectedHotspot.type.replaceAll("_", " ")} · {selectedHotspot.latitude}, {selectedHotspot.longitude}
                    </p>
                  )}
                </div>

                <span className="rounded-full bg-orange-400/10 px-3 py-1 text-xs font-bold text-orange-400">
                  {getRiskLabel(selectedHotspot?.riskLevel)}
                </span>
              </div>

              <div className="mt-5 h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-orange-400"
                  style={{
                    width: `${Math.min(
                      selectedHotspot?.riskScore || 0,
                      100
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Decision-support score from prototype events; not official AQI.
              </p>
            </div>

            {/* WEATHER */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs tracking-widest text-slate-500">
                ENVIRONMENT
              </p>

              {weather ? (
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Temperature</span>
                    <span>{weather.temperature}°C</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Humidity</span>
                    <span>{weather.humidity}%</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Wind</span>
                    <span>
                      {weather.windSpeed} km/h
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Wind direction</span>
                    <span>{weather.windDirection}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Condition</span>
                    <span>{weather.condition}</span>
                  </div>

                  <p className="pt-2 text-xs text-slate-500">Prototype weather data</p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  {weatherError || "Loading weather context..."}
                </p>
              )}
            </div>

            {/* HOTSPOT LIST */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold">Prototype hotspots</h2>

                <span className="text-xs text-emerald-400">
                  {hotspots.length} prototype records
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {hotspots.map((hotspot) => {
                  const color = getRiskColor(hotspot.riskLevel);

                  return (
                    <button
                      key={hotspot.id}
                      type="button"
                      onClick={() => setSelectedHotspotId(hotspot.id)}
                      className={`w-full rounded-xl border bg-slate-900 p-4 text-left ${selectedHotspot?.id === hotspot.id ? "border-emerald-400/50" : "border-white/10"}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${color}`}
                            />

                            <p className="font-semibold">
                              {hotspot.city}
                            </p>
                          </div>

                          <p className="mt-2 text-xs text-slate-500">
                            {hotspot.type.replaceAll("_", " ")}
                          </p>

                          <p className="mt-2 text-xs text-slate-500">
                            {getRiskLabel(hotspot.riskLevel)} VAYU Risk
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-black">
                            {hotspot.riskScore}
                          </p>

                          <p className="text-[10px] text-slate-500">
                            RISK
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PREDICTION */}
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
              <p className="text-xs font-semibold tracking-widest text-emerald-400">
                PROTOTYPE SPREAD PREDICTION
              </p>

              {prediction ? (
                <>
                  <h3 className="mt-3 text-lg font-bold">
                    Movement from {selectedHotspot?.city || "selected hotspot"}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Current risk {prediction.currentRisk} / 100 · Direction {prediction.windDirection} · Wind {prediction.windSpeed} km/h
                  </p>

                  <div className="mt-4 space-y-2">
                    {prediction.predictedZones?.map((zone, index) => (
                      <div
                        key={index}
                        className="rounded-xl bg-slate-950/60 p-3 text-xs"
                      >
                        <div className="flex justify-between">
                          <span className="text-slate-500">
                            Zone {index + 1}
                          </span>

                          <span className="text-orange-400">
                            Risk {zone.risk}
                          </span>
                        </div>

                        <p className="mt-1 text-slate-500">
                          Estimated impact: {zone.etaMinutes} min · Coordinates: {zone.latitude}, {zone.longitude}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  {predictionLoading ? "Calculating spread prediction..." : predictionError || "Select a hotspot and load weather to calculate a prediction."}
                </p>
              )}

              <div className="mt-4 rounded-xl bg-slate-950/60 p-3 text-xs text-slate-500">
                Simplified wind-direction estimate; not a physical dispersion model.
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}