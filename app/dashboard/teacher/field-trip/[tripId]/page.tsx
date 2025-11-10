'use client';

import { useState, use } from 'react';
import Link from 'next/link';

interface FieldTrip {
  id: string;
  name: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'planning' | 'active' | 'completed';
  studentCount: number;
  goals: string[];
  checkIns: number;
  observations: number;
  photos: number;
}

export default function FieldTripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  
  // Mock data
  const trip: FieldTrip = {
    id: tripId,
    name: 'Schenley Park Nature Walk',
    location: 'Schenley Park, Pittsburgh, PA',
    date: '2025-11-15',
    startTime: '09:00',
    endTime: '14:00',
    status: 'active',
    studentCount: 24,
    goals: [
      'Identify 5 different bird species',
      'Document 3 types of trees',
      'Take photos of insects',
      'Complete trail observation journal',
    ],
    checkIns: 18,
    observations: 42,
    photos: 67,
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'goals' | 'media'>('overview');

  const progress = Math.round((trip.checkIns / trip.studentCount) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard/teacher" className="text-green-100 hover:text-white mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{trip.name}</h1>
              <div className="flex items-center gap-4 text-green-100">
                <span>📍 {trip.location}</span>
                <span>•</span>
                <span>📅 {new Date(trip.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>⏰ {trip.startTime} - {trip.endTime}</span>
              </div>
            </div>
            {trip.status === 'active' && (
              <span className="px-4 py-2 bg-green-500 rounded-full font-bold animate-pulse">
                ● ACTIVE
              </span>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">{trip.checkIns}/{trip.studentCount}</div>
              <div className="text-sm opacity-90">Students Checked In</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">{trip.observations}</div>
              <div className="text-sm opacity-90">Observations</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">{trip.photos}</div>
              <div className="text-sm opacity-90">Photos</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold">{progress}%</div>
              <div className="text-sm opacity-90">Progress</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'students'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              👥 Students ({trip.checkIns}/{trip.studentCount})
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'goals'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              🎯 Goals
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'media'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📸 Media
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Group Challenges</h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">Team Check-In Goal</span>
                        <span className="text-green-600 font-bold">{Math.round((trip.checkIns / trip.studentCount) * 100)}%</span>
                      </div>
                      <div className="bg-white rounded-full h-3 mb-2">
                        <div className="bg-green-600 h-3 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                      </div>
                      <p className="text-sm text-gray-600">{trip.checkIns} of {trip.studentCount} students checked in</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">Observation Challenge</span>
                        <span className="text-blue-600 font-bold">{trip.observations}/50</span>
                      </div>
                      <div className="bg-white rounded-full h-3 mb-2">
                        <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${(trip.observations / 50) * 100}%` }}></div>
                      </div>
                      <p className="text-sm text-gray-600">Record 50 observations as a group</p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">Photo Documentation</span>
                        <span className="text-purple-600 font-bold">{trip.photos}/100</span>
                      </div>
                      <div className="bg-white rounded-full h-3 mb-2">
                        <div className="bg-purple-600 h-3 rounded-full transition-all" style={{ width: `${(trip.photos / 100) * 100}%` }}></div>
                      </div>
                      <p className="text-sm text-gray-600">Capture 100 photos together</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Recent Activity</h3>
                  <div className="space-y-2">
                    {['Emily checked in at Panther Hollow Trail', 'Marcus uploaded 3 bird photos', 'Sofia completed an observation', 'Team unlocked Photo Master badge!'].map((activity, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-lg">✓</span>
                        <span className="text-gray-700">{activity}</span>
                        <span className="text-xs text-gray-500 ml-auto">{i + 2}m ago</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Student Participation</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: 'Emily Chen', checkedIn: true, observations: 5, photos: 8 },
                    { name: 'Marcus Johnson', checkedIn: true, observations: 3, photos: 6 },
                    { name: 'Sofia Rodriguez', checkedIn: true, observations: 7, photos: 12 },
                    { name: 'David Kim', checkedIn: false, observations: 0, photos: 0 },
                  ].map((student, i) => (
                    <div key={i} className={`p-4 rounded-lg border-2 ${student.checkedIn ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{student.name}</span>
                        {student.checkedIn ? (
                          <span className="text-green-600 font-bold">✓ Checked In</span>
                        ) : (
                          <span className="text-gray-500">Not Yet</span>
                        )}
                      </div>
                      {student.checkedIn && (
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>📝 {student.observations} observations</div>
                          <div>📸 {student.photos} photos</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'goals' && (
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Trip Goals</h3>
                <div className="space-y-3">
                  {trip.goals.map((goal, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <input type="checkbox" className="mt-1 w-5 h-5" defaultChecked={i < 2} />
                      <span className="text-gray-700">{goal}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                  + Add New Goal
                </button>
              </div>
            )}

            {activeTab === 'media' && (
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Photo Gallery</h3>
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center text-4xl">
                      {['🦋', '🌳', '🐦', '🦌', '🌸', '🍂', '🦅', '🐿️', '🌲'][i]}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <button className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6 font-bold text-lg hover:from-green-700 hover:to-green-800 transition-colors flex items-center justify-center gap-3">
            <span className="text-2xl">📍</span>
            <span>Share Location Check-Point</span>
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-colors flex items-center justify-center gap-3">
            <span className="text-2xl">📊</span>
            <span>Generate Trip Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}

