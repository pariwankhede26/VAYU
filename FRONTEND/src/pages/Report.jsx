import { useState } from "react";
import { Link } from "react-router-dom";

export default function Report() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  function handleImage(event) {
    const file = event.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function analyzePollution() {
    if (!image) {
      alert("Please upload a pollution image first.");
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("image", image);
      formData.append("description", description || "");

      // Prototype coordinates for testing.
      // Later we can connect this to actual browser location.
      formData.append("latitude", "26.9124");
      formData.append("longitude", "75.7873");

      const response = await fetch(
        "http://localhost:5000/api/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "AI analysis failed");
      }

      setResult(data.result);
    } catch (error) {
      console.error("AI analysis error:", error);

      alert(
        "AI analysis failed. Make sure the AI backend is running on port 5000."
      );
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Industrial Area, Jaipur"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-4 text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
              />

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
              AI analysis powered by the VAYU backend
            </p>

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
                AI READY
              </div>

            </div>


            {/* WAITING */}
            {!result && !analyzing && (
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
            {result && (
              <div className="space-y-5">

                {/* STATUS */}
                <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <p className="text-xs text-slate-500">
                        DETECTED EVENT
                      </p>

                      <h3 className="mt-2 text-xl font-bold">
                        {result.eventType}
                      </h3>

                    </div>

                    <span className="rounded-full bg-red-400/10 px-3 py-1 text-xs font-bold uppercase text-red-400">
                      {result.severity}
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
                      {result.confidence}%
                    </p>

                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">

                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{
                        width: `${result.confidence}%`,
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
                    {result.possibleSource}
                  </p>

                </div>


                {/* AI EVIDENCE */}
                <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

                  <p className="text-xs tracking-widest text-slate-500">
                    AI EVIDENCE
                  </p>

                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">

                    {result.evidence?.map((item, index) => (
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
                    {result.recommendedAction}
                  </p>

                </div>


                {/* NEXT STEP */}
                <Link
                  to="/map"
                  className="block w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-center font-semibold transition hover:bg-white/10"
                >
                  View Hotspot on Map →
                </Link>

              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}