'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  title: string;
  path: string;
  type: 'page' | 'lesson' | 'species' | 'location';
  description?: string;
  emoji?: string;
}

const SEARCH_INDEX: SearchResult[] = [
  // Pages
  { title: 'Learn', path: '/learn', type: 'page', emoji: '📚', description: 'Educational lessons and tracks' },
  { title: 'Map', path: '/map', type: 'page', emoji: '🗺️', description: 'Pennsylvania conservation sites' },
  { title: 'Fishing Guide', path: '/fishing', type: 'page', emoji: '🎣', description: 'PA fish species and fishing spots' },
  { title: 'Gobblers', path: '/gobblers', type: 'page', emoji: '🦃', description: 'Wild turkey tracking' },
  { title: 'Terrestrials', path: '/terrestrials', type: 'page', emoji: '🦌', description: 'Deer, bear, and mammals' },
  { title: 'Habitat Simulator', path: '/habitat', type: 'page', emoji: '🏕️', description: 'Water quality and habitat modeling' },
  { title: 'Field Journal', path: '/journal', type: 'page', emoji: '📸', description: 'Document your observations' },
  { title: 'Macroinvertebrates', path: '/keys/macro', type: 'page', emoji: '🔬', description: 'Aquatic insect identification' },
  { title: 'Plants', path: '/keys/plants', type: 'page', emoji: '🌿', description: 'Plant identification key' },
  { title: 'Insects', path: '/keys/insects', type: 'page', emoji: '🐛', description: 'Insect dichotomous key' },
  { title: 'Birds', path: '/birds', type: 'page', emoji: '🦜', description: 'Bird identification and tracking' },
  
  // Lessons
  { title: 'Brook Trout - Macroinvertebrates', path: '/learn/macroinvertebrates-as-bioindicators', type: 'lesson', emoji: '🐟', description: 'Stream health indicators' },
  { title: 'Water Quality Monitoring', path: '/learn/water-quality-monitoring', type: 'lesson', emoji: '💧', description: 'Testing pH, temp, and more' },
  { title: 'Stream Ecology', path: '/learn/stream-ecology-watershed-systems', type: 'lesson', emoji: '🌊', description: 'Watershed systems thinking' },
  { title: 'Angling Ethics', path: '/learn/angling-ethics-conservation-stewardship', type: 'lesson', emoji: '🎣', description: 'Catch and release practices' },
  
  // Species
  { title: 'Brook Trout', path: '/fishing', type: 'species', emoji: '🐟', description: "PA's only native trout" },
  { title: 'White-tailed Deer', path: '/terrestrials', type: 'species', emoji: '🦌', description: 'Track deer populations' },
  { title: 'Wild Turkey', path: '/gobblers', type: 'species', emoji: '🦃', description: 'Gobbler ecology' },
];

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter results
  useEffect(() => {
    if (query.trim()) {
      const filtered = SEARCH_INDEX.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    router.push(result.path);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  return (
    <div ref={searchRef} style={{ position: 'relative' }}>
      {/* Search Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        style={{
          padding: '0.5rem 1rem',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '8px',
          color: '#1F2937',
          backdropFilter: 'blur(4px)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: 500,
          transition: 'all 0.2s',
          minWidth: '200px',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        🔍 Search... <kbd style={{ fontSize: '0.75rem', opacity: 0.6 }}>⌘K</kbd>
      </button>

      {/* Search Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '0.5rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: '2px solid #E5E7EB',
            zIndex: 10000,
            minWidth: '320px',
            maxWidth: '400px',
          }}
        >
          {/* Search Input */}
          <div style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB' }}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search lessons, species, pages..."
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                outline: 'none',
              }}
              autoFocus
            />
          </div>

          {/* Results */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {results.length > 0 ? (
              results.map((result, index) => (
                <button
                  key={result.path}
                  onClick={() => handleSelect(result)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    border: 'none',
                    background: index === selectedIndex ? '#F3F4F6' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span style={{ fontSize: '1.5rem' }}>{result.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#1F2937', marginBottom: '0.25rem' }}>
                      {result.title}
                    </div>
                    {result.description && (
                      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        {result.description}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase' }}>
                    {result.type}
                  </span>
                </button>
              ))
            ) : query.trim() ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
                No results found for "{query}"
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                <div>Start typing to search...</div>
                <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Lessons • Species • Pages • Locations
                </div>
              </div>
            )}
          </div>

          {/* Footer Hint */}
          {results.length > 0 && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderTop: '1px solid #E5E7EB',
                fontSize: '0.75rem',
                color: '#9CA3AF',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

