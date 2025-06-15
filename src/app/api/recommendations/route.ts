import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { movieId, genres, limit = 6 } = body;

    console.log('Recommendations request:', { movieId, genres, limit });

    // For demo purposes, get recommendations from our demo search
    // This works without MongoDB dependency
    let recommendations = [];

    try {
      // Get some movies from demo search based on genres or popular movies
      const baseUrl = request.nextUrl.origin;
      const searchQuery = genres?.length > 0 ? genres[0] : 'popular';

      const response = await fetch(`${baseUrl}/api/demo-search?q=${searchQuery}&limit=${limit}`);

      if (response.ok) {
        const data = await response.json();
        recommendations = data.movies || [];

        // Filter out the current movie if it's in the results
        if (movieId) {
          recommendations = recommendations.filter((movie: any) => movie._id !== movieId);
        }

        // Limit to requested number
        recommendations = recommendations.slice(0, limit);
      }
    } catch (error) {
      console.error('Error fetching demo recommendations:', error);
    }

    console.log('Recommendations found:', recommendations.length);

    return NextResponse.json({
      recommendations,
      count: recommendations.length,
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
