'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePoints } from '@/ui/points/PointsProvider';
import NatureSoundRecorder from '@/components/journal/NatureSoundRecorder';

interface JournalEntry {
  id: string;
  timestamp: number;
  type: 'observation' | 'reflection' | 'data' | 'photo';
  title: string;
  content: string;
  photo?: string;
  location?: { lat: number; lng: number };
  weather?: string;
  tags: string[];
  favorite: boolean;
}

const SUGGESTED_TAGS = [
  'brook-trout', 'bass', 'deer', 'turkey', 'bear',
  'macroinvertebrate', 'bird', 'amphibian',
  'water-quality', 'habitat', 'behavior',
  'field-work', 'research', 'conservation'
];

const WEATHER_OPTIONS = [
  '☀️ Sunny', '⛅ Partly Cloudy', '☁️ Cloudy', 
  '🌧️ Rainy', '🌨️ Snowy', '🌫️ Foggy', '🌬️ Windy'
];

export default function JournalPage() {
  const { award } = usePoints();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    type: 'observation',
    tags: [],
    favorite: false
  });

  // Load entries
  useEffect(() => {
    const saved = localStorage.getItem('wla-journal-entries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEntries(Array.isArray(parsed) ? parsed : []);
      } catch {
        setEntries([]);
      }
    }
  }, []);

  // Save entries
  const saveEntries = (updated: JournalEntry[]) => {
    setEntries(updated);
    localStorage.setItem('wla-journal-entries', JSON.stringify(updated));
  };

  const addEntry = () => {
    if (!newEntry.title || !newEntry.content) {
      alert('Please add a title and content');
      return;
    }

    const entry: JournalEntry = {
      id: editingId || `entry-${Date.now()}`,
      timestamp: editingId ? entries.find(e => e.id === editingId)?.timestamp || Date.now() : Date.now(),
      type: newEntry.type || 'observation',
      title: newEntry.title,
      content: newEntry.content,
      photo: newEntry.photo,
      location: newEntry.location,
      weather: newEntry.weather,
      tags: newEntry.tags || [],
      favorite: newEntry.favorite || false
    };

    if (editingId) {
      saveEntries(entries.map(e => e.id === editingId ? entry : e));
    } else {
      saveEntries([...entries, entry]);
      award(5, 'Journal Entry');
    }

    // Reset form
    setNewEntry({ type: 'observation', tags: [], favorite: false });
    setShowForm(false);
    setEditingId(null);
  };

  const editEntry = (entry: JournalEntry) => {
    setNewEntry(entry);
    setEditingId(entry.id);
    setShowForm(true);
  };

  const deleteEntry = (id: string) => {
    if (confirm('Delete this entry?')) {
      saveEntries(entries.filter(e => e.id !== id));
    }
  };

  const toggleFavorite = (id: string) => {
    saveEntries(entries.map(e => 
      e.id === id ? { ...e, favorite: !e.favorite } : e
    ));
  };

  const onPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewEntry({ ...newEntry, photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setNewEntry({
          ...newEntry,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
      }, (error) => {
        alert('Unable to get location');
      });
    }
  };

  const toggleTag = (tag: string) => {
    const currentTags = newEntry.tags || [];
    if (currentTags.includes(tag)) {
      setNewEntry({ ...newEntry, tags: currentTags.filter(t => t !== tag) });
    } else {
      setNewEntry({ ...newEntry, tags: [...currentTags, tag] });
    }
  };

  const exportToText = () => {
    const text = entries
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(entry => {
        let text = `# ${entry.title}\n\n`;
        text += `**Date:** ${new Date(entry.timestamp).toLocaleString()}\n`;
        text += `**Type:** ${entry.type}\n`;
        if (entry.weather) text += `**Weather:** ${entry.weather}\n`;
        if (entry.tags.length) text += `**Tags:** ${entry.tags.join(', ')}\n`;
        text += `\n${entry.content}\n\n`;
        text += '---\n\n';
        return text;
      })
      .join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wla-journal-${Date.now()}.txt`;
    a.click();
  };

  // Filter entries
  const filteredEntries = entries
    .filter(e => filterType === 'all' || e.type === filterType)
    .filter(e => filterType === 'favorites' ? e.favorite : true)
    .filter(e => 
      searchQuery === '' ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => b.timestamp - a.timestamp);

  const TYPE_COLORS = {
    observation: 'linear-gradient(135deg, #06D6A0, #059669)',
    reflection: 'linear-gradient(135deg, #9D4EDD, #7209B7)',
    data: 'linear-gradient(135deg, #0077B6, #023047)',
    photo: 'linear-gradient(135deg, #FFB703, #FB8500)'
  };

  const TYPE_ICONS = {
    observation: '👁️',
    reflection: '💭',
    data: '📊',
    photo: '📸'
  };

  return (
    <div>
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #FFB703, #FB8500)',
        color: 'white',
        padding: '3rem 1.5rem',
        marginBottom: '2rem',
        borderRadius: '16px'
      }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
          📖 Field Journal
        </h1>
        <p style={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto', opacity: 0.95 }}>
          Document your field observations, reflections, and data. Build your naturalist portfolio!
        </p>
      </section>

      {/* Stats */}
      <div className="row" style={{ marginBottom: '2rem' }}>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #06D6A0, #059669)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{entries.length}</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Total Entries</p>
        </div>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #FFB703, #FB8500)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>
            {entries.filter(e => e.photo).length}
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Photos</p>
        </div>
        <div className="card section" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #9D4EDD, #7209B7)', color: 'white' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>
            {entries.filter(e => e.favorite).length}
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Favorites</p>
        </div>
      </div>

      {/* Controls */}
      <div className="card section" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setEditingId(null);
                setNewEntry({ type: 'observation', tags: [], favorite: false });
              }
            }}
            className="btn-success"
            style={{ fontSize: '1.1rem' }}
          >
            {showForm ? '❌ Cancel' : '➕ New Entry'}
          </button>
          
          <input
            type="text"
            placeholder="🔍 Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '250px',
              padding: '0.75rem 1rem',
              borderRadius: '999px',
              border: '2px solid #E5E7EB',
              fontSize: '1rem'
            }}
          />
          
          <button 
            onClick={exportToText}
            className="btn-outline"
            disabled={entries.length === 0}
          >
            📥 Export All
          </button>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterType('all')}
            style={{
              padding: '0.5rem 1rem',
              background: filterType === 'all' ? 'linear-gradient(135deg, #0077B6, #023047)' : '#F8F9FA',
              color: filterType === 'all' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '999px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('favorites')}
            style={{
              padding: '0.5rem 1rem',
              background: filterType === 'favorites' ? 'linear-gradient(135deg, #FFD60A, #FFC300)' : '#F8F9FA',
              color: filterType === 'favorites' ? '#023047' : '#374151',
              border: 'none',
              borderRadius: '999px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            ⭐ Favorites
          </button>
          {Object.keys(TYPE_ICONS).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '0.5rem 1rem',
                background: filterType === type ? TYPE_COLORS[type as keyof typeof TYPE_COLORS] : '#F8F9FA',
                color: filterType === type ? 'white' : '#374151',
                border: 'none',
                borderRadius: '999px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              {TYPE_ICONS[type as keyof typeof TYPE_ICONS]} {type}
            </button>
          ))}
        </div>
      </div>

      {/* Entry Form */}
      {showForm && (
        <div className="card section animate-slide-up" style={{ marginBottom: '2rem' }}>
          <h2>{editingId ? 'Edit Entry' : 'New Entry'}</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
              Entry Type:
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {Object.keys(TYPE_ICONS).map(type => (
                <button
                  key={type}
                  onClick={() => setNewEntry({ ...newEntry, type: type as JournalEntry['type'] })}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: newEntry.type === type ? TYPE_COLORS[type as keyof typeof TYPE_COLORS] : 'white',
                    color: newEntry.type === type ? 'white' : '#374151',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {TYPE_ICONS[type as keyof typeof TYPE_ICONS]} {type}
                </button>
              ))}
            </div>
          </div>

          <label style={{ display: 'block', marginBottom: '1.5rem' }}>
            <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Title:</span>
            <input
              type="text"
              value={newEntry.title || ''}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              placeholder="e.g., Brook Trout Spawning Observation"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '2px solid #E5E7EB',
                fontSize: '1rem'
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '1.5rem' }}>
            <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Content:</span>
            <textarea
              value={newEntry.content || ''}
              onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              placeholder="Describe what you observed, measured, or reflected on..."
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '2px solid #E5E7EB',
                fontSize: '1rem',
                minHeight: '150px',
                fontFamily: 'inherit',
                lineHeight: 1.6
              }}
            />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                Weather:
              </label>
              <select
                value={newEntry.weather || ''}
                onChange={(e) => setNewEntry({ ...newEntry, weather: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '2px solid #E5E7EB',
                  fontSize: '0.95rem'
                }}
              >
                <option value="">Select weather</option>
                {WEATHER_OPTIONS.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                Photo:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={onPhotoUpload}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '2px solid #E5E7EB',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                Location:
              </label>
              <button
                onClick={getCurrentLocation}
                className="btn-outline"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                {newEntry.location ? '✓ GPS Saved' : '📍 Get GPS'}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <NatureSoundRecorder />
          </div>

          {newEntry.photo && (
            <div style={{ marginBottom: '1.5rem', maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden', position: 'relative', minHeight: '200px' }}>
              <Image
                src={newEntry.photo}
                alt="Preview"
                fill
                unoptimized
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
              Tags:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {SUGGESTED_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: (newEntry.tags || []).includes(tag) ? '#0077B6' : '#F8F9FA',
                    color: (newEntry.tags || []).includes(tag) ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={addEntry}
            className="btn-success"
            style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
          >
            {editingId ? '💾 Save Changes' : '➕ Add Entry'}
          </button>
        </div>
      )}

      {/* Entries List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {filteredEntries.map(entry => (
          <div
            key={entry.id}
            className="card section animate-slide-up"
            style={{
              borderLeft: `4px solid`,
              borderLeftColor: TYPE_COLORS[entry.type].match(/#[\w]+/)?.[0] || '#0077B6'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div style={{
                padding: '0.5rem 1rem',
                background: TYPE_COLORS[entry.type],
                color: 'white',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 700
              }}>
                {TYPE_ICONS[entry.type]} {entry.type}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => toggleFavorite(entry.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.5rem'
                  }}
                >
                  {entry.favorite ? '⭐' : '☆'}
                </button>
                <button
                  onClick={() => editEntry(entry)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: '#0077B6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: '#DC2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>

            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{entry.title}</h3>
            
            <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1rem' }}>
              📅 {new Date(entry.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
              {entry.weather && ` • ${entry.weather}`}
            </div>

            {entry.photo && (
              <div style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden', position: 'relative', minHeight: '200px' }}>
                <Image
                  src={entry.photo}
                  alt={entry.title}
                  fill
                  unoptimized
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}

            <p style={{ 
              margin: '0 0 1rem 0', 
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap'
            }}>
              {entry.content}
            </p>

            {entry.location && (
              <div style={{
                fontSize: '0.85rem',
                color: '#6B7280',
                marginBottom: '0.5rem'
              }}>
                📍 {entry.location.lat.toFixed(4)}, {entry.location.lng.toFixed(4)}
              </div>
            )}

            {entry.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {entry.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: '#F8F9FA',
                      color: '#374151',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          color: '#6B7280' 
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>📖</div>
          <h3 style={{ color: '#374151' }}>No entries yet</h3>
          <p>Start documenting your field observations and build your naturalist portfolio!</p>
          <button 
            onClick={() => setShowForm(true)}
            className="btn-success"
            style={{ marginTop: '1rem' }}
          >
            ➕ Create First Entry
          </button>
        </div>
      )}

      {/* Tips Section */}
      <section className="section" style={{ background: '#F8F9FA', borderRadius: '16px', padding: '2rem', marginTop: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>📝 Journal Tips</h2>
        <div className="row">
          <div className="card section" style={{ flex: 1 }}>
            <h3>🔬 Observations</h3>
            <p>Record what you see, hear, smell. Be specific about behavior, location, time, and conditions.</p>
          </div>
          <div className="card section" style={{ flex: 1 }}>
            <h3>💭 Reflections</h3>
            <p>Connect observations to what you&apos;ve learned. Ask questions. Form hypotheses about patterns.</p>
          </div>
          <div className="card section" style={{ flex: 1 }}>
            <h3>📊 Data</h3>
            <p>Record measurements, counts, and environmental parameters. Include units and methods used.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
