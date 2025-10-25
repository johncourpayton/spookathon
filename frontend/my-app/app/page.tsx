"use client";
import React, { useState } from "react";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [equation, setEquation] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Display the uploaded image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Send the image to backend
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/solve", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      // Example backend response:
      // { equation: "3x + 5 = 20", answer: "x = 5", steps: ["Simplify...", "Subtract...", "Divide..."] }

      setEquation(data.equation);
      setAnswer(data.answer);
      setSteps(data.steps);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to process equation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-800 p-8">
      <h1 className="text-3xl font-semibold mb-4">Math Equation Solver</h1>
      <p className="text-gray-600 mb-8">
        Upload an image of your equation to get instant solutions
      </p>

      {/* Upload Bubble */}
      <label
        htmlFor="upload"
        className="w-96 h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-gray-100 transition mb-10"
      >
        {image ? (
          <img
            src={image}
            alt="Uploaded equation"
            className="object-contain w-full h-full rounded-xl"
          />
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-gray-500 font-medium">Submit Equation</span>
            <p className="text-xs text-gray-400">Click to upload an image of your math equation</p>
          </>
        )}
        <input
          type="file"
          id="upload"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>

      {loading && <p className="text-gray-500">Processing equation...</p>}

      {/* Show result bubbles only after submission */}
      {equation && answer && steps && !loading && (
        <>
          <div className="flex flex-col md:flex-row gap-6 mb-8 w-full max-w-3xl justify-center">
            <div className="flex-1 bg-white p-4 rounded-lg shadow-md text-center">
              <h2 className="text-gray-500 text-sm font-medium mb-2">Equation</h2>
              <p className="text-lg font-semibold">{equation}</p>
            </div>
            <div className="flex-1 bg-white p-4 rounded-lg shadow-md text-center">
              <h2 className="text-gray-500 text-sm font-medium mb-2">Answer</h2>
              <p className="text-lg font-semibold text-green-600">{answer}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
            <h2 className="text-lg font-medium text-green-700 mb-3">
              Step-by-Step Solution
            </h2>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <p key={i} className="text-gray-700">
                  <strong>Step {i + 1}:</strong> {step}
                </p>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
