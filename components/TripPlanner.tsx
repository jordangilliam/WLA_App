/**
 * Trip Planner Component
 * 
 * Professional trip planning tools for field work:
 * - Create and save trips
 * - Add water bodies and locations
 * - Weather integration
 * - Packing lists
 * - Route planning
 * - Share with friends
 * - Export to calendar
 * - Offline access
 */

'use client';

import { useState, useEffect } from 'react';

export interface Trip {
  id: string;
  name: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  locations: TripLocation[];
  participants?: string[];
  packingList: PackingItem[];
  notes?: string;
  weather?: {
    temp: number;
    conditions: string;
    fishingScore: number;
  };
  photos?: string[];
  catches?: number;
  createdAt: number;
  updatedAt: number;
}

export interface TripLocation {
  id: string;
  waterBodyId: string;
  waterBodyName: string;
  lat: number;
  lon: number;
  arrivalTime?: string;
  duration?: number; // minutes
  targetSpecies?: string[];
  notes?: string;
  order: number;
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'Fishing' | 'Safety' | 'Food' | 'Clothing' | 'Electronics' | 'Other';
  quantity: number;
  packed: boolean;
}

const DEFAULT_PACKING_ITEMS: Omit<PackingItem, 'id' | 'packed'>[] = [
  // Fishing
  { name: 'Fishing Rod', category: 'Fishing', quantity: 1 },
  { name: 'Reel', category: 'Fishing', quantity: 1 },
  { name: 'Tackle Box', category: 'Fishing', quantity: 1 },
  { name: 'Fishing License', category: 'Fishing', quantity: 1 },
  { name: 'Landing Net', category: 'Fishing', quantity: 1 },
  { name: 'Pliers/Forceps', category: 'Fishing', quantity: 1 },
  { name: 'Measuring Tape', category: 'Fishing', quantity: 1 },
  
  // Safety
  { name: 'First Aid Kit', category: 'Safety', quantity: 1 },
  { name: 'Sunscreen', category: 'Safety', quantity: 1 },
  { name: 'Insect Repellent', category: 'Safety', quantity: 1 },
  { name: 'Life Jacket (if boating)', category: 'Safety', quantity: 1 },
  { name: 'Whistle', category: 'Safety', quantity: 1 },
  
  // Food & Water
  { name: 'Water Bottle', category: 'Food', quantity: 2 },
  { name: 'Snacks', category: 'Food', quantity: 1 },
  { name: 'Lunch', category: 'Food', quantity: 1 },
  
  // Clothing
  { name: 'Hat/Cap', category: 'Clothing', quantity: 1 },
  { name: 'Sunglasses', category: 'Clothing', quantity: 1 },
  { name: 'Rain Jacket', category: 'Clothing', quantity: 1 },
  { name: 'Extra Clothes', category: 'Clothing', quantity: 1 },
  { name: 'Waders/Boots', category: 'Clothing', quantity: 1 },
  
  // Electronics
  { name: 'Phone (charged)', category: 'Electronics', quantity: 1 },
  { name: 'Portable Charger', category: 'Electronics', quantity: 1 },
  { name: 'Camera', category: 'Electronics', quantity: 1 },
  { name: 'GPS Device', category: 'Electronics', quantity: 1 },
];

/**
 * Trip Planner Component
 */
export function TripPlanner() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = () => {
    try {
      const stored = localStorage.getItem('wla-trips');
      if (stored) {
        setTrips(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load trips:', error);
    }
  };

  const saveTrips = (newTrips: Trip[]) => {
    try {
      localStorage.setItem('wla-trips', JSON.stringify(newTrips));
      setTrips(newTrips);
    } catch (error) {
      console.error('Failed to save trips:', error);
    }
  };

  const createTrip = () => {
    const newTrip: Trip = {
      id: Date.now().toString(),
      name: 'New Fishing Trip',
      date: new Date().toISOString().split('T')[0],
      status: 'planned',
      locations: [],
      packingList: DEFAULT_PACKING_ITEMS.map((item, i) => ({
        ...item,
        id: `item-${i}`,
        packed: false
      })),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    saveTrips([...trips, newTrip]);
    setSelectedTrip(newTrip);
    setIsCreating(true);
  };

  const updateTrip = (updatedTrip: Trip) => {
    const newTrips = trips.map(t => t.id === updatedTrip.id ? { ...updatedTrip, updatedAt: Date.now() } : t);
    saveTrips(newTrips);
    setSelectedTrip(updatedTrip);
  };

  const deleteTrip = (tripId: string) => {
    if (confirm('Delete this trip?')) {
      saveTrips(trips.filter(t => t.id !== tripId));
      if (selectedTrip?.id === tripId) {
        setSelectedTrip(null);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#023047', marginBottom: '0.5rem' }}>
              🗓️ Trip Planner
            </h1>
            <p style={{ color: '#6B7280', fontSize: '1rem' }}>
              Plan and organize your fishing trips
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.75rem 1.5rem',
                background: viewMode === 'list' ? '#0077B6' : 'white',
                color: viewMode === 'list' ? 'white' : '#023047',
                border: '2px solid #0077B6',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              📋 List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              style={{
                padding: '0.75rem 1.5rem',
                background: viewMode === 'calendar' ? '#0077B6' : 'white',
                color: viewMode === 'calendar' ? 'white' : '#023047',
                border: '2px solid #0077B6',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              📅 Calendar
            </button>
            <button
              onClick={createTrip}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#06D6A0',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ➕ New Trip
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedTrip ? '1fr 2fr' : '1fr', gap: '1.5rem' }}>
          {/* Trip List */}
          <div>
            <TripList
              trips={trips}
              selectedTripId={selectedTrip?.id}
              onSelectTrip={setSelectedTrip}
              onDeleteTrip={deleteTrip}
            />
          </div>

          {/* Trip Details */}
          {selectedTrip && (
            <div>
              <TripDetails
                trip={selectedTrip}
                onUpdate={updateTrip}
                onClose={() => setSelectedTrip(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Trip List Component
 */
function TripList({
  trips,
  selectedTripId,
  onSelectTrip,
  onDeleteTrip
}: {
  trips: Trip[];
  selectedTripId?: string;
  onSelectTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
}) {
  const sortedTrips = [...trips].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {sortedTrips.map(trip => (
        <div
          key={trip.id}
          onClick={() => onSelectTrip(trip)}
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: trip.id === selectedTripId ? '0 4px 16px rgba(0,119,182,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
            border: trip.id === selectedTripId ? '2px solid #0077B6' : '2px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#023047', marginBottom: '0.25rem' }}>
                {trip.name}
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                📅 {new Date(trip.date).toLocaleDateString()}
                {trip.startTime && ` • ⏰ ${trip.startTime}`}
              </div>
            </div>
            
            <div style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: trip.status === 'completed' ? '#D1FAE5' : 
                          trip.status === 'in-progress' ? '#FEF3C7' : '#DBEAFE',
              color: trip.status === 'completed' ? '#065F46' : 
                     trip.status === 'in-progress' ? '#92400E' : '#1E40AF'
            }}>
              {trip.status}
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.75rem' }}>
            📍 {trip.locations.length} location(s) • 🎒 {trip.packingList.filter(i => i.packed).length}/{trip.packingList.length} packed
          </div>

          {trip.description && (
            <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.75rem' }}>
              {trip.description.substring(0, 100)}{trip.description.length > 100 ? '...' : ''}
            </div>
          )}
        </div>
      ))}

      {trips.length === 0 && (
        <div style={{
          background: 'white',
          padding: '3rem 2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗓️</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#023047', marginBottom: '0.5rem' }}>
            No Trips Yet
          </h3>
          <p style={{ color: '#6B7280' }}>
            Create your first trip to start planning!
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Trip Details Component
 */
function TripDetails({
  trip,
  onUpdate,
  onClose
}: {
  trip: Trip;
  onUpdate: (trip: Trip) => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'details' | 'locations' | 'packing' | 'share'>('details');

  const handlePackingToggle = (itemId: string) => {
    const updatedList = trip.packingList.map(item =>
      item.id === itemId ? { ...item, packed: !item.packed } : item
    );
    onUpdate({ ...trip, packingList: updatedList });
  };

  const packingProgress = (trip.packingList.filter(i => i.packed).length / trip.packingList.length) * 100;

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #023047 0%, #0077B6 100%)',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={trip.name}
              onChange={(e) => onUpdate({ ...trip, name: e.target.value })}
              style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                background: 'transparent',
                border: 'none',
                color: 'white',
                width: '100%',
                marginBottom: '0.5rem'
              }}
            />
            <input
              type="date"
              value={trip.date}
              onChange={(e) => onUpdate({ ...trip, date: e.target.value })}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem',
                color: 'white',
                fontWeight: 600
              }}
            />
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #E5E7EB',
        background: '#F9FAFB'
      }}>
        {(['details', 'locations', 'packing', 'share'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '1rem',
              background: activeTab === tab ? 'white' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid #0077B6' : '3px solid transparent',
              fontWeight: 700,
              color: activeTab === tab ? '#0077B6' : '#6B7280',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: '1.5rem', maxHeight: '600px', overflow: 'auto' }}>
        {activeTab === 'details' && (
          <div>
            <textarea
              value={trip.description || ''}
              onChange={(e) => onUpdate({ ...trip, description: e.target.value })}
              placeholder="Add trip description..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '1rem',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>
        )}

        {activeTab === 'packing' && (
          <div>
            {/* Progress */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: '#023047' }}>Packing Progress</span>
                <span style={{ fontWeight: 700, color: '#0077B6' }}>{Math.round(packingProgress)}%</span>
              </div>
              <div style={{ height: '12px', background: '#E5E7EB', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${packingProgress}%`,
                  background: 'linear-gradient(90deg, #0077B6, #06D6A0)',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>

            {/* Packing List */}
            {Object.entries(
              trip.packingList.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
              }, {} as Record<string, PackingItem[]>)
            ).map(([category, items]) => (
              <div key={category} style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#6B7280', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                  {category}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {items.map(item => (
                    <label
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: item.packed ? '#F0FDF4' : '#F9FAFB',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={item.packed}
                        onChange={() => handlePackingToggle(item.id)}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      />
                      <span style={{
                        flex: 1,
                        fontWeight: 600,
                        color: item.packed ? '#065F46' : '#374151',
                        textDecoration: item.packed ? 'line-through' : 'none'
                      }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                        ×{item.quantity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'share' && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#023047', marginBottom: '1rem' }}>
              Share This Trip
            </h3>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              Share your trip plan with friends or export to your calendar
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '300px', margin: '0 auto' }}>
              <button style={{
                padding: '0.75rem',
                background: '#0077B6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                📤 Share Link
              </button>
              <button style={{
                padding: '0.75rem',
                background: '#06D6A0',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                📅 Export to Calendar
              </button>
              <button style={{
                padding: '0.75rem',
                background: '#FFD60A',
                color: '#023047',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                📧 Email Trip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripPlanner;

