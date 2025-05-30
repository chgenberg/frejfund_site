"use client";
import React, { useState } from "react";
import { NEW_WIZARD_QUESTIONS } from "./NewWizardQuestions";

export default function NewBusinessPlanWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const current = NEW_WIZARD_QUESTIONS[step];

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    setAnswers({ ...answers, [current.id]: e.target.value });
  };

  const handleNext = () => {
    if (current.required && !answers[current.id]) {
      alert("Fältet är obligatoriskt");
      return;
    }
    setStep((s) => Math.min(s + 1, NEW_WIZARD_QUESTIONS.length - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl border max-w-lg w-full p-8 relative">
        <h2 className="text-2xl font-bold mb-6">{current.label}</h2>
        {current.help && <p className="mb-4 text-sm text-gray-600">{current.help}</p>}
        {current.type === "textarea" ? (
          <textarea
            className="w-full p-3 border rounded-xl mb-4"
            value={answers[current.id] || ""}
            onChange={handleChange}
            placeholder="Skriv ditt svar här..."
            rows={5}
          />
        ) : current.type === "select" ? (
          <select
            className="w-full p-3 border rounded-xl mb-4"
            value={answers[current.id] || ""}
            onChange={handleChange}
          >
            <option value="">Välj...</option>
            {current.options?.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            className="w-full p-3 border rounded-xl mb-4"
            type={current.type}
            value={answers[current.id] || ""}
            onChange={handleChange}
            placeholder="Skriv ditt svar här..."
          />
        )}
        <div className="flex justify-between">
          <button onClick={handleBack} disabled={step === 0} className="px-4 py-2 rounded bg-gray-200">Tillbaka</button>
          <button onClick={handleNext} className="px-4 py-2 rounded bg-blue-600 text-white">Nästa</button>
        </div>
        <div className="mt-4 text-xs text-gray-400">Fråga {step + 1} av {NEW_WIZARD_QUESTIONS.length}</div>
      </div>
    </div>
  );
} 