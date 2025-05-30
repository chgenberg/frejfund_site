"use client";
import React, { useState } from 'react';

interface CustomInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CustomTextarea({ value, onChange, placeholder }: CustomInputProps) {
  return (
    <textarea
      className="w-full px-4 py-2 rounded-2xl bg-white/60 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#16475b] placeholder-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md"
      value={value}
      onChange={(e) => {
        console.log('CustomTextarea onChange called with:', e.target.value);
        onChange(e.target.value);
      }}
      placeholder={placeholder}
    />
  );
}

function CustomSelect({ value, onChange, options }: CustomInputProps & { options: string[] }) {
  return (
    <select
      className="w-full px-4 py-2 rounded-2xl bg-white/60 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#16475b] placeholder-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md"
      value={value}
      onChange={(e) => {
        console.log('CustomSelect onChange called with:', e.target.value);
        onChange(e.target.value);
      }}
    >
      <option value="">Välj...</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

export default function TestWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: { [key: string]: string } }>({
    question1: { sub1: '', sub2: '' },
    question2: { sub1: '', sub2: '' }
  });
  const [errors, setErrors] = useState<{ [key: string]: { [key: string]: string } }>({});

  const questions = [
    {
      id: 'question1',
      label: 'Fråga 1',
      subQuestions: [
        { 
          id: 'sub1', 
          label: 'Underfråga 1.1 (textarea)',
          type: 'textarea',
          required: true
        },
        { 
          id: 'sub2', 
          label: 'Underfråga 1.2 (select)',
          type: 'select',
          options: ['Alternativ 1', 'Alternativ 2', 'Alternativ 3'],
          required: true
        }
      ]
    },
    {
      id: 'question2',
      label: 'Fråga 2',
      subQuestions: [
        { 
          id: 'sub1', 
          label: 'Underfråga 2.1 (textarea)',
          type: 'textarea',
          required: true
        },
        { 
          id: 'sub2', 
          label: 'Underfråga 2.2 (select)',
          type: 'select',
          options: ['Alternativ A', 'Alternativ B', 'Alternativ C'],
          required: true
        }
      ]
    }
  ];

  const current = questions[step];

  const validateStep = () => {
    const newErrors: { [key: string]: { [key: string]: string } } = {};
    let isValid = true;

    current.subQuestions.forEach(sub => {
      if (sub.required && !answers[current.id][sub.id]) {
        newErrors[current.id] = {
          ...newErrors[current.id],
          [sub.id]: 'Detta fält är obligatoriskt'
        };
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleAnswerChange = (section: string, field: string, value: string) => {
    console.log('handleAnswerChange called with:', section, field, value);
    setAnswers(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    // Clear error when user types
    if (errors[section]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: ''
        }
      }));
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => Math.min(questions.length - 1, prev + 1));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#f5f7fa] text-[#16475b] rounded-3xl shadow-2xl border border-[#16475b] max-w-lg w-full p-8 relative">
        <h2 className="text-2xl font-bold mb-6">{current.label}</h2>
        
        {current.subQuestions.map((sub) => (
          <div key={sub.id} className="mb-6">
            <label className="block font-semibold mb-2">
              {sub.label}
              {sub.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {sub.type === 'textarea' ? (
              <CustomTextarea
                value={answers[current.id][sub.id]}
                onChange={(value) => handleAnswerChange(current.id, sub.id, value)}
                placeholder="Skriv ditt svar här..."
              />
            ) : (
              <CustomSelect
                value={answers[current.id][sub.id]}
                onChange={(value) => handleAnswerChange(current.id, sub.id, value)}
                options={sub.options || []}
              />
            )}
            {errors[current.id]?.[sub.id] && (
              <div className="text-red-500 text-sm mt-1">{errors[current.id][sub.id]}</div>
            )}
          </div>
        ))}

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setStep(prev => Math.max(0, prev - 1))}
            disabled={step === 0}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            Tillbaka
          </button>
          <button
            onClick={handleNext}
            disabled={step === questions.length - 1}
            className="px-4 py-2 rounded-lg bg-[#16475b] text-white disabled:opacity-50"
          >
            Nästa
          </button>
        </div>

        <div className="mt-4 text-sm">
          Current values: {JSON.stringify(answers[current.id], null, 2)}
        </div>
      </div>
    </div>
  );
}

export const TEST_EXPORT = 1234; 