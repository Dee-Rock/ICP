import { NextRequest, NextResponse } from 'next/server';

// OMDb API - Free movie database (get free key at omdbapi.com)
const OMDB_API_KEY = process.env.OMDB_API_KEY || 'trilogy'; // Free demo key
const OMDB_BASE_URL = 'https://www.omdbapi.com';

// Transform OMDb data to our format
const transformOMDbMovie = (movie: any) => {
  const streamingPlatforms = ['Netflix', 'Amazon Prime', 'Disney+', 'HBO Max', 'Hulu', 'Paramount+', 'Apple TV+'];
  const randomPlatforms = streamingPlatforms
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1);

  return {
    _id: movie.imdbID || Math.random().toString(),
    title: movie.Title,
    plot: movie.Plot !== 'N/A' ? movie.Plot : 'Plot information not available.',
    genres: movie.Genre !== 'N/A' ? movie.Genre.split(', ') : [],
    year: movie.Year !== 'N/A' ? parseInt(movie.Year.replace(/[^\d]/g, '')) : null,
    runtime: movie.Runtime !== 'N/A' ? parseInt(movie.Runtime.replace(' min', '')) : null,
    cast: movie.Actors !== 'N/A' ? movie.Actors.split(', ').slice(0, 4) : [],
    directors: movie.Director !== 'N/A' ? movie.Director.split(', ') : [],
    imdb: {
      rating: movie.imdbRating !== 'N/A' ? parseFloat(movie.imdbRating) : null,
      votes: movie.imdbVotes !== 'N/A' ? parseInt(movie.imdbVotes.replace(/,/g, '')) : null,
    },
    poster: movie.Poster !== 'N/A' ? movie.Poster : null,
    streamingOn: randomPlatforms,
    trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + ' ' + movie.Year + ' trailer')}`,
  };
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  try {

    console.log('Real movie search request:', { query, page, limit });

    if (!query.trim()) {
      // Return popular movies if no query
      const popularSearches = ['Marvel', 'Star Wars', 'Batman', 'Spider', 'Action'];
      const randomSearch = popularSearches[Math.floor(Math.random() * popularSearches.length)];
      
      const response = await fetch(
        `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${randomSearch}&type=movie&page=1`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch popular movies');
      }

      const data = await response.json();
      
      if (data.Response === 'True' && data.Search) {
        // Get detailed info for first few movies
        const moviePromises = data.Search.slice(0, limit).map(async (movie: any) => {
          try {
            const detailResponse = await fetch(
              `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=${movie.imdbID}&plot=short`
            );
            
            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              if (detailData.Response === 'True') {
                return transformOMDbMovie(detailData);
              }
            }
          } catch (error) {
            console.error('Error fetching movie details:', error);
          }
          return transformOMDbMovie(movie);
        });

        const movies = (await Promise.all(moviePromises)).filter(Boolean);

        return NextResponse.json({
          movies,
          total: parseInt(data.totalResults) || movies.length,
          page,
          limit,
          totalPages: Math.ceil((parseInt(data.totalResults) || movies.length) / limit),
        });
      }
    }

    // Search for movies
    const searchResponse = await fetch(
      `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY || 'demo'}&s=${encodeURIComponent(query)}&type=movie&page=${page}`
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to search movies');
    }

    const searchData = await searchResponse.json();
    
    if (searchData.Response === 'False') {
      console.log('No movies found for query:', query);
      return NextResponse.json({
        movies: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      });
    }

    if (searchData.Search) {
      // Get detailed info for each movie (limited to avoid rate limits)
      const moviePromises = searchData.Search.slice(0, limit).map(async (movie: any) => {
        try {
          const detailResponse = await fetch(
            `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY || 'demo'}&i=${movie.imdbID}&plot=short`
          );
          
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            if (detailData.Response === 'True') {
              return transformOMDbMovie(detailData);
            }
          }
        } catch (error) {
          console.error('Error fetching movie details:', error);
        }
        // Fallback to basic movie data
        return transformOMDbMovie(movie);
      });

      const movies = (await Promise.all(moviePromises)).filter(Boolean);

      console.log(`Real movie search completed, found: ${movies.length} movies`);

      return NextResponse.json({
        movies,
        total: parseInt(searchData.totalResults) || movies.length,
        page,
        limit,
        totalPages: Math.ceil((parseInt(searchData.totalResults) || movies.length) / limit),
      });
    }

    return NextResponse.json({
      movies: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    });

  } catch (error) {
    console.error('Real movie search error:', error);
    
    // Fallback to demo search if API fails
    console.log('Falling back to demo search...');
    
    try {
      const baseUrl = request.nextUrl.origin;
      const demoResponse = await fetch(
        `${baseUrl}/api/demo-search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      );
      
      if (demoResponse.ok) {
        const demoData = await demoResponse.json();
        return NextResponse.json({
          ...demoData,
          fallback: true,
          message: 'Using demo data - real movie API temporarily unavailable'
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
