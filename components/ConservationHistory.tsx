'use client';

import React from 'react';

interface TimelineEvent {
  year: number;
  event: string;
  description: string;
}

interface ConservationHistoryProps {
  history: {
    title: string;
    timeline: TimelineEvent[];
  };
}

export default function ConservationHistory({ history }: ConservationHistoryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{history.title}</h2>
      
      <div className="space-y-4">
        {history.timeline.map((item, index) => (
          <div key={index} className="border-l-4 border-green-600 pl-4 py-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-green-700">{item.year}</span>
              <span className="text-gray-400">•</span>
              <span className="font-semibold text-gray-800">{item.event}</span>
            </div>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
