'use client';

import React, { useState } from 'react';

interface LocalHistoryResearchProps {
  topic?: string;
}

export default function LocalHistoryResearch({ topic = "Local Wildlife" }: LocalHistoryResearchProps) {
  const [notes, setNotes] = useState('');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Local History Research: {topic}
      </h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Research Questions:</h3>
          <ul className="list-disc pl-6 space-y-1 text-gray-600">
            <li>What species were historically found in your area?</li>
            <li>How has habitat changed over time?</li>
            <li>What conservation efforts have been successful?</li>
            <li>What challenges remain today?</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Resources:</h3>
          <ul className="list-disc pl-6 space-y-1 text-gray-600">
            <li>Local historical society archives</li>
            <li>Pennsylvania Game Commission records</li>
            <li>Audubon Pennsylvania bird surveys</li>
            <li>University research databases</li>
          </ul>
        </div>

        <div>
          <label className="block font-semibold text-gray-800 mb-2">
            Your Research Notes:
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Record your findings, observations, and questions here..."
          />
        </div>

        <button
          onClick={() => {
            if (notes.trim()) {
              localStorage.setItem(`research-notes-${topic}`, notes);
              alert('Research notes saved locally!');
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Save Notes Locally
        </button>
      </div>
    </div>
  );
}
