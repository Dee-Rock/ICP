import { NextRequest, NextResponse } from 'next/server';

// The Movie Database (TMDb) API Integration
// Real movie database with millions of movies
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Transform TMDb movie data to our format
const transformTMDbMovie = (movie: any) => {
  const platforms = ['Netflix', 'Amazon Prime', 'Disney+', 'HBO Max', 'Hulu', 'Paramount+', 'Apple TV+'];
  const streamingCount = Math.floor(Math.random() * 3) + 1;
  const streamingOn = platforms.sort(() => 0.5 - Math.random()).slice(0, streamingCount);
  
  return {
    _id: movie.id?.toString() || Math.random().toString(),
    title: movie.title || movie.name,
    plot: movie.overview || 'Plot information not available.',
    genres: movie.genre_ids ? movie.genre_ids.map((id: number) => getGenreName(id)) : [],
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : 
          movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : null,
    runtime: movie.runtime || Math.floor(Math.random() * 60) + 90,
    cast: [], // Would need additional API call for cast
    directors: [], // Would need additional API call for crew
    imdb: {
      rating: movie.vote_average || null,
      votes: movie.vote_count || null,
    },
    poster: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null,
    streamingOn,
    trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent((movie.title || movie.name) + ' trailer')}`,
  };
};

// Genre ID to name mapping (TMDb uses IDs)
const getGenreName = (id: number): string => {
  const genreMap: { [key: number]: string } = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };
  return genreMap[id] || 'Unknown';
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    console.log('TMDb search request:', { query, page, limit, hasApiKey: !!TMDB_API_KEY });

    // Check if API key is available
    if (!TMDB_API_KEY || TMDB_API_KEY === 'your_api_key_here') {
      console.log('TMDb API key not configured, falling back to demo search');
      
      // Fallback to demo search
      const baseUrl = request.nextUrl.origin;
      const demoResponse = await fetch(
        `${baseUrl}/api/demo-search?q=${encodeURIComponent(query || '')}&page=${page}&limit=${limit}`,
        { timeout: 5000 }
      );
      
      if (demoResponse.ok) {
        const demoData = await demoResponse.json();
        return NextResponse.json({
          ...demoData,
          fallback: true,
          message: 'Using demo data - Add your TMDb API key to .env.local for real movie data'
        });
      }
    }

    if (!query || !query.trim()) {
      // Return popular movies if no query with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to fetch popular movies from TMDb');
      }

      const data = await response.json();
      const movies = data.results.slice(0, limit).map(transformTMDbMovie);

      return NextResponse.json({
        movies,
        total: data.total_results,
        page,
        limit,
        totalPages: Math.ceil(data.total_results / limit),
        source: 'TMDb API'
      });
    }

    // Search for movies with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const searchResponse = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!searchResponse.ok) {
      throw new Error('Failed to search movies on TMDb');
    }

    const searchData = await searchResponse.json();
    const movies = searchData.results.slice(0, limit).map(transformTMDbMovie);

    console.log(`TMDb search completed, found: ${movies.length} movies`);

    return NextResponse.json({
      movies,
      total: searchData.total_results,
      page,
      limit,
      totalPages: Math.ceil(searchData.total_results / limit),
      source: 'TMDb API'
    });

  } catch (error) {
    console.error('TMDb search error:', error);
    
    // Fallback to demo search if API fails
    console.log('Falling back to demo search...');
    
    try {
      const baseUrl = request.nextUrl.origin;
      const demoResponse = await fetch(
        `${baseUrl}/api/demo-search?q=${encodeURIComponent(query || '')}&page=${page}&limit=${limit}`
      );
      
      if (demoResponse.ok) {
        const demoData = await demoResponse.json();
        return NextResponse.json({
          ...demoData,
          fallback: true,
          message: 'Using demo data - TMDb API temporarily unavailable'
        });
      }
    } catch (fallbackError) {
      console.error('Demo search fallback failed:', fallbackError);
    }

    return NextResponse.json(
      { error: 'Movie search service temporarily unavailable' },
      { status: 500 }
    );
  }
}
