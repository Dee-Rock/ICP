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
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      {/* Main Search Bar */}
      <form onSubmit={handleSubmit} className="relative mb-4">
        <div className="relative">
          <span className="absolute left-3 sm:left-6 top-1/2 transform -translate-y-1/2 text-purple-400 text-lg sm:text-xl">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies with AI... (e.g., 'Avengers', 'Tom Hanks')"
            className="w-full pl-10 sm:pl-16 pr-2 sm:pr-4 py-3 sm:py-5 text-sm sm:text-lg text-white bg-gray-800/50 backdrop-blur-lg border-2 border-gray-600 rounded-xl sm:rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300 placeholder-gray-400 shadow-2xl"
            disabled={loading}
          />
        </div>

        {/* Mobile Action Buttons - Below search bar */}
        <div className="flex flex-col sm:hidden gap-2 mt-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowMoods(!showMoods)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 rounded-xl hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2 border border-yellow-500/30 backdrop-blur-sm shadow-lg"
              disabled={loading}
            >
              <span className="text-lg">✨</span>
              <span className="font-semibold">Mood Search</span>
            </button>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-purple-500/25"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Searching...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>🚀</span>
                  <span>AI Search</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Action Buttons - Inside search bar */}
        <div className="hidden sm:flex absolute right-2 top-1/2 transform -translate-y-1/2 gap-2">
          <button
            type="button"
            onClick={() => setShowMoods(!showMoods)}
            className="px-4 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 rounded-xl hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-300 flex items-center gap-2 border border-yellow-500/30 backdrop-blur-sm shadow-lg"
            disabled={loading}
          >
            <span className="text-lg">✨</span>
            <span className="font-semibold">Mood</span>
          </button>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 lg:px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden lg:inline">AI Searching...</span>
                <span className="lg:hidden">Searching...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>🚀</span>
                <span className="hidden lg:inline">AI Search</span>
                <span className="lg:hidden">Search</span>
              </div>
            )}
          </button>
        </div>
      </form>

      {/* Mood Presets */}
      {showMoods && (
        <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl border border-gray-700 p-4 sm:p-6 mb-4 mx-2 sm:mx-0">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🎭</span>
            <span>What&apos;s your mood?</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            {moodPresets.map((preset) => (
              <button
                key={preset.mood}
                onClick={() => handleMoodClick(preset.query)}
                className="flex flex-col items-center p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-gray-600 hover:border-purple-400 hover:bg-purple-500/20 transition-all duration-300 group backdrop-blur-sm active:scale-95"
                disabled={loading}
              >
                <span className="text-2xl sm:text-3xl mb-1 sm:mb-2 group-hover:scale-125 transition-transform duration-300">
                  {preset.icon}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-gray-300 group-hover:text-purple-300 transition-colors text-center">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Suggestions */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center px-2 sm:px-0">
        <span className="text-xs sm:text-sm text-gray-400 font-medium w-full sm:w-auto text-center sm:text-left mb-2 sm:mb-0">⚡ Quick Search:</span>
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            'Avengers',
            'Tom Hanks',
            'horror 2025',
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
              className="text-xs sm:text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 px-2 sm:px-3 py-1 rounded-full border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm active:scale-95"
              disabled={loading}
            >
              &quot;{suggestion}&quot;
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
