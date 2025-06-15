import { NextRequest, NextResponse } from 'next/server';

// TMDB API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'demo_key';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Streaming provider mapping (simplified for demo)
const getStreamingProviders = (movieId: number): string[] => {
  // In a real app, you'd call TMDB's watch providers API
  // For demo, we'll return random popular platforms
  const platforms = ['Netflix', 'Amazon Prime', 'Disney+', 'HBO Max', 'Hulu', 'Paramount+'];
  const count = Math.floor(Math.random() * 3) + 1; // 1-3 platforms
  return platforms.sort(() => 0.5 - Math.random()).slice(0, count);
};

const getYouTubeTrailer = (movieId: number): string => {
  // In a real app, you'd call TMDB's videos API
  // For demo, we'll return a generic trailer search
  return `https://www.youtube.com/results?search_query=${movieId}+movie+trailer`;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  try {

    console.log('Real search request:', { query, page, limit });

    if (!query || !query.trim()) {
      // Return popular movies if no query
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch popular movies');
      }

      const data = await response.json();
      const movies = data.results.slice(0, limit).map((movie: any) => ({
        _id: movie.id.toString(),
        title: movie.title,
        plot: movie.overview,
        genres: [], // Would need separate API call for genres
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
        runtime: null, // Would need separate API call
        cast: [], // Would need separate API call
        directors: [], // Would need separate API call
        imdb: {
          rating: movie.vote_average,
          votes: movie.vote_count,
        },
        poster: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null,
        streamingOn: getStreamingProviders(movie.id),
        trailerUrl: getYouTubeTrailer(movie.id),
      }));

      return NextResponse.json({
        movies,
        total: data.total_results,
        page,
        limit,
        totalPages: Math.ceil(data.total_results / limit),
      });
    }

    // Search for movies
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );

    if (!response.ok) {
      throw new Error('Failed to search movies');
    }

    const data = await response.json();
    
    // Transform TMDB data to our format
    const movies = data.results.slice(0, limit).map((movie: any) => ({
      _id: movie.id.toString(),
      title: movie.title,
      plot: movie.overview,
      genres: [], // Would need separate API call for detailed genres
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
      runtime: null, // Would need separate API call for runtime
      cast: [], // Would need separate API call for cast
      directors: [], // Would need separate API call for crew
      imdb: {
        rating: movie.vote_average,
        votes: movie.vote_count,
      },
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null,
      streamingOn: getStreamingProviders(movie.id),
      trailerUrl: getYouTubeTrailer(movie.id),
    }));

    console.log(`Real search completed, found: ${movies.length} movies`);

    return NextResponse.json({
      movies,
      total: data.total_results,
      page,
      limit,
      totalPages: Math.ceil(data.total_results / limit),
    });

  } catch (error) {
    console.error('Real search error:', error);
    
    // Fallback to demo search if API fails
    console.log('Falling back to demo search...');
    
    try {
      const demoResponse = await fetch(
        `${request.nextUrl.origin}/api/demo-search?q=${encodeURIComponent(searchParams.get('q') || '')}&page=${page}&limit=${limit}`
      );
      
      if (demoResponse.ok) {
        return demoResponse;
      }
    } catch (fallbackError) {
      console.error('Demo search fallback failed:', fallbackError);
    }

    return NextResponse.json(
      { error: 'Search service temporarily unavailable' },
      { status: 500 }
    );
  }
}
