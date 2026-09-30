import { Link } from "react-router-dom";

export default function Landing() {
  const stats = [
    { value: "127", label: "Active Hotspots" },
    { value: "4,892", label: "Citizen Reports" },
    { value: "18", label: "Cities Ready" },
    { value: "32 min", label: "Avg Response" },
  ];

  const features = [
    {
      icon: "◉",
      title: "Citizen AI Vision",
      text: "Analyze citizen-submitted images and observations to identify visible smoke, burning and emission events.",
    },
    {
      icon: "⌁",
      title: "Hyper-local Mapping",
      text: "Combine citizen observations with environmental signals to reveal pollution hotspots beyond fixed monitoring stations.",
    },
    {
      icon: "↗",
      title: "Predictive Spread",
      text: "Use weather and environmental conditions to estimate where pollution may move next.",
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
              VAYU combines citizen observations, environmental signals,
              satellite intelligence and AI-powered analysis to reveal
              pollution events beyond traditional monitoring stations.
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
                    LIVE AIR INTELLIGENCE
                  </p>
                  <p className="mt-1 font-semibold">
                    Prototype Visualization
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  MONITORING
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

                {/* AQI CARD */}
                <div className="absolute left-5 top-5 rounded-xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur">
                  <p className="text-xs text-slate-500">AQI</p>
                  <p className="text-4xl font-black text-orange-400">
                    187
                  </p>
                  <p className="text-xs text-slate-400">
                    Unhealthy
                  </p>
                </div>

                {/* PM CARD */}
                <div className="absolute bottom-5 right-5 rounded-xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur">
                  <p className="text-xs text-slate-500">
                    PM2.5
                  </p>
                  <p className="text-2xl font-bold">
                    142 µg/m³
                  </p>
                  <p className="mt-1 text-xs text-red-400">
                    HOTSPOT DETECTED
                  </p>
                </div>

                <div className="absolute bottom-5 left-5 rounded-lg bg-red-400/10 px-3 py-2 text-xs text-red-300">
                  INDUSTRIAL ZONE
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-r border-white/10 px-6 py-10 last:border-r-0"
              >
                <p className="text-3xl font-black sm:text-4xl">
                  {stat.value}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {stat.label}
                </p>

                <p className="mt-3 text-[10px] uppercase tracking-wider text-emerald-400/60">
                  Prototype data
                </p>
              </div>
            ))}
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
                ["01", "REPORT", "Citizens submit a photo, location and observation."],
                ["02", "ANALYZE", "AI analyzes the report and combines environmental signals."],
                ["03", "ACT", "Authorities receive prioritized hotspot intelligence."],
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

        {/* INDIA SCALE */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 to-transparent p-8 md:p-14">

            <p className="text-sm font-semibold text-emerald-400">
              BUILT FOR INDIA
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-black">
              Designed as a Digital Public Good for India.
            </h2>

            <p className="mt-5 max-w-2xl leading-8 text-slate-400">
              VAYU is designed around interoperable data, shared predictive
              models and a city-to-state architecture so environmental
              intelligence can move across communities.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Multi-city",
                "Multilingual",
                "Federated AI",
                "Open Data Ready",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>
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
              Hyper-local climate intelligence for India.
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
            Prototype • Code for Communities 2026
          </p>
        </div>
      </footer>
    </div>
  );
}