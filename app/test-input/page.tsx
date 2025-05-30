"use client";
import React, { useState } from 'react';

export default function TestInputPage() {
  const [value, setValue] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Test Input</h1>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            console.log('onChange called with:', e.target.value);
            setValue(e.target.value);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type something..."
        />
        <div className="mt-4">
          Current value: {value}
        </div>
      </div>
    </div>
  );
} 