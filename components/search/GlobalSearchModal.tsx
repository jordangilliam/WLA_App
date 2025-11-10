'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SearchResult {
  title: string;
  description: string;
  category: string;
  path: string;
  icon: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // All searchable content
  const allContent: SearchResult[] = [
    // Educational Modules
    { title: 'Birds', description: 'Pennsylvania bird species and conservation', category: 'Learning', path: '/birds', icon: '🦜' },
    { title: 'Fishing', description: 'Fishing techniques and aquatic ecosystems', category: 'Learning', path: '/fishing', icon: '🎣' },
    { title: 'Gobblers', description: 'Wild turkey biology and habitat', category: 'Learning', path: '/gobblers', icon: '🦃' },
    { title: 'Terrestrials', description: 'Land mammals and wildlife management', category: 'Learning', path: '/terrestrials', icon: '🦌' },
    
    // Identification Keys
    { title: 'Macroinvertebrates', description: 'Stream health indicators and ID guide', category: 'ID Keys', path: '/keys/macro', icon: '🔬' },
    { title: 'Plants', description: 'Native plant identification guide', category: 'ID Keys', path: '/keys/plants', icon: '🌿' },
    { title: 'Bugs', description: 'Common insect identification', category: 'ID Keys', path: '/keys/bugs', icon: '🐛' },
    { title: 'Insects', description: 'Detailed insect taxonomy', category: 'ID Keys', path: '/keys/insects', icon: '🦋' },
    
    // Field Work
    { title: 'Explore Sites', description: '140+ field sites across Pennsylvania', category: 'Field Work', path: '/explore', icon: '🗺️' },
    { title: 'Journal', description: 'Your field observations and check-ins', category: 'Field Work', path: '/journal-new', icon: '📝' },
    { title: 'Stocking Calendar', description: 'Trout stocking schedules', category: 'Field Work', path: '/stocking', icon: '🎣' },
    { title: 'Achievements', description: 'Your progress and unlocked badges', category: 'Field Work', path: '/achievements', icon: '🏆' },
    
    // Additional Resources
    { title: 'Habitat', description: 'Wildlife habitat management', category: 'Resources', path: '/habitat', icon: '🏕️' },
    { title: 'Outreach', description: 'Conservation outreach programs', category: 'Resources', path: '/outreach', icon: '📢' },
    { title: 'Media', description: 'Educational videos and photos', category: 'Resources', path: '/media', icon: '🎥' },
    { title: 'Offline Mode', description: 'Download content for offline use', category: 'Tools', path: '/offline', icon: '📱' },
  ];

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Search logic
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = allContent.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );

    setResults(filtered.slice(0, 8)); // Limit to 8 results
  }, [query]);

  const handleResultClick = (path: string) => {
    router.push(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50 px-4">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔍</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search educational content, field sites, tools..."
                className="flex-1 text-lg outline-none"
              />
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {query.trim().length < 2 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">💡</div>
                <p>Start typing to search...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">🤔</div>
                <p>No results found for &quot;{query}&quot;</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {results.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleResultClick(result.path)}
                    className="w-full p-4 hover:bg-green-50 transition-colors text-left flex items-center gap-4"
                  >
                    <span className="text-3xl">{result.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{result.title}</div>
                      <div className="text-sm text-gray-600">{result.description}</div>
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      {result.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Popular Shortcuts */}
          {query.trim().length === 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">
                Popular
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleResultClick('/explore')}
                  className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-green-100 transition-colors"
                >
                  🗺️ Explore Sites
                </button>
                <button
                  onClick={() => handleResultClick('/stocking')}
                  className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-blue-100 transition-colors"
                >
                  🎣 Stocking
                </button>
                <button
                  onClick={() => handleResultClick('/achievements')}
                  className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-purple-100 transition-colors"
                >
                  🏆 Achievements
                </button>
                <button
                  onClick={() => handleResultClick('/birds')}
                  className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-yellow-100 transition-colors"
                >
                  🦜 Birds
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

