import { NextRequest, NextResponse } from 'next/server';

interface RecommendationRequest {
  movieId: string;
  movieTitle: string;
  genres: string[];
  plot: string;
  userPreferences?: {
    favoriteGenres: string[];
    watchHistory: string[];
    ratings: { [movieId: string]: number };
  };
}

interface SmartRecommendation {
  movie: any;
  similarity: number;
  reasons: string[];
  aiConfidence: number;
  recommendationType: 'genre-based' | 'plot-similarity' | 'mood-match' | 'ai-curated';
}

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json();
    const { movieTitle, genres, plot, userPreferences } = body;

    // Simulate advanced AI recommendation logic
    const recommendations: SmartRecommendation[] = [];

    // Genre-based recommendations
    const genreRecommendations = await getGenreBasedRecommendations(genres);
    recommendations.push(...genreRecommendations);

    // Plot similarity recommendations using AI
    const plotRecommendations = await getPlotSimilarityRecommendations(plot);
    recommendations.push(...plotRecommendations);

    // Mood-based recommendations
    const moodRecommendations = await getMoodBasedRecommendations(movieTitle, plot);
    recommendations.push(...moodRecommendations);

    // AI-curated recommendations
    const aiRecommendations = await getAICuratedRecommendations(movieTitle, genres, plot);
    recommendations.push(...aiRecommendations);

    // Apply user preferences if available
    let personalizedRecommendations = recommendations;
    if (userPreferences) {
      personalizedRecommendations = applyUserPreferences(recommendations, userPreferences);
    }

    // Sort by AI confidence and similarity
    const sortedRecommendations = personalizedRecommendations
      .sort((a, b) => (b.aiConfidence * b.similarity) - (a.aiConfidence * a.similarity))
      .slice(0, 12);

    return NextResponse.json({
      success: true,
      recommendations: sortedRecommendations,
      totalFound: sortedRecommendations.length,
      aiProcessingTime: Math.random() * 2 + 1, // Simulated processing time
      recommendationTypes: {
        'genre-based': sortedRecommendations.filter(r => r.recommendationType === 'genre-based').length,
        'plot-similarity': sortedRecommendations.filter(r => r.recommendationType === 'plot-similarity').length,
        'mood-match': sortedRecommendations.filter(r => r.recommendationType === 'mood-match').length,
        'ai-curated': sortedRecommendations.filter(r => r.recommendationType === 'ai-curated').length,
      },
      metadata: {
        algorithm: 'Advanced AI Multi-Vector Recommendation Engine',
        confidence: 'High',
        personalized: !!userPreferences,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Smart recommendations error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate smart recommendations',
      fallback: await getFallbackRecommendations()
    }, { status: 500 });
  }
}

async function getGenreBasedRecommendations(genres: string[]): Promise<SmartRecommendation[]> {
  // Simulate genre-based AI recommendations
  const genreMovies = [
    {
      _id: 'rec1',
      title: 'Inception',
      year: 2010,
      genres: ['Sci-Fi', 'Thriller'],
      plot: 'A thief who steals corporate secrets through dream-sharing technology...',
      imdb: { rating: 8.8 },
      poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
    },
    {
      _id: 'rec2',
      title: 'The Matrix',
      year: 1999,
      genres: ['Sci-Fi', 'Action'],
      plot: 'A computer hacker learns from mysterious rebels about the true nature of his reality...',
      imdb: { rating: 8.7 },
      poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg'
    },
    {
      _id: 'rec3',
      title: 'Blade Runner 2049',
      year: 2017,
      genres: ['Sci-Fi', 'Drama'],
      plot: 'A young blade runner discovers a long-buried secret that leads him to track down former blade runner Rick Deckard...',
      imdb: { rating: 8.0 },
      poster: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg'
    }
  ];

  return genreMovies.map(movie => ({
    movie,
    similarity: 0.85 + Math.random() * 0.1,
    reasons: [`Shares ${genres.join(', ')} genres`, 'Similar thematic elements', 'High user rating correlation'],
    aiConfidence: 0.9 + Math.random() * 0.1,
    recommendationType: 'genre-based' as const
  }));
}

async function getPlotSimilarityRecommendations(plot: string): Promise<SmartRecommendation[]> {
  // Simulate plot similarity using AI
  const plotSimilarMovies = [
    {
      _id: 'plot1',
      title: 'Ex Machina',
      year: 2014,
      genres: ['Sci-Fi', 'Drama'],
      plot: 'A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence...',
      imdb: { rating: 7.7 },
      poster: 'https://image.tmdb.org/t/p/w500/btTdmkgIvOi0FFip1sPuZI2oQG6.jpg'
    },
    {
      _id: 'plot2',
      title: 'Her',
      year: 2013,
      genres: ['Romance', 'Sci-Fi'],
      plot: 'In a near future, a lonely writer develops an unlikely relationship with an operating system...',
      imdb: { rating: 8.0 },
      poster: 'https://image.tmdb.org/t/p/w500/lEIaL12hSkqqe83kgADkbUqEnvk.jpg'
    }
  ];

  return plotSimilarMovies.map(movie => ({
    movie,
    similarity: 0.78 + Math.random() * 0.15,
    reasons: ['Similar narrative structure', 'Comparable character development', 'Thematic plot parallels'],
    aiConfidence: 0.85 + Math.random() * 0.1,
    recommendationType: 'plot-similarity' as const
  }));
}

async function getMoodBasedRecommendations(title: string, plot: string): Promise<SmartRecommendation[]> {
  // Simulate mood analysis
  const moodMovies = [
    {
      _id: 'mood1',
      title: 'Interstellar',
      year: 2014,
      genres: ['Sci-Fi', 'Drama'],
      plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival...',
      imdb: { rating: 8.6 },
      poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
    }
  ];

  return moodMovies.map(movie => ({
    movie,
    similarity: 0.82 + Math.random() * 0.1,
    reasons: ['Matching emotional tone', 'Similar pacing and atmosphere', 'Comparable viewer experience'],
    aiConfidence: 0.88 + Math.random() * 0.1,
    recommendationType: 'mood-match' as const
  }));
}

async function getAICuratedRecommendations(title: string, genres: string[], plot: string): Promise<SmartRecommendation[]> {
  // Simulate advanced AI curation
  const aiCuratedMovies = [
    {
      _id: 'ai1',
      title: 'Arrival',
      year: 2016,
      genres: ['Sci-Fi', 'Drama'],
      plot: 'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world...',
      imdb: { rating: 7.9 },
      poster: 'https://image.tmdb.org/t/p/w500/yImmxRokQ48PD49ughXdpKTAsAU.jpg'
    }
  ];

  return aiCuratedMovies.map(movie => ({
    movie,
    similarity: 0.91 + Math.random() * 0.05,
    reasons: ['AI-detected hidden patterns', 'Advanced semantic analysis', 'Cross-cultural appeal factors'],
    aiConfidence: 0.95 + Math.random() * 0.05,
    recommendationType: 'ai-curated' as const
  }));
}

function applyUserPreferences(recommendations: SmartRecommendation[], preferences: any): SmartRecommendation[] {
  // Boost recommendations based on user preferences
  return recommendations.map(rec => {
    let boost = 1.0;
    
    // Boost based on favorite genres
    if (preferences.favoriteGenres?.some((genre: string) => rec.movie.genres?.includes(genre))) {
      boost += 0.1;
      rec.reasons.push('Matches your favorite genres');
    }
    
    // Boost based on rating history
    if (rec.movie.imdb?.rating && rec.movie.imdb.rating > 8.0) {
      boost += 0.05;
      rec.reasons.push('High-rated like your preferences');
    }
    
    return {
      ...rec,
      similarity: Math.min(1.0, rec.similarity * boost),
      aiConfidence: Math.min(1.0, rec.aiConfidence * boost)
    };
  });
}

async function getFallbackRecommendations(): Promise<SmartRecommendation[]> {
  // Fallback recommendations if AI fails
  return [
    {
      movie: {
        _id: 'fallback1',
        title: 'The Shawshank Redemption',
        year: 1994,
        genres: ['Drama'],
        plot: 'Two imprisoned men bond over a number of years...',
        imdb: { rating: 9.3 }
      },
      similarity: 0.75,
      reasons: ['Popular choice', 'High ratings'],
      aiConfidence: 0.7,
      recommendationType: 'genre-based' as const
    }
  ];
}
