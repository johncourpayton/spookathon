"use client";
import React, { useState, useEffect } from "react";
import { KaTeXRenderer, LaTeXText } from "../components/KaTeXRenderer";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [equation, setEquation] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("It’s looking Spooky");
  const [showAnswer, setShowAnswer] = useState(false);

  const spookyPhrases = [
    "It’s looking Spooky",
    "Summoning the Square Roots",
    "Factoring the Fear",
    "Integrating the Incantations",
  ];

  // 🎃 Rotating spooky loading text
  useEffect(() => {
    if (loading) {
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % spookyPhrases.length;
        setLoadingText(spookyPhrases[i]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    setShowAnswer(false);
    setEquation(null);
    setAnswer(null);
    setSteps(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/solve", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(`Failed: ${errData.error}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setEquation(data.latex);
      const solutionSteps = data.solution.split("\n").filter((line) => line.trim() !== "");
      setSteps(solutionSteps);
      setAnswer(solutionSteps.length > 0 ? solutionSteps[solutionSteps.length - 1] : "See solution below");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-8 bg-gradient-to-b from-[#0f001a] via-[#1a0033] to-[#24004d] text-purple-100">
      <h1 className="text-4xl font-bold mb-4 text-purple-200">Math Equation Solver</h1>
      <p className="text-purple-400 mb-8">
        Upload an image of your equation to get instant solutions
      </p>

      {/* Upload Section */}
      <label
        htmlFor="upload"
        className={`relative w-96 h-64 rounded-2xl flex flex-col items-center justify-center cursor-pointer mb-10 border-2 border-dashed 
          ${loading
            ? "animate-glow border-purple-400 shadow-[0_0_30px_5px_rgba(168,85,247,0.6)]"
            : "border-purple-600 hover:border-purple-400 shadow-[0_0_20px_3px_rgba(168,85,247,0.3)]"
          } bg-[#16002b] transition-all duration-300`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="animate-spin w-10 h-10 rounded-full border-4 border-t-transparent border-purple-400"></div>
            <p className="text-purple-300 animate-pulse">{loadingText}</p>
          </div>
        ) : image ? (
          <img src={image} alt="Uploaded" className="object-contain w-full h-full rounded-2xl" />
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-purple-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-purple-300 font-medium">Submit Equation</span>
            <p className="text-xs text-purple-500">Click to upload an image of your math equation</p>
          </>
        )}
        <input type="file" id="upload" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </label>

      {/* Results */}
      {equation && answer && steps && !loading && (
        <>
          <div className="flex flex-col md:flex-row gap-6 mb-8 w-full max-w-3xl justify-center">
            <div className="flex-1 bg-[#1e003a] p-4 rounded-xl shadow-[0_0_25px_3px_rgba(168,85,247,0.5)] text-center border border-purple-600">
              <h2 className="text-purple-300 text-sm font-medium mb-2">Equation (LaTeX)</h2>
              <div className="text-lg font-semibold text-purple-100">
                <KaTeXRenderer latex={equation || ""} displayMode={true} />
              </div>
            </div>

            {/* Answer Bubble with Blur Reveal */}
            <div
              onClick={() => setShowAnswer(true)}
              className="flex-1 bg-[#1e003a] p-4 rounded-xl shadow-[0_0_25px_3px_rgba(168,85,247,0.5)] text-center border border-purple-600 cursor-pointer group relative"
            >
              <h2 className="text-purple-300 text-sm font-medium mb-2">Final Answer</h2>
              <div
                className={`text-lg font-semibold transition-all duration-500 ${
                  showAnswer ? "text-green-400 blur-none" : "text-green-400 blur-sm group-hover:blur-md"
                }`}
              >
                <LaTeXText content={answer || ""} />
              </div>
              {!showAnswer && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1e003a]/60 text-purple-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to Reveal Answer
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#1e003a] p-6 rounded-xl shadow-[0_0_30px_4px_rgba(168,85,247,0.5)] w-full max-w-3xl border border-purple-700">
            <h2 className="text-lg font-medium text-purple-300 mb-3">Step-by-Step Solution</h2>
            <div className="space-y-4 text-purple-100">
              {steps.map((step, i) => (
                <div key={i}>
                  <LaTeXText content={step} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes glow {
          0% { box-shadow: 0 0 20px 3px rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 40px 6px rgba(168, 85, 247, 0.8); }
          100% { box-shadow: 0 0 20px 3px rgba(168, 85, 247, 0.4); }
        }
        .animate-glow {
          animation: glow 2s infinite ease-in-out;
        }
      `}</style>
    </main>
  );
}


