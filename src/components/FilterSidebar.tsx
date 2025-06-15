'use client';

import { useState } from 'react';

interface FilterSidebarProps {
  onFiltersChange: (filters: MovieFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export interface MovieFilters {
  genres: string[];
  yearRange: [number, number];
  minRating: number;
  maxRuntime: number;
  streamingPlatforms: string[];
}

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 
  'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance', 
  'Sci-Fi', 'Thriller', 'War', 'Western'
];

const STREAMING_PLATFORMS = [
  'Netflix', 'Amazon Prime', 'Disney+', 'HBO Max', 'Hulu', 
  'Paramount+', 'Apple TV+', 'Peacock'
];

export default function FilterSidebar({ onFiltersChange, isOpen, onToggle }: FilterSidebarProps) {
  const [filters, setFilters] = useState<MovieFilters>({
    genres: [],
    yearRange: [1990, 2024],
    minRating: 0,
    maxRuntime: 300,
    streamingPlatforms: [],
  });

  const updateFilters = (newFilters: Partial<MovieFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const toggleGenre = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre];
    updateFilters({ genres: newGenres });
  };

  const togglePlatform = (platform: string) => {
    const newPlatforms = filters.streamingPlatforms.includes(platform)
      ? filters.streamingPlatforms.filter(p => p !== platform)
      : [...filters.streamingPlatforms, platform];
    updateFilters({ streamingPlatforms: newPlatforms });
  };

  const clearFilters = () => {
    const clearedFilters: MovieFilters = {
      genres: [],
      yearRange: [1990, 2024],
      minRating: 0,
      maxRuntime: 300,
      streamingPlatforms: [],
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-auto
        w-80 bg-white shadow-lg z-50 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <div className="flex gap-2">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
              <button
                onClick={onToggle}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Genres */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Genres</h3>
            <div className="grid grid-cols-2 gap-2">
              {GENRES.map((genre) => (
                <label key={genre} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.genres.includes(genre)}
                    onChange={() => toggleGenre(genre)}
                    className="mr-2 rounded"
                  />
                  <span className="text-sm text-gray-700">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Year Range */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Year Range</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1900"
                  max="2024"
                  value={filters.yearRange[0]}
                  onChange={(e) => updateFilters({ 
                    yearRange: [parseInt(e.target.value), filters.yearRange[1]] 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="From"
                />
                <input
                  type="number"
                  min="1900"
                  max="2024"
                  value={filters.yearRange[1]}
                  onChange={(e) => updateFilters({ 
                    yearRange: [filters.yearRange[0], parseInt(e.target.value)] 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="To"
                />
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Minimum Rating: {filters.minRating.toFixed(1)}
            </h3>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={filters.minRating}
              onChange={(e) => updateFilters({ minRating: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.0</span>
              <span>10.0</span>
            </div>
          </div>

          {/* Runtime */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Max Runtime: {filters.maxRuntime} min
            </h3>
            <input
              type="range"
              min="60"
              max="300"
              step="10"
              value={filters.maxRuntime}
              onChange={(e) => updateFilters({ maxRuntime: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1h</span>
              <span>5h</span>
            </div>
          </div>

          {/* Streaming Platforms */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Available On</h3>
            <div className="space-y-2">
              {STREAMING_PLATFORMS.map((platform) => (
                <label key={platform} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.streamingPlatforms.includes(platform)}
                    onChange={() => togglePlatform(platform)}
                    className="mr-2 rounded"
                  />
                  <span className="text-sm text-gray-700">{platform}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
