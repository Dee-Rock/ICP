'use client';

import { useState } from 'react';
import { Movie } from '@/lib/mongodb';

interface ComparisonResult {
  overallSimilarity: number;
  categories: {
    genre: {
      similarity: number;
      analysis: string;
      commonGenres: string[];
      uniqueToMovie1: string[];
      uniqueToMovie2: string[];
    };
    plot: {
      similarity: number;
      analysis: string;
      commonThemes: string[];
      narrativeStyle: string;
    };
    technical: {
      similarity: number;
      analysis: string;
      ratingComparison: string;
      runtimeComparison: string;
      eraComparison: string;
    };
    aiInsights: {
      recommendation: string;
      whichToWatchFirst: string;
      targetAudience: string;
      moodComparison: string;
      culturalImpact: string;
    };
  };
  recommendation: {
    winner: 'movie1' | 'movie2' | 'tie';
    reasoning: string;
    confidence: number;
  };
}

interface MovieComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  movie1?: Movie;
  movie2?: Movie;
  onMovieSelect: (slot: 1 | 2, movie: Movie) => void;
  availableMovies: Movie[];
}

export default function MovieComparison({
  isOpen,
  onClose,
  movie1,
  movie2,
  onMovieSelect,
  availableMovies
}: MovieComparisonProps) {
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMovieSelector, setShowMovieSelector] = useState<1 | 2 | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCompare = async () => {
    if (!movie1 || !movie2) return;

    setLoading(true);
    try {
      const response = await fetch('/api/movie-comparison', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movie1: {
            id: movie1._id,
            title: movie1.title,
            year: movie1.year,
            genres: movie1.genres || [],
            plot: movie1.plot || '',
            rating: movie1.imdb?.rating,
            runtime: movie1.runtime,
            director: movie1.directors?.[0],
            cast: movie1.cast || []
          },
          movie2: {
            id: movie2._id,
            title: movie2.title,
            year: movie2.year,
            genres: movie2.genres || [],
            plot: movie2.plot || '',
            rating: movie2.imdb?.rating,
            runtime: movie2.runtime,
            director: movie2.directors?.[0],
            cast: movie2.cast || []
          },
          comparisonType: 'detailed'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComparison(data.comparison);
      }
    } catch (error) {
      console.error('Failed to compare movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = availableMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genres?.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleMovieSelect = (movie: Movie) => {
    if (showMovieSelector) {
      onMovieSelect(showMovieSelector, movie);
      setShowMovieSelector(null);
      setSearchQuery('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-700 w-full max-w-6xl h-[95vh] sm:h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-4 sm:p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-2xl sm:text-3xl">⚔️</span>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-white">AI Movie Comparison</h2>
                <p className="text-gray-300 text-sm sm:text-base hidden sm:block">Advanced AI-powered movie analysis and comparison</p>
                <p className="text-gray-300 text-xs sm:hidden">AI comparison tool</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl sm:text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-6 h-full overflow-y-auto">
          {/* Movie Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Movie 1 Slot */}
            <div
              className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 cursor-pointer hover:border-purple-500 transition-all duration-300"
              onClick={() => setShowMovieSelector(1)}
            >
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span>🎬</span>
                <span>Movie 1</span>
                <span className="text-xs sm:text-sm text-gray-400 ml-auto hidden sm:inline">Click to select</span>
              </h3>
              {movie1 ? (
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-16 sm:w-16 sm:h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-lg sm:text-2xl">🎬</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm sm:text-base truncate">{movie1.title}</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">{movie1.year}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">⭐ {movie1.imdb?.rating || 'N/A'}</p>
                    <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
                      {movie1.genres?.slice(0, 2).map(genre => (
                        <span key={genre} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMovieSelect(1, undefined as any);
                    }}
                    className="text-red-400 hover:text-red-300 text-lg sm:text-xl"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="text-3xl sm:text-4xl mb-2">🎬</div>
                  <p className="text-gray-400 text-sm sm:text-base">Click to select a movie</p>
                  <p className="text-purple-400 text-xs sm:text-sm mt-1 sm:hidden">Tap to choose</p>
                  <p className="text-purple-400 text-sm mt-1 hidden sm:block">Choose from available movies</p>
                </div>
              )}
            </div>

            {/* Movie 2 Slot */}
            <div
              className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 cursor-pointer hover:border-purple-500 transition-all duration-300"
              onClick={() => setShowMovieSelector(2)}
            >
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span>🎭</span>
                <span>Movie 2</span>
                <span className="text-xs sm:text-sm text-gray-400 ml-auto hidden sm:inline">Click to select</span>
              </h3>
              {movie2 ? (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎭</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold">{movie2.title}</h4>
                    <p className="text-gray-400 text-sm">{movie2.year}</p>
                    <p className="text-gray-400 text-sm">⭐ {movie2.imdb?.rating || 'N/A'}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {movie2.genres?.slice(0, 2).map(genre => (
                        <span key={genre} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMovieSelect(2, undefined as any);
                    }}
                    className="text-red-400 hover:text-red-300 text-xl"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🎭</div>
                  <p className="text-gray-400">Click to select a movie</p>
                  <p className="text-purple-400 text-sm mt-1">Choose from available movies</p>
                </div>
              )}
            </div>
          </div>

          {/* Compare Button */}
          {movie1 && movie2 && (
            <div className="text-center mb-6 sm:mb-8">
              <button
                onClick={handleCompare}
                disabled={loading}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 flex items-center gap-2 sm:gap-3 mx-auto text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">AI is analyzing...</span>
                    <span className="sm:hidden">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg sm:text-xl">🧠</span>
                    <span className="hidden sm:inline">Compare with AI</span>
                    <span className="sm:hidden">AI Compare</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Comparison Results */}
          {comparison && (
            <div className="space-y-6">
              {/* Overall Similarity */}
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-4 sm:p-6 border border-purple-500/30">
                <div className="text-center">
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">Overall Similarity</h3>
                  <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">
                    {Math.round(comparison.overallSimilarity * 100)}%
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base">
                    {comparison.overallSimilarity > 0.7 ? 'Very Similar Movies' :
                     comparison.overallSimilarity > 0.4 ? 'Moderately Similar' : 'Quite Different'}
                  </p>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <CategoryCard
                  title="Genre Similarity"
                  percentage={Math.round(comparison.categories.genre.similarity * 100)}
                  icon="🎭"
                  color="blue"
                />
                <CategoryCard
                  title="Plot Similarity"
                  percentage={Math.round(comparison.categories.plot.similarity * 100)}
                  icon="📖"
                  color="green"
                />
                <CategoryCard
                  title="Technical Similarity"
                  percentage={Math.round(comparison.categories.technical.similarity * 100)}
                  icon="⚙️"
                  color="purple"
                />
              </div>

              {/* AI Recommendation */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>🏆</span>
                  AI Recommendation
                </h3>
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-4 border border-yellow-500/30">
                  <p className="text-white font-semibold mb-2">
                    {comparison.recommendation.winner === 'tie' ? '🤝 It\'s a tie!' :
                     comparison.recommendation.winner === 'movie1' ? `🏆 ${movie1?.title} wins!` :
                     `🏆 ${movie2?.title} wins!`}
                  </p>
                  <p className="text-gray-300 text-sm">{comparison.recommendation.reasoning}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    AI Confidence: {Math.round(comparison.recommendation.confidence * 100)}%
                  </p>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>🧠</span>
                  AI Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InsightCard
                    title="Watch Order"
                    content={comparison.categories.aiInsights.whichToWatchFirst}
                    icon="📺"
                  />
                  <InsightCard
                    title="Target Audience"
                    content={comparison.categories.aiInsights.targetAudience}
                    icon="👥"
                  />
                  <InsightCard
                    title="Mood Comparison"
                    content={comparison.categories.aiInsights.moodComparison}
                    icon="🎭"
                  />
                  <InsightCard
                    title="Cultural Impact"
                    content={comparison.categories.aiInsights.culturalImpact}
                    icon="🌍"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Movie Selector Modal */}
      {showMovieSelector && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 z-10">
          <div className="bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-700 w-full max-w-4xl h-[85vh] sm:h-[80vh] overflow-hidden">
            {/* Selector Header */}
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-4 sm:p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-2xl sm:text-3xl">{showMovieSelector === 1 ? '🎬' : '🎭'}</span>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white">Select Movie {showMovieSelector}</h3>
                    <p className="text-gray-300 text-sm sm:text-base">Choose from {availableMovies.length} movies</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMovieSelector(null)}
                  className="text-gray-400 hover:text-white text-xl sm:text-2xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 sm:p-6 border-b border-gray-700">
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-purple-400 text-base sm:text-lg">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-white bg-gray-700 border border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Movie Grid */}
            <div className="p-4 sm:p-6 h-full overflow-y-auto">
              {filteredMovies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredMovies.slice(0, 12).map((movie) => (
                    <div
                      key={movie._id}
                      onClick={() => handleMovieSelect(movie)}
                      className="bg-gray-700 rounded-xl p-4 border border-gray-600 cursor-pointer hover:border-purple-500 hover:bg-gray-600 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-gray-600 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                          <span className="text-xl">🎬</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold text-sm truncate group-hover:text-purple-300">
                            {movie.title}
                          </h4>
                          <p className="text-gray-400 text-xs">{movie.year}</p>
                          <p className="text-gray-400 text-xs">⭐ {movie.imdb?.rating || 'N/A'}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {movie.genres?.slice(0, 2).map(genre => (
                              <span key={genre} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                                {genre}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
                  <p className="text-gray-400">Try adjusting your search terms</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryCard({ title, percentage, icon, color }: any) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
  };

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} rounded-xl p-4 border`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-white font-medium">{title}</span>
      </div>
      <div className="text-2xl font-bold text-white">{percentage}%</div>
    </div>
  );
}

function InsightCard({ title, content, icon }: any) {
  return (
    <div className="bg-gray-700/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-white font-medium text-sm">{title}</span>
      </div>
      <p className="text-gray-300 text-sm">{content}</p>
    </div>
  );
}
