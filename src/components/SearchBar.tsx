'use client';

import { useState } from 'react';
// Using emoji icons instead of lucide-react for compatibility

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

const moodPresets = [
  { mood: 'happy', label: 'Happy', icon: '😊', query: 'uplifting comedy feel-good movies' },
  { mood: 'romantic', label: 'Romantic', icon: '💕', query: 'romantic love story movies' },
  { mood: 'adventurous', label: 'Adventure', icon: '🗺️', query: 'action adventure thrilling movies' },
  { mood: 'nostalgic', label: 'Nostalgic', icon: '🌅', query: 'classic nostalgic heartwarming movies' },
  { mood: 'mysterious', label: 'Mystery', icon: '🔍', query: 'mystery thriller suspenseful movies' },
  { mood: 'cozy', label: 'Cozy', icon: '🏠', query: 'cozy comfort family friendly movies' },
];

export default function SearchBar({ onSearch, loading = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showMoods, setShowMoods] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleMoodClick = (moodQuery: string) => {
    setQuery(moodQuery);
    onSearch(moodQuery);
    setShowMoods(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <form onSubmit={handleSubmit} className="relative mb-4">
        <div className="relative">
          <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-purple-400 text-xl">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search millions of real movies with AI... (e.g., 'Avengers', 'Tom Hanks', 'horror 2023', 'romantic comedy')"
            className="w-full pl-16 pr-40 py-5 text-lg text-white bg-gray-800/50 backdrop-blur-lg border-2 border-gray-600 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300 placeholder-gray-400 shadow-2xl"
            disabled={loading}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
            <button
              type="button"
              onClick={() => setShowMoods(!showMoods)}
              className="px-4 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 rounded-xl hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-300 flex items-center gap-2 border border-yellow-500/30 backdrop-blur-sm shadow-lg"
              disabled={loading}
            >
              <span className="text-lg">✨</span>
              <span className="hidden sm:inline font-semibold">Mood</span>
            </button>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>AI Searching...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>🚀</span>
                  <span>AI Search</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Mood Presets */}
      {showMoods && (
        <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-6 mb-4">
          <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
            <span className="text-2xl">🎭</span>
            <span>What&apos;s your mood?</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {moodPresets.map((preset) => (
              <button
                key={preset.mood}
                onClick={() => handleMoodClick(preset.query)}
                className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-600 hover:border-purple-400 hover:bg-purple-500/20 transition-all duration-300 group backdrop-blur-sm"
                disabled={loading}
              >
                <span className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">
                  {preset.icon}
                </span>
                <span className="text-sm font-semibold text-gray-300 group-hover:text-purple-300 transition-colors">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}



      {/* Search Suggestions */}
      <div className="flex flex-wrap gap-3 justify-center items-center">
        <span className="text-sm text-gray-400 font-medium">⚡ Quick Search:</span>
        {[
          'Avengers',
          'Tom Hanks',
          'horror 2023',
          'Batman',
          'Disney',
          'comedy',
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setQuery(suggestion);
              onSearch(suggestion);
            }}
            className="text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm"
            disabled={loading}
          >
            &quot;{suggestion}&quot;
          </button>
        ))}
      </div>
    </div>
  );
}
