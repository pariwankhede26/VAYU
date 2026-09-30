import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const INTELLIGENCE_API_URL = "http://localhost:5001";

export default function Landing() {
  const [highestRisk, setHighestRisk] = useState(null);
  const [countries, setCountries] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("India");

  useEffect(() => {
    fetch(`${INTELLIGENCE_API_URL}/api/hotspots`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error("Hotspots unavailable");
        const highest = [...(data.hotspots || [])].sort(
          (first, second) => second.riskScore - first.riskScore
        )[0];
        setHighestRisk(highest || null);
      })
      .catch((error) => console.error("Landing hotspot load failed:", error));

    fetch(`${INTELLIGENCE_API_URL}/api/country-config`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error("Country context unavailable");
        setCountries(data.countries || {});
      })
      .catch((error) => console.error("Country context load failed:", error));
  }, []);

  const features = [
    {
      icon: "◉",
      title: "Citizen AI Vision",
      text: "Google Gemini Vision analyzes citizen-submitted images and descriptions for visible pollution evidence.",
    },
    {
      icon: "⌁",
      title: "Hyper-local Mapping",
      text: "Explore backend hotspot records in a clearly labeled prototype spatial visualization.",
    },
    {
      icon: "↗",
      title: "Predictive Spread",
      text: "Use the available wind context in a simplified prototype spread estimate.",
    },
  ];

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
              <div className="text-xl font-bold tracking-wide">
                VAYU
              </div>
              <div className="text-[9px] tracking-[0.25em] text-emerald-400">
                AIR INTELLIGENCE
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link to="/" className="text-sm text-white">
              Home
            </Link>

            <Link
              to="/report"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Report Pollution
            </Link>

            <Link
              to="/map"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Live Map
            </Link>

            <Link
              to="/dashboard"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Command Center
            </Link>
          </div>

          <Link
            to="/report"
            className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
          >
            Report Pollution
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <main>
        <section className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">

          {/* LEFT */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-xs text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              AI-POWERED CLIMATE INTELLIGENCE
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              See Pollution.
              <br />

              <span className="bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent">
                Predict Its Path.
              </span>

              <br />

              Act Before It Spreads.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              VAYU transforms citizen pollution evidence into localized environmental intelligence. Google Gemini Vision, a severity-based VAYU Risk Score, prototype hotspot data and simplified wind context form one connected reporting flow.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/report"
                className="rounded-xl bg-emerald-400 px-6 py-4 font-bold text-slate-950 transition hover:scale-105 hover:bg-emerald-300"
              >
                Report Pollution →
              </Link>

              <Link
                to="/dashboard"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Open Command Center
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-xs text-slate-500">
              <span>✓ Powered by Google AI</span>
              <span>✓ Built for Indian cities</span>
              <span>✓ Designed to scale</span>
            </div>
          </div>

          {/* POLLUTION VISUAL */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-emerald-400/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs tracking-widest text-slate-500">
                    PROTOTYPE RISK VISUALIZATION
                  </p>
                  <p className="mt-1 font-semibold">
                    Prototype Visualization
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    SIMULATED DATA
                </div>
              </div>

              <div className="relative h-[400px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900">

                {/* GRID */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* RADAR */}
                <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/20">
                  <div className="absolute inset-8 rounded-full border border-emerald-400/20" />
                  <div className="absolute inset-16 rounded-full border border-emerald-400/20" />
                </div>

                {/* HOTSPOTS */}
                <div className="absolute left-[25%] top-[30%]">
                  <div className="h-5 w-5 rounded-full bg-red-400 shadow-[0_0_30px_rgba(248,113,113,0.8)]" />
                </div>

                <div className="absolute right-[25%] top-[42%]">
                  <div className="h-4 w-4 rounded-full bg-orange-400 shadow-[0_0_30px_rgba(251,146,60,0.8)]" />
                </div>

                <div className="absolute left-[45%] bottom-[25%]">
                  <div className="h-6 w-6 rounded-full bg-yellow-300 shadow-[0_0_35px_rgba(253,224,71,0.8)]" />
                </div>

                {/* VAYU RISK CARD */}
                <div className="absolute left-5 top-5 rounded-xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur">
                  <p className="text-xs text-slate-500">VAYU RISK SCORE</p>
                  <p className="text-4xl font-black text-orange-400">
                    {highestRisk?.riskScore ?? "--"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {highestRisk ? `${highestRisk.city} · prototype record` : "Prototype event"}
                  </p>
                </div>
                <div className="absolute bottom-5 right-5 rounded-xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur">
                  <p className="text-xs text-slate-500">DATA STATUS</p>
                  <p className="text-lg font-bold">
                    Simulated
                  </p>
                  <p className="mt-1 text-xs text-red-400">
                    NOT OFFICIAL AQI
                  </p>
                </div>

                <div className="absolute bottom-5 left-5 rounded-lg bg-red-400/10 px-3 py-2 text-xs text-red-300">
                  SCHEMATIC DATA VIEW
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* DATA DISCLAIMER */}
        <section className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-6 py-6 text-sm leading-6 text-slate-400">
            Prototype / simulated environmental data. VAYU does not currently connect to official AQI, government sensor readings, live weather providers, or a citizen-report database.
          </div>
        </section>

        {/* FEATURES */}
        <section className="mx-auto max-w-7xl px-6 py-24">

          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-emerald-400">
              THE PLATFORM
            </p>

            <h2 className="mt-3 text-4xl font-black">
              From scattered signals to actionable intelligence.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.05]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-xl text-emerald-400">
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-6 py-24">

            <p className="text-sm font-semibold text-emerald-400">
              HOW IT WORKS
            </p>

            <h2 className="mt-3 text-4xl font-black">
              One signal. Three intelligent steps.
            </h2>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                ["01", "REPORT", "Citizens submit a photo, optional location and observation."],
                ["02", "ANALYZE", "Gemini Vision, the risk engine and prototype context create a decision-support view."],
                ["03", "REVIEW", "People review the suggested next step; VAYU does not dispatch alerts."],
              ].map(([number, title, text]) => (
                <div
                  key={number}
                  className="relative rounded-2xl border border-white/10 bg-slate-950 p-7"
                >
                  <p className="text-sm font-bold text-emerald-400">
                    {number}
                  </p>

                  <h3 className="mt-5 text-2xl font-black">
                    {title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-400">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI TRANSPARENCY */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-sm font-semibold text-emerald-400">HOW VAYU AI WORKS</p>
          <h2 className="mt-3 text-4xl font-black">From citizen evidence to a reasoned next step.</h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Citizen evidence",
              "Google Gemini Vision",
              "Visual evidence analysis",
              "Pollution source classification",
              "Severity estimation",
              "Weather + wind context",
              "VAYU Risk Engine",
              "Pollution spread prediction",
            ].map((step, index) => (
              <div key={step} className="border-l-2 border-emerald-400/50 bg-white/[0.03] p-4">
                <p className="text-xs font-bold text-emerald-400">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-2 font-semibold">{step}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-4xl text-sm leading-6 text-slate-400">
            VAYU's AI analysis is an environmental decision-support tool and does not represent an official government AQI measurement. Gemini can identify visual evidence but cannot verify an incident or measure air quality from an image.
          </p>
        </section>

        {/* BRICS CONFIGURATION */}
        <section className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <p className="text-sm font-semibold text-emerald-400">MODULAR COUNTRY CONTEXT</p>
            <h2 className="mt-3 text-4xl font-black">Designed for BRICS-Scale Environmental Intelligence</h2>
            <p className="mt-5 max-w-4xl leading-7 text-slate-400">
              Built for Indian urban and environmental conditions, with a modular architecture that can adapt to pollution sources, geographic contexts and environmental datasets across BRICS nations.
            </p>
            <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
              <label className="text-sm text-slate-400">
                Country context
                <select
                  value={selectedCountry}
                  onChange={(event) => setSelectedCountry(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white"
                >
                  {Object.keys(countries).map((country) => <option key={country}>{country}</option>)}
                </select>
              </label>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">Configured source categories · not a deployment claim</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(countries[selectedCountry]?.pollutionSources || []).map((source) => (
                    <span key={source} className="rounded-md border border-white/10 px-3 py-2 text-sm text-slate-300">{source.replaceAll("_", " ")}</span>
                  ))}
                  {Object.keys(countries).length === 0 && <span className="text-sm text-slate-500">Country configuration unavailable.</span>}
                </div>
              </div>
            </div>
            <p className="mt-8 text-xs text-slate-500">Country contexts are configuration examples. VAYU is not represented as deployed across BRICS nations.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-4xl text-center">

            <h2 className="text-4xl font-black sm:text-5xl">
              Turn scattered pollution signals into actionable intelligence.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-slate-400">
              Help communities detect what traditional monitoring misses.
            </p>

            <Link
              to="/dashboard"
              className="mt-8 inline-block rounded-xl bg-emerald-400 px-7 py-4 font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              Open Command Center →
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 py-10 md:flex-row md:items-center">

          <div>
            <p className="font-bold">VAYU</p>
            <p className="mt-1 text-sm text-slate-500">
              Citizen pollution evidence to localized environmental intelligence.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-slate-500">
            <Link to="/" className="hover:text-white">
              Home
            </Link>

            <Link to="/report" className="hover:text-white">
              Report Pollution
            </Link>

            <Link to="/map" className="hover:text-white">
              Live Map
            </Link>

            <Link to="/dashboard" className="hover:text-white">
              Command Center
            </Link>
          </div>

          <p className="text-xs text-slate-600">
            Prototype environmental intelligence platform
          </p>
        </div>
      </footer>
    </div>
  );
}