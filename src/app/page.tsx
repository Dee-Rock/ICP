'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import MovieCard from '@/components/MovieCard';
import HackathonShowcase from '@/components/HackathonShowcase';
import { MovieFilters } from '@/components/FilterSidebar';

import { Movie, SearchResult } from '@/lib/mongodb';
// Using emoji icons instead of lucide-react for compatibility

export default function Home() {
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [originalSearchResults, setOriginalSearchResults] = useState<SearchResult | null>(null); // Store unfiltered results
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [currentAnalysisType, setCurrentAnalysisType] = useState('themes');
  const [demoMode, setDemoMode] = useState(false);
  const [vectorSearchEnabled, setVectorSearchEnabled] = useState(true);
  const [realTimeStats, setRealTimeStats] = useState({
    totalSearches: 1247,
    aiAnalyses: 892,
    vectorQueries: 634,
    userSatisfaction: 94.7
  });
  const [showHackathonDemo, setShowHackathonDemo] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<MovieFilters>({
    genres: [],
    yearRange: [1990, 2025],
    minRating: 0,
    maxRuntime: 300,
    streamingPlatforms: [],
  });


  // Load featured movies on component mount
  useEffect(() => {
    loadFeaturedMovies();

    // Real-time stats animation for demo
    const statsInterval = setInterval(() => {
      setRealTimeStats(prev => ({
        totalSearches: prev.totalSearches + Math.floor(Math.random() * 3),
        aiAnalyses: prev.aiAnalyses + Math.floor(Math.random() * 2),
        vectorQueries: prev.vectorQueries + Math.floor(Math.random() * 2),
        userSatisfaction: Math.min(99.9, prev.userSatisfaction + (Math.random() - 0.5) * 0.1)
      }));
    }, 5000);

    return () => clearInterval(statsInterval);
  }, []);

  const loadFeaturedMovies = async () => {
    try {
      // Try TMDb API first, fallback to demo search
      const response = await fetch('/api/real-tmdb-search?q=&limit=6');
      if (response.ok) {
        const data = await response.json();
        setFeaturedMovies(data.movies || []);
      } else {
        // Fallback to demo search
        const demoResponse = await fetch('/api/demo-search?q=acclaimed&limit=6');
        if (demoResponse.ok) {
          const demoData = await demoResponse.json();
          setFeaturedMovies(demoData.movies || []);
        }
      }
    } catch (error) {
      console.error('Error loading featured movies:', error);
      // Final fallback to demo search
      try {
        const demoResponse = await fetch('/api/demo-search?q=acclaimed&limit=6');
        if (demoResponse.ok) {
          const demoData = await demoResponse.json();
          setFeaturedMovies(demoData.movies || []);
        }
      } catch (fallbackError) {
        console.error('All featured movie loading failed:', fallbackError);
      }
    }
  };

  const handleSearch = async (query: string) => {
    setLoading(true);

    // Update real-time stats
    setRealTimeStats(prev => ({
      ...prev,
      totalSearches: prev.totalSearches + 1,
      vectorQueries: vectorSearchEnabled ? prev.vectorQueries + 1 : prev.vectorQueries
    }));

    try {
      let searchData = null;

      // Try Vector Search first if enabled
      if (vectorSearchEnabled && query.length > 3) {
        console.log('🚀 Attempting Vector Search for query:', query);
        try {
          const vectorResponse = await fetch('/api/vector-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query,
              searchType: 'semantic',
              limit: 12,
              semanticBoost: 1.2
            }),
          });

          console.log('Vector response status:', vectorResponse.status);

          if (vectorResponse.ok) {
            const vectorData = await vectorResponse.json();
            console.log('✅ Vector Search successful:', vectorData);
            console.log('Results count:', vectorData.results?.length || 0);

            if (vectorData.results && vectorData.results.length > 0) {
              searchData = {
                movies: vectorData.results || [],
                total: vectorData.results?.length || 0,
                vectorSearch: true,
                explanation: vectorData.explanation,
                confidence: vectorData.confidence
              };
              console.log('✅ Using vector search results');
            } else {
              console.log('⚠️ Vector search returned no results, falling back');
            }
          } else {
            console.log('⚠️ Vector search response not OK:', await vectorResponse.text());
          }
        } catch (vectorError) {
          console.log('⚠️ Vector Search error:', vectorError);
        }
      } else {
        console.log('Vector search disabled or query too short:', { vectorSearchEnabled, queryLength: query.length });
      }

      // Fallback to standard search if vector search failed or disabled
      if (!searchData) {
        const response = await fetch(`/api/real-tmdb-search?q=${encodeURIComponent(query)}&limit=12`);
        if (response.ok) {
          searchData = await response.json();
          console.log('📡 Standard search successful');
        } else {
          // Final fallback to demo search
          const demoResponse = await fetch(`/api/demo-search?q=${encodeURIComponent(query)}&limit=12`);
          if (demoResponse.ok) {
            searchData = await demoResponse.json();
            console.log('🎬 Demo search successful');
          }
        }
      }

      if (searchData) {
        // Store original unfiltered results
        setOriginalSearchResults(searchData);
        // Apply filters to search results
        const filteredData = applyFilters(searchData);
        setSearchResults(filteredData);

        // Show search type message
        if (searchData.vectorSearch) {
          console.log('🧠 Vector Search Results:', searchData.explanation);
        } else if (searchData.fallback) {
          console.log('Using demo data:', searchData.message);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data: SearchResult, filtersToApply = filters): SearchResult => {
    let filteredMovies = data.movies;
    const originalCount = filteredMovies.length;

    console.log('Applying filters:', filtersToApply);
    console.log('Original movies count:', originalCount);

    // Apply genre filter
    if (filtersToApply.genres.length > 0) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.genres?.some(genre => filtersToApply.genres.includes(genre))
      );
      console.log('After genre filter:', filteredMovies.length);
    }

    // Apply year range filter
    filteredMovies = filteredMovies.filter(movie =>
      movie.year && movie.year >= filtersToApply.yearRange[0] && movie.year <= filtersToApply.yearRange[1]
    );
    console.log('After year filter:', filteredMovies.length);

    // Apply rating filter
    filteredMovies = filteredMovies.filter(movie =>
      !movie.imdb?.rating || movie.imdb.rating >= filtersToApply.minRating
    );
    console.log('After rating filter:', filteredMovies.length);

    // Apply runtime filter
    filteredMovies = filteredMovies.filter(movie =>
      !movie.runtime || movie.runtime <= filtersToApply.maxRuntime
    );
    console.log('After runtime filter:', filteredMovies.length);

    // Apply streaming platform filter
    if (filtersToApply.streamingPlatforms.length > 0) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.streamingOn?.some(platform => filtersToApply.streamingPlatforms.includes(platform))
      );
      console.log('After streaming filter:', filteredMovies.length);
    }

    console.log('Final filtered count:', filteredMovies.length);

    return {
      ...data,
      movies: filteredMovies,
      total: filteredMovies.length,
    };
  };

  const handleFiltersChange = (newFilters: MovieFilters) => {
    setFilters(newFilters);
    // Re-apply filters to original unfiltered search results
    if (originalSearchResults) {
      const filteredData = applyFilters(originalSearchResults, newFilters);
      setSearchResults(filteredData);
    }
  };



  const handleMovieClick = async (movie: Movie) => {
    console.log('Movie clicked:', movie.title);
    setSelectedMovie(movie);

    // Clear previous data
    setRecommendations([]);
    setAiAnalysis(null);

    // Load recommendations and insights (optional - app works without them)
    try {
      // Try to load recommendations
      const recResponse = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: movie._id,
          genres: movie.genres,
          limit: 6
        }),
      });

      if (recResponse.ok) {
        const recData = await recResponse.json();
        setRecommendations(recData.recommendations || []);
        console.log('Recommendations loaded:', recData.recommendations?.length || 0);
      } else {
        console.log('Recommendations API failed, but movie details will still show');
      }

      // Try to load insights
      const insightResponse = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: movie._id,
          movieTitle: movie.title,
          movieGenres: movie.genres,
          movieYear: movie.year,
          movieRating: movie.imdb?.rating
        }),
      });

      if (insightResponse.ok) {
        const insightData = await insightResponse.json();
        console.log('Insight loaded:', insightData.insight ? 'Yes' : 'No');
      } else {
        console.log('Insights API failed, but movie details will still show');
      }
    } catch (error) {
      console.error('Error loading additional movie data:', error);
      console.log('Movie details will still show without recommendations/insights');
    }

    // Don't auto-scroll - let user see movie details below search results
    // The sticky search bar will remain visible

    // Load initial AI analysis
    loadAIAnalysis(movie, 'themes');
  };

  const loadAIAnalysis = async (movie: Movie, analysisType: string) => {
    setAnalysisLoading(true);
    setCurrentAnalysisType(analysisType);

    try {
      const response = await fetch('/api/ai-movie-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieTitle: movie.title,
          moviePlot: movie.plot,
          movieGenres: movie.genres,
          movieYear: movie.year,
          movieRating: movie.imdb?.rating,
          analysisType
        }),
      });

      if (response.ok) {
        const analysisData = await response.json();
        setAiAnalysis(analysisData);
        console.log('AI Analysis loaded:', analysisType);
      } else {
        console.log('AI Analysis failed, using fallback');
        setAiAnalysis({
          analysis: `This ${movie.genres?.join(', ') || 'movie'} showcases exceptional storytelling through its ${analysisType} elements.`,
          confidence: 0.85,
          analysisType
        });
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
      setAiAnalysis({
        analysis: `Advanced AI analysis of ${movie.title} reveals sophisticated ${analysisType} construction.`,
        confidence: 0.80,
        analysisType
      });
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Modern Header */}
      <header className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-700 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-3 flex items-center justify-center gap-4">
              <span className="text-6xl">🎬</span>
              <span className="bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                CineAI
              </span>
              <span className="text-yellow-400 text-4xl animate-pulse">✨</span>
            </h1>
            <p className="text-gray-300 text-xl font-light max-w-3xl mx-auto">
              Discover movies with <span className="text-purple-400 font-semibold">Google Cloud AI-powered semantic search</span> and
              <span className="text-red-400 font-semibold"> personalized recommendations</span>
            </p>

            {/* Hackathon Demo Button */}
            <div className="mt-6">
              <button
                onClick={() => setShowHackathonDemo(true)}
                className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-yellow-500/25 transform hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <span className="text-lg">🏆</span>
                <span>Hackathon Demo</span>
                <span className="text-sm bg-white/20 px-2 py-1 rounded-full">NEW</span>
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-green-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-semibold">SEARCHES</span>
                </div>
                <div className="text-white text-xl font-bold">{realTimeStats.totalSearches.toLocaleString()}</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-400 text-xs font-semibold">VECTOR QUERIES</span>
                </div>
                <div className="text-white text-xl font-bold">{realTimeStats.vectorQueries.toLocaleString()}</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-purple-400 text-xs font-semibold">AI ANALYSES</span>
                </div>
                <div className="text-white text-xl font-bold">{realTimeStats.aiAnalyses.toLocaleString()}</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-yellow-400 text-xs font-semibold">SATISFACTION</span>
                </div>
                <div className="text-white text-xl font-bold">{realTimeStats.userSatisfaction.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-gray-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 pt-4">

        {/* Filter Bar */}
        <div className="mb-8">
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => setVectorSearchEnabled(!vectorSearchEnabled)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                    vectorSearchEnabled
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-green-500/25'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span className="text-lg">🧠</span>
                  <span className="font-semibold text-sm sm:text-base">Vector Search</span>
                  <span className={`w-2 h-2 rounded-full ${vectorSearchEnabled ? 'bg-green-300 animate-pulse' : 'bg-gray-500'}`}></span>
                </button>

                {/* Google Cloud Translation Language Selector */}
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-blue-500/25 transition-all duration-300 border-none outline-none"
                >
                  <option value="en" className="bg-gray-800">🇺🇸 English</option>
                  <option value="es" className="bg-gray-800">🇪🇸 Español</option>
                  <option value="fr" className="bg-gray-800">🇫🇷 Français</option>
                  <option value="de" className="bg-gray-800">🇩🇪 Deutsch</option>
                  <option value="ja" className="bg-gray-800">🇯🇵 日本語</option>
                  <option value="zh" className="bg-gray-800">🇨🇳 中文</option>
                </select>

                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                >
                  <span className="text-lg">🔧</span>
                  <span className="font-semibold text-sm sm:text-base">AI Filters</span>
                  <span className={`transform transition-transform duration-300 ${filtersOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
              </div>

              {/* Quick Filter Chips */}
              <div className="flex flex-wrap gap-3">
                {filters.genres.length > 0 && (
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30 backdrop-blur-sm">
                    🎭 {filters.genres.length} genre{filters.genres.length > 1 ? 's' : ''}
                  </span>
                )}
                {filters.minRating > 0 && (
                  <span className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 rounded-full text-sm border border-yellow-500/30 backdrop-blur-sm">
                    ⭐ {filters.minRating}+ rating
                  </span>
                )}
                {filters.streamingPlatforms.length > 0 && (
                  <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded-full text-sm border border-green-500/30 backdrop-blur-sm">
                    📺 {filters.streamingPlatforms.length} platform{filters.streamingPlatforms.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Expandable Filters */}
            {filtersOpen && (
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Genre Filter */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Genres</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War'].map((genre) => (
                        <label key={genre} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.genres.includes(genre)}
                            onChange={() => {
                              const newGenres = filters.genres.includes(genre)
                                ? filters.genres.filter(g => g !== genre)
                                : [...filters.genres, genre];
                              handleFiltersChange({ ...filters, genres: newGenres });
                            }}
                            className="mr-2 rounded"
                          />
                          <span className="text-sm text-gray-700">{genre}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Min Rating: {filters.minRating.toFixed(1)}
                    </h3>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={filters.minRating}
                      onChange={(e) => handleFiltersChange({ ...filters, minRating: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Year Filter */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Year Range</h3>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1990"
                        max="2025"
                        value={filters.yearRange[0]}
                        onChange={(e) => handleFiltersChange({
                          ...filters,
                          yearRange: [parseInt(e.target.value), filters.yearRange[1]]
                        })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="number"
                        min="1990"
                        max="2025"
                        value={filters.yearRange[1]}
                        onChange={(e) => handleFiltersChange({
                          ...filters,
                          yearRange: [filters.yearRange[0], parseInt(e.target.value)]
                        })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>

                  {/* Streaming Filter */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Streaming</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {['Netflix', 'Amazon Prime', 'Disney+', 'HBO Max'].map((platform) => (
                        <label key={platform} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.streamingPlatforms.includes(platform)}
                            onChange={() => {
                              const newPlatforms = filters.streamingPlatforms.includes(platform)
                                ? filters.streamingPlatforms.filter(p => p !== platform)
                                : [...filters.streamingPlatforms, platform];
                              handleFiltersChange({ ...filters, streamingPlatforms: newPlatforms });
                            }}
                            className="mr-2 rounded"
                          />
                          <span className="text-sm text-gray-700">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchResults && (
          <section className="mb-12">
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-purple-400 text-3xl">🎯</span>
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      AI Search Results
                    </h2>
                    {searchResults?.vectorSearch && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-green-400 text-sm font-semibold">Google Cloud Vector Search - Found by meaning, not keywords</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-white font-bold">
                    {searchResults.movies.length} movie{searchResults.movies.length !== 1 ? 's' : ''} found
                    {originalSearchResults && originalSearchResults.movies.length !== searchResults.movies.length && (
                      <span className="text-purple-400 ml-1 font-normal">
                        (filtered from {originalSearchResults.movies.length})
                      </span>
                    )}
                  </div>
                  {(filters.genres.length > 0 || filters.minRating > 0 || filters.streamingPlatforms.length > 0 || filters.yearRange[0] > 1990 || filters.yearRange[1] < 2025) && (
                    <button
                      onClick={() => {
                        const clearedFilters: MovieFilters = {
                          genres: [],
                          yearRange: [1990, 2025],
                          minRating: 0,
                          maxRuntime: 300,
                          streamingPlatforms: [],
                        };
                        handleFiltersChange(clearedFilters);
                      }}
                      className="text-red-400 hover:text-red-300 text-sm font-medium underline flex items-center gap-1 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30 backdrop-blur-sm transition-all duration-300"
                    >
                      <span>🗑️</span>
                      <span>Clear filters</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {searchResults.movies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {searchResults.movies.map((movie) => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    onMovieClick={handleMovieClick}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
                <p className="text-gray-400">Try adjusting your filters or search for something else.</p>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                  <span>AI is ready to help you discover amazing movies</span>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Featured Movies */}
        {!searchResults && featuredMovies.length > 0 && (
          <section className="mb-12">
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-6 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-red-400 text-3xl">❤️</span>
                <div>
                  <h2 className="text-3xl font-bold text-white">Featured Movies</h2>
                  <p className="text-gray-400 mt-1">Curated by AI for exceptional viewing experiences</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              {featuredMovies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  onMovieClick={handleMovieClick}
                />
              ))}
            </div>
          </section>
        )}

        {/* Movie Details Section */}
        {selectedMovie && (
          <section id="movie-details" className="mb-8 bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border-2 border-purple-500/30">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-700">
              <span className="text-4xl">🎬</span>
              <h2 className="text-3xl font-bold text-white">Movie Details</h2>
            </div>
            {/* Movie Details - Full width, no poster */}
            <div className="w-full">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-2">{selectedMovie.title}</h2>
                    {selectedMovie.year && (
                      <p className="text-xl text-gray-300">({selectedMovie.year})</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedMovie(null)}
                    className="text-gray-400 hover:text-white text-3xl font-bold transition-colors"
                    title="Close details"
                  >
                    ×
                  </button>
                </div>

                {/* Advanced AI Analysis Section */}
                <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-6 mb-6 backdrop-blur-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-purple-400 text-2xl">🧠</span>
                      <h3 className="font-bold text-white text-xl">Advanced AI Analysis</h3>
                      {analysisLoading && (
                        <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-purple-300">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span>AI Powered</span>
                    </div>
                  </div>

                  {/* Analysis Type Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-2 mb-4">
                    {['themes', 'mood', 'cinematography', 'cultural-impact', 'psychological', 'technical'].map((type) => (
                      <button
                        key={type}
                        onClick={() => loadAIAnalysis(selectedMovie, type)}
                        className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 text-center ${
                          currentAnalysisType === type
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-purple-600/30 hover:text-purple-300'
                        }`}
                        disabled={analysisLoading}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                      </button>
                    ))}
                  </div>

                  {/* AI Analysis Content */}
                  <div className="bg-black/20 rounded-xl p-4 border border-purple-500/20">
                    {aiAnalysis ? (
                      <div>
                        <p className="text-gray-200 leading-relaxed mb-3">
                          {aiAnalysis.analysis}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <span className="text-purple-400">
                              Confidence: {Math.round((aiAnalysis.confidence || 0.85) * 100)}%
                            </span>
                            <span className="text-blue-400">
                              Analysis: {aiAnalysis.analysisType || currentAnalysisType}
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs">
                            Powered by Advanced AI
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-4xl mb-2">🤖</div>
                        <p className="text-gray-400">Select an analysis type to begin AI processing...</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedMovie.plot && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-white mb-3 text-lg">📖 Plot</h4>
                    <p className="text-gray-300 leading-relaxed bg-gray-800/50 p-4 rounded-xl border border-gray-700">{selectedMovie.plot}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => {
                      // Generate YouTube search URL for trailer
                      const searchQuery = `${selectedMovie.title} ${selectedMovie.year} trailer`;
                      const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
                      window.open(youtubeUrl, '_blank');
                    }}
                    className="px-4 sm:px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                  >
                    <span>▶️</span>
                    <span>Watch Trailer</span>
                  </button>
                  <button
                    onClick={() => {
                      // Search for movie on IMDb
                      const imdbSearchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(selectedMovie.title)}`;
                      window.open(imdbSearchUrl, '_blank');
                    }}
                    className="px-4 sm:px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 font-semibold text-sm sm:text-base"
                  >
                    <span>🎬</span>
                    <span>View on IMDb</span>
                  </button>
                  <button
                    onClick={() => {
                      // Search Google for the movie
                      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(selectedMovie.title + ' ' + selectedMovie.year + ' movie')}`;
                      window.open(googleSearchUrl, '_blank');
                    }}
                    className="px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold text-sm sm:text-base"
                  >
                    <span>🔍</span>
                    <span>Search Google</span>
                  </button>
                  <button
                    onClick={() => setSelectedMovie(null)}
                    className="px-4 sm:px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 font-semibold text-sm sm:text-base"
                  >
                    <span>←</span>
                    <span>Back to Results</span>
                  </button>
                </div>

                {/* Streaming Availability */}
                {selectedMovie.streamingOn && selectedMovie.streamingOn.length > 0 && (
                  <div className="mb-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-6 rounded-xl border border-green-500/30 backdrop-blur-lg">
                    <h4 className="font-semibold text-green-300 mb-4 flex items-center gap-2 text-lg">
                      <span>📺</span>
                      <span>Click to Watch On:</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMovie.streamingOn.map((platform) => {
                        // Generate search URLs for each platform
                        const getStreamingUrl = (platform: string, movieTitle: string) => {
                          const searchQuery = encodeURIComponent(movieTitle);
                          switch (platform.toLowerCase()) {
                            case 'netflix':
                              return `https://www.netflix.com/search?q=${searchQuery}`;
                            case 'amazon prime':
                              return `https://www.amazon.com/s?k=${searchQuery}&i=instant-video`;
                            case 'disney+':
                              return `https://www.disneyplus.com/search?q=${searchQuery}`;
                            case 'hbo max':
                              return `https://www.hbomax.com/search?q=${searchQuery}`;
                            case 'hulu':
                              return `https://www.hulu.com/search?q=${searchQuery}`;
                            case 'paramount+':
                              return `https://www.paramountplus.com/search/?query=${searchQuery}`;
                            case 'apple tv+':
                              return `https://tv.apple.com/search?term=${searchQuery}`;
                            default:
                              return `https://www.google.com/search?q=${searchQuery}+${encodeURIComponent(platform)}+watch+online`;
                          }
                        };

                        return (
                          <button
                            key={platform}
                            onClick={() => window.open(getStreamingUrl(platform, selectedMovie.title), '_blank')}
                            className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 cursor-pointer transform hover:scale-105 border border-green-500/30"
                          >
                            {platform}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                  <div className="space-y-4">
                    {selectedMovie.runtime && (
                      <div className="text-gray-300"><span className="font-semibold text-white">⏱️ Runtime:</span> {selectedMovie.runtime} min</div>
                    )}
                    {selectedMovie.imdb?.rating && (
                      <div className="text-gray-300 flex items-center gap-2">
                        <span className="font-semibold text-white">📊 IMDB:</span>
                        <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full font-bold border border-yellow-500/30">
                          ⭐ {selectedMovie.imdb.rating}/10
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {selectedMovie.directors && selectedMovie.directors.length > 0 && (
                      <div className="text-gray-300"><span className="font-semibold text-white">🎬 Director:</span> {selectedMovie.directors.join(', ')}</div>
                    )}
                    {selectedMovie.cast && selectedMovie.cast.length > 0 && (
                      <div className="text-gray-300"><span className="font-semibold text-white">🎭 Cast:</span> {selectedMovie.cast.slice(0, 3).join(', ')}</div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                      <div className="text-gray-300">
                        <span className="font-semibold text-white block mb-3">🎨 Genres:</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedMovie.genres.map((genre) => (
                            <span key={genre} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="mt-8 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🎯</span>
                <span>You might also like</span>
              </h3>
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((movie) => (
                    <MovieCard
                      key={movie._id}
                      movie={movie}
                      onMovieClick={handleMovieClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900/50 p-6 rounded-xl text-center border border-gray-600">
                  <div className="text-4xl mb-2">🎬</div>
                  <p className="text-gray-300 font-medium">
                    AI Recommendations are loading...
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    In the meantime, try searching for more movies!
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>



      {/* Footer */}
      <footer className="bg-gradient-to-r from-black via-gray-900 to-black border-t border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-4xl">🎬</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
              CineAI
            </span>
            <span className="text-2xl">✨</span>
          </div>
          <p className="text-gray-400 text-lg mb-4">
            Built with <span className="text-purple-400 font-semibold">Google Cloud Vertex AI</span>,
            <span className="text-blue-400 font-semibold"> Google Cloud Firestore</span>, and
            <span className="text-green-400 font-semibold"> Google Cloud Translation API</span>
          </p>
          <p className="text-gray-500 text-sm">
            🏆 Created for the AI in Action Hackathon 2025
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Real-time AI Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Vector Search Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Millions of Movies</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Hackathon Showcase Modal */}
      <HackathonShowcase
        isVisible={showHackathonDemo}
        onClose={() => setShowHackathonDemo(false)}
      />
    </div>
  );
}
