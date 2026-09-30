import { Link } from "react-router-dom";

export default function Dashboard() {
  const alerts = [
    {
      title: "Industrial emission detected",
      location: "Jaipur Industrial Area",
      severity: "HIGH",
      time: "8 min ago",
    },
    {
      title: "Smoke event reported",
      location: "Mansarovar",
      severity: "MEDIUM",
      time: "21 min ago",
    },
    {
      title: "Traffic pollution rising",
      location: "Tonk Road",
      severity: "MEDIUM",
      time: "34 min ago",
    },
  ];

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
              Monitor pollution signals, review AI-generated alerts and
              prioritize environmental response.
            </p>

          </div>


          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">

            <p className="text-[10px] uppercase tracking-widest text-slate-500">
              System status
            </p>

            <div className="mt-1 flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <p className="font-semibold text-emerald-400">
                All systems operational
              </p>

            </div>

          </div>

        </div>


        {/* TOP METRICS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Metric
            label="Active Hotspots"
            value="127"
            detail="+12 today"
          />

          <Metric
            label="Citizen Reports"
            value="4,892"
            detail="+184 this week"
          />

          <Metric
            label="AI Alerts"
            value="38"
            detail="7 require action"
          />

          <Metric
            label="Cities Monitored"
            value="18"
            detail="India network"
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
                    Pollution activity is elevated
                  </h2>

                </div>

                <div className="rounded-full bg-orange-400/10 px-4 py-2 text-xs font-bold text-orange-400">
                  ELEVATED RISK
                </div>

              </div>


              {/* CHART */}
              <div className="mt-8">

                <div className="flex h-64 items-end gap-2 rounded-2xl border border-white/5 bg-slate-900 p-5">

                  {[35, 48, 42, 65, 52, 74, 62, 86, 71, 92, 78, 88, 96, 82, 91, 100].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-md bg-emerald-400/60 transition hover:bg-emerald-400"
                        style={{
                          height: `${height}%`,
                        }}
                      />
                    )
                  )}

                </div>

                <div className="mt-3 flex justify-between text-[10px] text-slate-600">
                  <span>06:00</span>
                  <span>09:00</span>
                  <span>12:00</span>
                  <span>15:00</span>
                  <span>18:00</span>
                </div>

              </div>


              <div className="mt-6 grid gap-4 sm:grid-cols-3">

                <MiniStat
                  label="PM2.5"
                  value="142"
                  unit="µg/m³"
                />

                <MiniStat
                  label="AQI"
                  value="187"
                  unit="index"
                />

                <MiniStat
                  label="Wind"
                  value="14"
                  unit="km/h E"
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
                  LIVE
                </span>

              </div>


              <div className="mt-7 grid gap-4 md:grid-cols-4">

                <Pipeline
                  number="01"
                  title="Citizen Signal"
                  status="184 new"
                />

                <Pipeline
                  number="02"
                  title="AI Analysis"
                  status="38 analyzed"
                />

                <Pipeline
                  number="03"
                  title="Risk Priority"
                  status="7 critical"
                />

                <Pipeline
                  number="04"
                  title="Authority Alert"
                  status="12 sent"
                />

              </div>

            </div>


            {/* INDIA SCALE */}
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-6">

              <p className="text-xs font-semibold tracking-widest text-emerald-400">
                INDIA NETWORK
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Designed to work across cities and states
              </h2>

              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

                <City
                  name="Jaipur"
                  status="Active"
                />

                <City
                  name="Delhi"
                  status="Active"
                />

                <City
                  name="Mumbai"
                  status="Ready"
                />

                <City
                  name="Bengaluru"
                  status="Ready"
                />

              </div>

            </div>

          </div>


          {/* RIGHT SIDEBAR */}
          <aside className="space-y-6">


            {/* PRIORITY ALERTS */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs tracking-widest text-slate-500">
                    PRIORITY ALERTS
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Needs attention
                  </h2>
                </div>

                <span className="rounded-full bg-red-400/10 px-3 py-1 text-xs text-red-400">
                  7
                </span>

              </div>


              <div className="mt-6 space-y-4">

                {alerts.map((alert) => (

                  <div
                    key={alert.title}
                    className="rounded-2xl border border-white/10 bg-slate-900 p-4"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <div className="flex items-center gap-2">

                          <span className="h-2 w-2 rounded-full bg-red-400" />

                          <p className="text-sm font-semibold">
                            {alert.title}
                          </p>

                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                          {alert.location}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          {alert.time}
                        </p>

                      </div>

                      <span className="text-[10px] font-bold text-red-400">
                        {alert.severity}
                      </span>

                    </div>

                  </div>

                ))}

              </div>


              <button className="mt-5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10">
                View all alerts
              </button>

            </div>


            {/* ACTION */}
            <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 to-transparent p-6">

              <p className="text-xs font-semibold tracking-widest text-emerald-400">
                RECOMMENDED ACTION
              </p>

              <h2 className="mt-3 text-xl font-bold">
                Inspect Jaipur Industrial Area
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                AI has identified a high-confidence emission signal.
                Nearby authorities can prioritize this location for
                verification.
              </p>

              <button className="mt-5 w-full rounded-xl bg-emerald-400 px-4 py-3 font-bold text-slate-950 hover:bg-emerald-300">
                Create Response Task
              </button>

            </div>


            {/* DATA SOURCES */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

              <p className="text-xs tracking-widest text-slate-500">
                DATA SOURCES
              </p>

              <div className="mt-5 space-y-3">

                <Source
                  name="Citizen Reports"
                  status="Connected"
                />

                <Source
                  name="Environmental Sensors"
                  status="Prototype"
                />

                <Source
                  name="Satellite Signals"
                  status="Prototype"
                />

                <Source
                  name="Weather Data"
                  status="Prototype"
                />

                <Source
                  name="Google AI"
                  status="Connected"
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