import { NextRequest, NextResponse } from 'next/server';

// Generate simple movie insights without external dependencies
const generateSimpleInsight = (title: string, genres: string[], year: number, rating?: number) => {
  const insights = [
    `${title} is a compelling ${genres.join(' ')} film that showcases excellent storytelling.`,
    `This ${year} release demonstrates the evolution of ${genres[0]?.toLowerCase()} cinema.`,
    `${title} stands out for its unique approach to the ${genres.join(' and ')} genre${genres.length > 1 ? 's' : ''}.`,
    `A must-watch for fans of ${genres.join(' and ')} movies, ${title} delivers on multiple levels.`,
    `${title} represents the best of ${year}s cinema with its innovative storytelling approach.`
  ];

  let insight = insights[Math.floor(Math.random() * insights.length)];

  if (rating && rating >= 8.0) {
    insight += ` With its exceptional ${rating}/10 rating, this film has earned critical acclaim and audience appreciation.`;
  } else if (rating && rating >= 7.0) {
    insight += ` Its solid ${rating}/10 rating reflects the quality filmmaking and engaging narrative.`;
  }

  return insight;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { movieId, movieTitle, movieGenres, movieYear, movieRating } = body;

    console.log('Insights request:', { movieId, movieTitle });

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    // Generate a simple insight based on available movie data
    const insight = generateSimpleInsight(
      movieTitle || 'This movie',
      movieGenres || ['drama'],
      movieYear || 2020,
      movieRating
    );

    console.log('Generated insight:', insight);

    return NextResponse.json({
      movieId,
      title: movieTitle,
      insight,
    });
  } catch (error) {
    console.error('Insights error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
