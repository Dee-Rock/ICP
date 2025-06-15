import { NextRequest, NextResponse } from 'next/server';

// Free movie API (no key required)
const OMDB_BASE_URL = 'https://www.omdbapi.com';
const OMDB_API_KEY = process.env.OMDB_API_KEY || 'demo'; // You can get free key from omdbapi.com

// Fallback to demo movies from our demo-search
const getDemoMovies = async (query: string, limit: number) => {
  try {
    const response = await fetch(`http://localhost:3000/api/demo-search?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (response.ok) {
      const data = await response.json();
      return data.movies || [];
    }
  } catch (error) {
    console.error('Demo movies fallback failed:', error);
  }
  return [];
};

// Transform OMDB data to our format
const transformOMDBMovie = (movie: any) => ({
  _id: movie.imdbID || Math.random().toString(),
  title: movie.Title,
  plot: movie.Plot !== 'N/A' ? movie.Plot : 'Plot not available',
  genres: movie.Genre !== 'N/A' ? movie.Genre.split(', ') : [],
  year: movie.Year !== 'N/A' ? parseInt(movie.Year) : null,
  runtime: movie.Runtime !== 'N/A' ? parseInt(movie.Runtime.replace(' min', '')) : null,
  cast: movie.Actors !== 'N/A' ? movie.Actors.split(', ') : [],
  directors: movie.Director !== 'N/A' ? movie.Director.split(', ') : [],
  imdb: {
    rating: movie.imdbRating !== 'N/A' ? parseFloat(movie.imdbRating) : null,
    votes: movie.imdbVotes !== 'N/A' ? parseInt(movie.imdbVotes.replace(/,/g, '')) : null,
  },
  poster: movie.Poster !== 'N/A' ? movie.Poster : null,
  streamingOn: getRandomStreamingPlatforms(),
  trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + ' trailer')}`,
});

const getRandomStreamingPlatforms = (): string[] => {
  const platforms = ['Netflix', 'Amazon Prime', 'Disney+', 'HBO Max', 'Hulu', 'Paramount+', 'Apple TV+'];
  const count = Math.floor(Math.random() * 3) + 1;
  return platforms.sort(() => 0.5 - Math.random()).slice(0, count);
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  try {

    console.log('Hybrid search request:', { query, page, limit });

    if (!query || !query.trim()) {
      // Return demo movies if no query
      const demoMovies = await getDemoMovies('', limit);
      return NextResponse.json({
        movies: demoMovies,
        total: demoMovies.length,
        page,
        limit,
        totalPages: 1,
      });
    }

    let allMovies: any[] = [];

    // First, get demo movies (always works)
    const demoMovies = await getDemoMovies(query, Math.floor(limit / 2));
    allMovies = [...demoMovies];

    // Then try to get real movies from OMDB
    try {
      // Search for movies using OMDB API
      const searchResponse = await fetch(
        `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie&page=${page}`
      );

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        
        if (searchData.Response === 'True' && searchData.Search) {
          // Get detailed info for each movie (limited to avoid rate limits)
          const moviePromises = searchData.Search.slice(0, Math.floor(limit / 2)).map(async (movie: any) => {
            try {
              const detailResponse = await fetch(
                `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=${movie.imdbID}&plot=short`
              );
              
              if (detailResponse.ok) {
                const detailData = await detailResponse.json();
                if (detailData.Response === 'True') {
                  return transformOMDBMovie(detailData);
                }
              }
            } catch (error) {
              console.error('Error fetching movie details:', error);
            }
            return null;
          });

          const realMovies = (await Promise.all(moviePromises)).filter(Boolean);
          allMovies = [...allMovies, ...realMovies];
        }
      }
    } catch (error) {
      console.error('OMDB API error:', error);
      // Continue with just demo movies
    }

    // Remove duplicates based on title
    const uniqueMovies = allMovies.filter((movie, index, self) => 
      index === self.findIndex(m => m.title.toLowerCase() === movie.title.toLowerCase())
    );

    // Limit results
    const finalMovies = uniqueMovies.slice(0, limit);

    console.log(`Hybrid search completed, found: ${finalMovies.length} movies (${demoMovies.length} demo + ${finalMovies.length - demoMovies.length} real)`);

    return NextResponse.json({
      movies: finalMovies,
      total: finalMovies.length,
      page,
      limit,
      totalPages: Math.ceil(finalMovies.length / limit),
    });

  } catch (error) {
    console.error('Hybrid search error:', error);
    
    // Final fallback to demo search
    try {
      const demoMovies = await getDemoMovies(query || '', limit);
      return NextResponse.json({
        movies: demoMovies,
        total: demoMovies.length,
        page,
        limit,
        totalPages: 1,
      });
    } catch (fallbackError) {
      console.error('All search methods failed:', fallbackError);
      return NextResponse.json(
        { error: 'Search service temporarily unavailable' },
        { status: 500 }
      );
    }
  }
}
