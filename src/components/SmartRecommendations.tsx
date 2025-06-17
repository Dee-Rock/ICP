'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/lib/mongodb';
import MovieCard from './MovieCard';

interface SmartRecommendation {
  movie: Movie;
  similarity: number;
  reasons: string[];
  aiConfidence: number;
  recommendationType: 'genre-based' | 'plot-similarity' | 'mood-match' | 'ai-curated';
}

interface SmartRecommendationsProps {
  movie: Movie;
  onMovieClick: (movie: Movie) => void;
}

export default function SmartRecommendations({ movie, onMovieClick }: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    if (movie) {
      loadRecommendations();
    }
  }, [movie]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/smart-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId: movie._id,
          movieTitle: movie.title,
          genres: movie.genres || [],
          plot: movie.plot || '',
          userPreferences: {
            favoriteGenres: ['Action', 'Sci-Fi'], // Could be from user profile
            watchHistory: [],
            ratings: {}
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecommendations = recommendations.filter(rec => 
    activeFilter === 'all' || rec.recommendationType === activeFilter
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'genre-based': return '🎭';
      case 'plot-similarity': return '📖';
      case 'mood-match': return '🎭';
      case 'ai-curated': return '🤖';
      default: return '🎬';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'genre-based': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'plot-similarity': return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'mood-match': return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      case 'ai-curated': return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  if (!movie) return null;

  return (
    <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border-2 border-purple-500/30 mb-6 sm:mb-8 mx-2 sm:mx-0">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-700">
        <span className="text-3xl sm:text-4xl">🎯</span>
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Smart AI Recommendations</h2>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">
            Based on "{movie.title}"
          </p>
          <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">
            Powered by Advanced AI Analysis
          </p>
        </div>
      </div>

      {/* AI Processing Indicator */}
      {loading && (
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="text-white font-semibold text-sm sm:text-base">AI is analyzing movie patterns...</p>
              <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">Processing semantic similarities, genre patterns, and mood analysis</p>
              <p className="text-gray-400 text-xs sm:hidden">Processing AI analysis...</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      {!loading && recommendations.length > 0 && (
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
              activeFilter === 'all'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-700/50 text-gray-300 hover:bg-purple-600/30 hover:text-purple-300'
            }`}
          >
            🎬 <span className="hidden sm:inline">All </span>({recommendations.length})
          </button>
          {['genre-based', 'plot-similarity', 'mood-match', 'ai-curated'].map((type) => {
            const count = recommendations.filter(r => r.recommendationType === type).length;
            if (count === 0) return null;
            
            return (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeFilter === type
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-purple-600/30 hover:text-purple-300'
                }`}
              >
                {getTypeIcon(type)} <span className="hidden sm:inline">{type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} </span>({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Recommendations Grid */}
      {!loading && filteredRecommendations.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {filteredRecommendations.map((recommendation, index) => (
            <div key={recommendation.movie._id} className="group">
              {/* Recommendation Header */}
              <div className={`bg-gradient-to-r ${getTypeColor(recommendation.recommendationType)} rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border backdrop-blur-sm`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <span className="text-xl sm:text-2xl">{getTypeIcon(recommendation.recommendationType)}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-bold text-base sm:text-lg truncate">{recommendation.movie.title}</h3>
                      <p className="text-gray-300 text-xs sm:text-sm">
                        <span className="hidden sm:inline">{recommendation.recommendationType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Recommendation</span>
                        <span className="sm:hidden">{recommendation.recommendationType.replace('-', ' ')}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-sm sm:text-lg">
                      {Math.round(recommendation.similarity * 100)}%
                    </div>
                    <div className="text-gray-300 text-xs sm:text-sm">
                      <span className="hidden sm:inline">AI Confidence: </span>{Math.round(recommendation.aiConfidence * 100)}%
                    </div>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/10">
                  <p className="text-gray-300 text-xs sm:text-sm font-medium mb-2">🧠 <span className="hidden sm:inline">AI Analysis:</span><span className="sm:hidden">Analysis:</span></p>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {recommendation.reasons.slice(0, 3).map((reason, idx) => (
                      <span
                        key={idx}
                        className="px-2 sm:px-3 py-1 bg-white/10 text-gray-200 text-xs rounded-full border border-white/20"
                      >
                        {reason}
                      </span>
                    ))}
                    {recommendation.reasons.length > 3 && (
                      <span className="px-2 sm:px-3 py-1 bg-white/10 text-gray-200 text-xs rounded-full border border-white/20">
                        +{recommendation.reasons.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Movie Card */}
              <div className="ml-2 sm:ml-4 transform group-hover:scale-[1.02] transition-transform duration-300">
                <MovieCard
                  movie={recommendation.movie}
                  onMovieClick={onMovieClick}
                />
              </div>
            </div>
          ))}
        </div>
      ) : !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-white mb-2">No recommendations available</h3>
          <p className="text-gray-400">
            {recommendations.length === 0 
              ? "AI couldn't find similar movies at this time."
              : "No movies match the selected filter."
            }
          </p>
        </div>
      )}

      {/* AI Insights Footer */}
      {!loading && recommendations.length > 0 && (
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-3 sm:p-4 border border-blue-500/30">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <span className="text-xl sm:text-2xl">🧠</span>
              <h4 className="text-white font-bold text-sm sm:text-base">AI Recommendation Engine</h4>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm">
              <span className="hidden sm:inline">These recommendations are generated using advanced machine learning algorithms that analyze
              plot semantics, genre patterns, user preferences, and cultural impact factors.
              The AI considers over 50 different movie attributes to find the perfect matches.</span>
              <span className="sm:hidden">Advanced AI algorithms analyze plot, genres, and preferences to find perfect movie matches.</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
