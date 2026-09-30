import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [hotspots, setHotspots] = useState([]);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [loading, setLoading] = useState(true);
  const [serviceError, setServiceError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [hotspotResponse, weatherResponse] = await Promise.all([
          fetch("/api/hotspots"),
          fetch("/api/weather"),
        ]);
        const [hotspotData, weatherData] = await Promise.all([
          hotspotResponse.json(),
          weatherResponse.json(),
        ]);
        if (!hotspotResponse.ok || !hotspotData.success) {
          throw new Error("Environmental intelligence service unavailable.");
        }
        setHotspots(hotspotData.hotspots || []);
        if (weatherResponse.ok && weatherData.success) {
          setWeather(weatherData.weather || null);
        } else {
          setWeatherError("Weather context unavailable.");
        }
      } catch (error) {
        console.error("Dashboard data error:", error);
        setServiceError("Environmental intelligence service unavailable.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const highestRisk = [...hotspots].sort(
    (first, second) => second.riskScore - first.riskScore
  )[0];
  const prototypeCities = [...new Set(hotspots.map((hotspot) => hotspot.city))];

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
              <div className="text-xl font-bold">
                VAYU
              </div>

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

            <Link
              to="/map"
              className="text-sm text-slate-400 hover:text-white"
            >
              Live Map
            </Link>

            <span className="text-sm font-semibold text-white">
              Command Center
            </span>

          </div>

          <Link
            to="/report"
            className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300"
          >
            New Report
          </Link>

        </div>
      </nav>


      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-xs text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              VAYU COMMAND CENTER
            </div>

            <h1 className="text-4xl font-black sm:text-5xl">
              Environmental Intelligence
            </h1>

            <p className="mt-4 max-w-2xl text-slate-400">
              Review simulated hotspot records, inspect VAYU Risk Scores, and follow a citizen image through the Gemini analysis workflow.
            </p>

          </div>


          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">

            <p className="text-[10px] uppercase tracking-widest text-slate-500">
              System status
            </p>

            <div className="mt-1 flex items-center gap-2">

              <p className="font-semibold text-emerald-400">
                Prototype dashboard
              </p>

            </div>

          </div>

        </div>


        {/* TOP METRICS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Metric
            label="Active Hotspots"
            value={loading ? "..." : hotspots.length}
            detail="Prototype / simulated records"
          />

          <Metric
            label="Citizen Reports"
            value="Not collected"
            detail="No citizen-report database"
          />

          <Metric
            label="AI analysis"
            value="Report workflow"
            detail="Gemini Vision integration"
          />

          <Metric
            label="Prototype cities"
            value={loading ? "..." : prototypeCities.length}
            detail="Simulated dataset coverage"
          />

        </div>


        {/* MAIN GRID */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">


          {/* LEFT */}
          <div className="space-y-6">


            {/* AI OVERVIEW */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                  <p className="text-xs tracking-widest text-slate-500">
                    AI ENVIRONMENTAL MODEL
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Prototype environmental signals
                  </h2>

                </div>

                <div className="rounded-full bg-orange-400/10 px-4 py-2 text-xs font-bold text-orange-400">
                  SIMULATED DATA
                </div>

              </div>


              {/* CHART */}
              <div className="mt-8">

                <div className="rounded-2xl border border-white/5 bg-slate-900 p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Highest prototype VAYU Risk Score</p>
                      <p className="mt-2 text-5xl font-black text-orange-300">
                        {highestRisk?.riskScore ?? "--"}<span className="text-base text-slate-500"> / 100</span>
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        {highestRisk ? `${highestRisk.city} · ${highestRisk.type.replaceAll("_", " ")}` : serviceError || "Loading prototype records..."}
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p>Wind</p>
                      <p className="mt-1 text-base text-white">
                        {weather ? `${weather.windSpeed} km/h ${weather.windDirection}` : weatherError || "Unavailable"}
                      </p>
                      <p className="mt-2">Prototype context</p>
                    </div>
                  </div>
                  <div className="mt-5 h-2 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-orange-400" style={{ width: `${highestRisk?.riskScore || 0}%` }} />
                  </div>
                </div>
              </div>


              <div className="mt-6 grid gap-4 sm:grid-cols-3">

                <MiniStat
                  label="Risk level"
                  value={highestRisk?.riskLevel || "--"}
                  unit="VAYU score"
                />

                <MiniStat
                  label="Source category"
                  value={highestRisk?.type?.replaceAll("_", " ") || "--"}
                  unit="prototype"
                />

                <MiniStat
                  label="Temperature"
                  value={weather?.temperature ?? "--"}
                  unit={weather ? "°C · prototype" : "unavailable"}
                />

              </div>

            </div>


            {/* RESPONSE FLOW */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs tracking-widest text-slate-500">
                    RESPONSE PIPELINE
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    From detection to action
                  </h2>
                </div>

                <span className="text-xs text-emerald-400">
                  PROTOTYPE FLOW
                </span>

              </div>


              <div className="mt-7 grid gap-4 md:grid-cols-4">

                <Pipeline
                  number="01"
                  title="Citizen Signal"
                  status="User-submitted image + description"
                />

                <Pipeline
                  number="02"
                  title="Gemini Vision"
                  status="Image analysis available"
                />

                <Pipeline
                  number="03"
                  title="Risk Priority"
                  status="Severity + confidence score"
                />

                <Pipeline
                  number="04"
                  title="Authority response"
                  status="Not connected"
                />

              </div>

            </div>


            {/* PROTOTYPE COVERAGE */}
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-6">

              <p className="text-xs font-semibold tracking-widest text-emerald-400">
                PROTOTYPE DATA COVERAGE
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Synthetic records across Indian city contexts
              </h2>

              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

                {prototypeCities.map((city) => (
                  <City key={city} name={city} status="Prototype record" />
                ))}

                {!prototypeCities.length && (
                  <p className="text-sm text-slate-500">{serviceError || "No prototype records available."}</p>
                )}

              </div>

            </div>

          </div>


          {/* RIGHT SIDEBAR */}
          <aside className="space-y-6">


            {/* HOTSPOT RECORDS */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs tracking-widest text-slate-500">
                    PROTOTYPE HOTSPOTS
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Highest risk records
                  </h2>
                </div>

                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  {hotspots.length}
                </span>

              </div>


              <div className="mt-6 space-y-4">

                {[...hotspots]
                  .sort((first, second) => second.riskScore - first.riskScore)
                  .slice(0, 5)
                  .map((hotspot) => (
                  <div
                    key={hotspot.id}
                    className="rounded-2xl border border-white/10 bg-slate-900 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-orange-300" />
                          <p className="text-sm font-semibold">
                            {hotspot.city} · {hotspot.type.replaceAll("_", " ")}
                          </p>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                          {hotspot.severity && Number.isFinite(hotspot.confidence)
                            ? `${hotspot.severity} · ${hotspot.confidence}% prototype confidence`
                            : "Prototype classification"}
                        </p>
                      </div>
                      <span className="text-right text-sm font-bold text-orange-300">
                        {hotspot.riskScore}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {loading && <p className="mt-4 text-sm text-slate-500">Loading prototype records...</p>}
              {!loading && !hotspots.length && <p className="mt-4 text-sm text-slate-500">{serviceError || "No prototype records available."}</p>}

              <Link to="/map" className="mt-5 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold hover:bg-white/10">
                Open hotspot map
              </Link>

            </div>


            {/* ACTION */}
            <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 to-transparent p-6">

              <p className="text-xs font-semibold tracking-widest text-emerald-400">
                RECOMMENDED ACTION
              </p>

              <h2 className="mt-3 text-xl font-bold">
                {highestRisk ? `Review ${highestRisk.city} prototype record` : "Review environmental signals"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Confirm the reported source in the field before taking action. The dashboard uses simulated records and does not send alerts to authorities.
              </p>

              <Link to="/report" className="mt-5 block w-full rounded-xl bg-emerald-400 px-4 py-3 text-center font-bold text-slate-950 hover:bg-emerald-300">
                Submit an observation
              </Link>

            </div>


            {/* DATA SOURCES */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

              <p className="text-xs tracking-widest text-slate-500">
                DATA SOURCES
              </p>

              <div className="mt-5 space-y-3">

                <Source
                  name="Citizen image analysis"
                  status="Gemini Vision"
                />

                <Source
                  name="Hotspot records"
                  status="Simulated"
                />

                <Source
                  name="Weather context"
                  status="Prototype"
                />

                <Source
                  name="Official AQI"
                  status="Not connected"
                />

                <Source
                  name="VAYU Risk Engine"
                  status="Severity-based"
                />

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}


/* COMPONENTS */

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black">
        {value}
      </p>

      <p className="mt-2 text-xs text-emerald-400">
        {detail}
      </p>

    </div>
  );
}


function MiniStat({ label, value, unit }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900 p-4">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <div className="mt-2 flex items-baseline gap-2">

        <span className="text-2xl font-black">
          {value}
        </span>

        <span className="text-xs text-slate-500">
          {unit}
        </span>

      </div>

    </div>
  );
}


function Pipeline({ number, title, status }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900 p-4">

      <p className="text-xs font-bold text-emerald-400">
        {number}
      </p>

      <p className="mt-3 text-sm font-semibold">
        {title}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {status}
      </p>

    </div>
  );
}


function City({ name, status }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">

      <div className="flex items-center gap-2">

        <span className="h-2 w-2 rounded-full bg-emerald-400" />

        <p className="text-sm font-semibold">
          {name}
        </p>

      </div>

      <p className="mt-2 text-xs text-slate-500">
        {status}
      </p>

    </div>
  );
}


function Source({ name, status }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900 px-4 py-3">

      <span className="text-sm text-slate-300">
        {name}
      </span>

      <span className="text-[10px] text-emerald-400">
        {status}
      </span>

    </div>
  );
}