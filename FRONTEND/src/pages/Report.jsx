import { useState } from "react";
import { Link } from "react-router-dom";

const AI_API_URL = "http://localhost:5000";
const INTELLIGENCE_API_URL = "http://localhost:5001";

function getLocationError(error) {
  if (error.code === 1) {
    return "Location permission unavailable. Please select your location manually.";
  }
  if (error.code === 2) {
    return "Location unavailable. Please enter coordinates manually.";
  }
  if (error.code === 3) {
    return "Location request timed out. Try again or enter coordinates manually.";
  }
  return "Unable to determine location. Please enter coordinates manually.";
}

export default function Report() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationStatus, setLocationStatus] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analysisSource, setAnalysisSource] = useState("");
  const [risk, setRisk] = useState(null);
  const [weather, setWeather] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [predictionError, setPredictionError] = useState("");
  const [intelligenceError, setIntelligenceError] = useState("");
  const [error, setError] = useState("");

  function handleImage(event) {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImage(null);
      setPreview("");
      setError("Please upload a valid pollution image.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationStatus(
        "Location permission unavailable. Please select your location manually."
      );
      return;
    }

    setLocationStatus("Requesting browser location...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLatitude(String(coords.latitude));
        setLongitude(String(coords.longitude));
        setLocationStatus("Browser location selected.");
      },
      (locationError) => setLocationStatus(getLocationError(locationError)),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }

  async function analyzePollution() {
    if (!image || !image.type.startsWith("image/")) {
      setError("Please upload a valid pollution image.");
      return;
    }

    const hasLatitude = latitude.trim() !== "";
    const hasLongitude = longitude.trim() !== "";
    const numericLatitude = Number(latitude);
    const numericLongitude = Number(longitude);

    if (
      hasLatitude !== hasLongitude ||
      (hasLatitude &&
        (!Number.isFinite(numericLatitude) ||
          numericLatitude < -90 ||
          numericLatitude > 90 ||
          !Number.isFinite(numericLongitude) ||
          numericLongitude < -180 ||
          numericLongitude > 180))
    ) {
      setError("Enter a valid latitude and longitude, or leave both blank.");
      return;
    }

    setAnalyzing(true);
    setError("");
    setAnalysis(null);
    setRisk(null);
    setWeather(null);
    setPrediction(null);
    setPredictionError("");
    setIntelligenceError("");

    try {
      const formData = new FormData();

      formData.append("image", image);
      formData.append("description", description || "");
      formData.append("locationName", locationName);
      if (hasLatitude) {
        formData.append("latitude", String(numericLatitude));
        formData.append("longitude", String(numericLongitude));
      }

      const response = await fetch(
        `${AI_API_URL}/api/analyze`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("AI analysis temporarily unavailable. Please try again.");
      }

      setAnalysis(data.result);
      setAnalysisSource(data.source);

      try {
        const riskResponse = await fetch(`${INTELLIGENCE_API_URL}/api/risk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: data.result.eventType,
            severity: data.result.severity,
            confidence: data.result.confidence,
          }),
        });
        const riskData = await riskResponse.json();

        if (!riskResponse.ok || !riskData.success) {
          throw new Error("Risk score unavailable");
        }

        setRisk(riskData.risk);

        const weatherResponse = await fetch(`${INTELLIGENCE_API_URL}/api/weather`);
        const weatherData = await weatherResponse.json();
        if (!weatherResponse.ok || !weatherData.success) {
          throw new Error("Weather context unavailable.");
        }
        setWeather(weatherData.weather);

        if (hasLatitude) {
          const predictionResponse = await fetch(
            `${INTELLIGENCE_API_URL}/api/predict`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                latitude: numericLatitude,
                longitude: numericLongitude,
                riskScore: riskData.risk.riskScore,
                windSpeed: weatherData.weather.windSpeed,
                windDirection: weatherData.weather.windDirection,
              }),
            }
          );
          const predictionData = await predictionResponse.json();
          if (!predictionResponse.ok || !predictionData.success) {
            throw new Error("Spread prediction temporarily unavailable.");
          }
          setPrediction(predictionData.prediction);
        } else {
          setPredictionError("Add coordinates to run a spread prediction.");
        }
      } catch (intelligenceFailure) {
        console.error("Environmental intelligence error:", intelligenceFailure);
        if (intelligenceFailure.message === "Spread prediction temporarily unavailable.") {
          setPredictionError(intelligenceFailure.message);
        } else {
          setIntelligenceError(
            intelligenceFailure.message === "Weather context unavailable."
              ? intelligenceFailure.message
              : "Environmental intelligence service unavailable."
          );
          setPredictionError("Spread prediction temporarily unavailable.");
        }
      }
    } catch (error) {
      console.error("AI analysis error:", error);
      setError("AI analysis temporarily unavailable. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link to="/" className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 font-black text-slate-950">
              V
            </div>

            <div>
              <div className="text-xl font-bold">
                VAYU
              </div>

              <div className="text-[9px] tracking-[0.25em] text-emerald-400">
                AIR INTELLIGENCE
              </div>
            </div>

          </Link>

          <Link
            to="/"
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Back to Home
          </Link>

        </div>
      </nav>


      {/* MAIN */}
      <main className="mx-auto max-w-6xl px-6 py-12">

        {/* HEADER */}
        <div className="mb-10 max-w-3xl">

          <div className="mb-4 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-xs text-emerald-300">
            CITIZEN POLLUTION REPORT
          </div>

          <h1 className="text-4xl font-black sm:text-5xl">
            Report what you see.
            <br />

            <span className="text-emerald-400">
              Let AI investigate.
            </span>
          </h1>

          <p className="mt-5 leading-7 text-slate-400">
            Upload a photo of a pollution event, add the location and
            describe what you observed. VAYU will analyze the signal and
            generate an initial pollution intelligence report.
          </p>

        </div>


        <div className="grid gap-8 lg:grid-cols-2">

          {/* LEFT — REPORT FORM */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="mb-6">

              <h2 className="text-xl font-bold">
                Submit Observation
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                All fields are part of the prototype workflow.
              </p>

            </div>


            {/* IMAGE UPLOAD */}
            <label className="block cursor-pointer">

              <div className="relative flex min-h-[250px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/20 bg-slate-900 transition hover:border-emerald-400/50">

                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Pollution preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-slate-950/50" />

                    <div className="relative rounded-xl bg-slate-950/80 px-5 py-3 text-sm backdrop-blur">
                      Change photo
                    </div>
                  </>
                ) : (
                  <div className="text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-3xl text-emerald-400">
                      +
                    </div>

                    <p className="mt-5 font-semibold">
                      Upload pollution photo
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      JPG, PNG or WEBP
                    </p>

                  </div>
                )}

              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />

            </label>


            {/* LOCATION */}
            <div className="mt-6">

              <label className="mb-2 block text-sm font-medium">
                Location
              </label>

              <input
                type="text"
                value={locationName}
                onChange={(event) => setLocationName(event.target.value)}
                placeholder="Area or landmark (optional)"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-4 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
              />

              <button
                type="button"
                onClick={useMyLocation}
                className="mt-3 rounded-lg border border-emerald-400/30 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/10"
              >
                Use my location
              </button>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-slate-500">
                  Latitude
                  <input
                    type="number"
                    min="-90"
                    max="90"
                    step="any"
                    value={latitude}
                    onChange={(event) => setLatitude(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                  />
                </label>
                <label className="text-xs text-slate-500">
                  Longitude
                  <input
                    type="number"
                    min="-180"
                    max="180"
                    step="any"
                    value={longitude}
                    onChange={(event) => setLongitude(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLatitude("26.9124");
                  setLongitude("75.7873");
                  setLocationName("Jaipur prototype location");
                  setLocationStatus("Jaipur prototype location selected; not your device location.");
                }}
                className="mt-3 text-xs text-slate-500 underline decoration-slate-700 underline-offset-4 hover:text-slate-300"
              >
                Use Jaipur prototype location
              </button>

              {locationStatus && (
                <p className="mt-3 text-xs text-slate-400" role="status">
                  {locationStatus}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-600">
                Location is optional. Spread prediction requires coordinates; manual or prototype coordinates are not device location.
              </p>

            </div>


            {/* DESCRIPTION */}
            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium">
                What did you observe?
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe smoke, burning, unusual smell, traffic emissions, construction dust..."
                rows={5}
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-4 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
              />

            </div>


            {/* BUTTON */}
            <button
              onClick={analyzePollution}
              disabled={analyzing}
              className="mt-6 w-full rounded-xl bg-emerald-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {analyzing
                ? "Analyzing Pollution..."
                : "Analyze with AI →"}
            </button>


            <p className="mt-4 text-center text-xs text-slate-600">
              Your image is sent to Google Gemini Vision through the VAYU backend.
            </p>

            {error && (
              <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300" role="alert">
                {error}
              </p>
            )}

          </div>


          {/* RIGHT — AI RESULT */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <p className="text-xs tracking-widest text-slate-500">
                  VAYU AI
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Pollution Intelligence
                </h2>

              </div>

              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-400">
                GEMINI VISION
              </div>

            </div>


            {/* WAITING */}
            {!analysis && !analyzing && (
              <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-white/5 bg-slate-900/60">

                <div className="max-w-xs text-center">

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/5 text-3xl text-emerald-400">
                    ◉
                  </div>

                  <h3 className="mt-6 font-bold">
                    Awaiting observation
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Upload a photo and submit your observation to generate
                    pollution intelligence.
                  </p>

                </div>

              </div>
            )}


            {/* ANALYZING */}
            {analyzing && (
              <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-white/5 bg-slate-900/60">

                <div className="text-center">

                  <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-emerald-400" />

                  <h3 className="mt-6 font-bold">
                    AI is analyzing the signal...
                  </h3>

                  <p className="mt-3 text-sm text-slate-500">
                    Detecting pollution patterns
                  </p>

                </div>

              </div>
            )}


            {/* RESULT */}
            {analysis && (
              <div className="space-y-5">

                <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-bold text-emerald-300">
                      {analysisSource === "gemini" ? "Powered by Google Gemini AI" : "Prototype fallback result"}
                    </h3>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                      {analysisSource === "gemini" ? "Gemini" : "Prototype fallback"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {analysisSource === "gemini"
                      ? "Google Gemini Vision analyzes citizen-submitted pollution evidence to identify the probable pollution source, severity and supporting visual evidence."
                      : "Gemini was unavailable. This prototype fallback uses the written description only and does not analyze the uploaded image."}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:grid-cols-4">
                    {["Image", "Gemini Vision", "Classification", "Severity + confidence", "Evidence", "VAYU Risk Engine", "Prediction"].map((step) => (
                      <span key={step} className="rounded-lg bg-slate-950/70 px-2 py-3">{step}</span>
                    ))}
                  </div>
                </section>

                {intelligenceError && (
                  <p className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-200" role="status">
                    {intelligenceError}
                  </p>
                )}

                {/* STATUS */}
                <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <p className="text-xs text-slate-500">
                        DETECTED EVENT
                      </p>

                      <h3 className="mt-2 text-xl font-bold">
                        {analysis.eventType}
                      </h3>

                    </div>

                    <span className="rounded-full bg-red-400/10 px-3 py-1 text-xs font-bold uppercase text-red-400">
                      {analysis.severity}
                    </span>

                  </div>

                </div>


                {/* CONFIDENCE */}
                <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

                  <div className="flex justify-between">

                    <p className="text-sm text-slate-400">
                      AI confidence
                    </p>

                    <p className="font-bold text-emerald-400">
                      {analysis.confidence}%
                    </p>

                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">

                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{
                        width: `${analysis.confidence}%`,
                      }}
                    />

                  </div>

                </div>


                {/* POSSIBLE SOURCE */}
                <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

                  <p className="text-xs tracking-widest text-slate-500">
                    POSSIBLE SOURCE
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {analysis.possibleSource}
                  </p>

                </div>


                {/* AI EVIDENCE */}
                <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

                  <p className="text-xs tracking-widest text-slate-500">
                    AI EVIDENCE
                  </p>

                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">

                    {analysis.evidence?.map((item, index) => (
                      <li
                        key={index}
                        className="flex gap-2"
                      >
                        <span className="text-emerald-400">
                          •
                        </span>

                        <span>
                          {item}
                        </span>
                      </li>
                    ))}

                  </ul>

                </div>


                {/* RECOMMENDED ACTION */}
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">

                  <p className="text-xs font-semibold tracking-widest text-emerald-400">
                    RECOMMENDED ACTION
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {analysis.recommendedAction}
                  </p>

                </div>

                {risk && (
                  <section className="rounded-2xl border border-orange-300/20 bg-orange-300/5 p-5">
                    <p className="text-xs tracking-widest text-slate-500">VAYU RISK SCORE</p>
                    <div className="mt-2 flex items-end justify-between gap-4">
                      <p className="text-4xl font-black text-orange-300">{risk.riskScore}<span className="text-base text-slate-500"> / 100</span></p>
                      <p className="font-bold uppercase text-orange-200">{risk.riskLevel} risk</p>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      VAYU Risk Score is an environmental decision-support indicator and is not an official government AQI measurement.
                    </p>
                  </section>
                )}

                {weather && (
                  <section className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                    <h3 className="font-bold">Pollution movement context</h3>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <p className="text-slate-400">Temperature <span className="float-right text-white">{weather.temperature}°C</span></p>
                      <p className="text-slate-400">Humidity <span className="float-right text-white">{weather.humidity}%</span></p>
                      <p className="text-slate-400">Wind speed <span className="float-right text-white">{weather.windSpeed} km/h</span></p>
                      <p className="text-slate-400">Wind direction <span className="float-right text-white">{weather.windDirection}</span></p>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">Prototype weather data</p>
                  </section>
                )}

                {predictionError && (
                  <p className="text-sm text-slate-400" role="status">{predictionError}</p>
                )}

                {prediction && (
                  <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
                    <p className="text-xs font-semibold tracking-widest text-emerald-300">POLLUTION SPREAD PREDICTION</p>
                    <p className="mt-3 text-sm text-slate-300">
                      Current risk {prediction.currentRisk} / 100 · Spread direction {prediction.windDirection} · Wind {prediction.windSpeed} km/h
                    </p>
                    <div className="mt-4 space-y-2">
                      {prediction.predictedZones?.map((zone, index) => (
                        <p key={`${zone.etaMinutes}-${index}`} className="rounded-lg bg-slate-950/60 p-3 text-sm text-slate-300">
                          Potential zone {index + 1}: risk {zone.risk}, estimated impact in {zone.etaMinutes} minutes ({zone.latitude}, {zone.longitude})
                        </p>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-slate-500">Prototype spread prediction using simplified wind-direction logic.</p>
                  </section>
                )}


                {/* NEXT STEP */}
                <Link
                  to="/map"
                  className="block w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-center font-semibold transition hover:bg-white/10"
                >
                  View Hotspots on Map →
                </Link>

              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}