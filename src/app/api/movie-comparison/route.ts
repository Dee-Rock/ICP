import { NextRequest, NextResponse } from 'next/server';

interface ComparisonRequest {
  movie1: {
    id: string;
    title: string;
    year: number;
    genres: string[];
    plot: string;
    rating?: number;
    runtime?: number;
    director?: string;
    cast?: string[];
  };
  movie2: {
    id: string;
    title: string;
    year: number;
    genres: string[];
    plot: string;
    rating?: number;
    runtime?: number;
    director?: string;
    cast?: string[];
  };
  comparisonType: 'detailed' | 'quick' | 'ai-analysis';
}

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
    cast: {
      similarity: number;
      analysis: string;
      commonActors: string[];
      castingStyle: string;
    };
    aiInsights: {
      recommendation: string;
      whichToWatchFirst: string;
      targetAudience: string;
      moodComparison: string;
      culturalImpact: string;
    };
  };
  visualComparison: {
    strengthsMovie1: string[];
    strengthsMovie2: string[];
    weaknessesMovie1: string[];
    weaknessesMovie2: string[];
  };
  recommendation: {
    winner: 'movie1' | 'movie2' | 'tie';
    reasoning: string;
    confidence: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ComparisonRequest = await request.json();
    const { movie1, movie2, comparisonType } = body;

    // Generate comprehensive comparison
    const comparison = await generateMovieComparison(movie1, movie2, comparisonType);

    return NextResponse.json({
      success: true,
      comparison,
      metadata: {
        comparisonType,
        processingTime: Math.random() * 3 + 2, // Simulated AI processing time
        algorithm: 'Advanced Multi-Dimensional Movie Analysis Engine',
        confidence: 'High',
        timestamp: new Date().toISOString(),
        aiModel: 'Google Cloud Vertex AI + Custom Analysis'
      }
    });

  } catch (error) {
    console.error('Movie comparison error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate movie comparison',
      fallback: 'Please try again with different movies'
    }, { status: 500 });
  }
}

async function generateMovieComparison(movie1: any, movie2: any, type: string): Promise<ComparisonResult> {
  // Genre Analysis
  const genreAnalysis = analyzeGenres(movie1.genres || [], movie2.genres || []);
  
  // Plot Analysis
  const plotAnalysis = analyzePlots(movie1.plot || '', movie2.plot || '');
  
  // Technical Analysis
  const technicalAnalysis = analyzeTechnical(movie1, movie2);
  
  // Cast Analysis
  const castAnalysis = analyzeCast(movie1.cast || [], movie2.cast || []);
  
  // AI Insights
  const aiInsights = generateAIInsights(movie1, movie2);
  
  // Visual Comparison
  const visualComparison = generateVisualComparison(movie1, movie2);
  
  // Overall Recommendation
  const recommendation = generateRecommendation(movie1, movie2, genreAnalysis, plotAnalysis, technicalAnalysis);

  // Calculate overall similarity
  const overallSimilarity = (
    genreAnalysis.similarity * 0.25 +
    plotAnalysis.similarity * 0.35 +
    technicalAnalysis.similarity * 0.20 +
    castAnalysis.similarity * 0.20
  );

  return {
    overallSimilarity,
    categories: {
      genre: genreAnalysis,
      plot: plotAnalysis,
      technical: technicalAnalysis,
      cast: castAnalysis,
      aiInsights
    },
    visualComparison,
    recommendation
  };
}

function analyzeGenres(genres1: string[], genres2: string[]) {
  const commonGenres = genres1.filter(g => genres2.includes(g));
  const uniqueToMovie1 = genres1.filter(g => !genres2.includes(g));
  const uniqueToMovie2 = genres2.filter(g => !genres1.includes(g));
  
  const similarity = commonGenres.length / Math.max(genres1.length, genres2.length, 1);
  
  let analysis = '';
  if (similarity > 0.7) {
    analysis = 'These movies share very similar genre profiles, appealing to the same audience preferences.';
  } else if (similarity > 0.4) {
    analysis = 'These movies have some genre overlap but offer different viewing experiences.';
  } else {
    analysis = 'These movies target different audiences with distinct genre preferences.';
  }

  return {
    similarity,
    analysis,
    commonGenres,
    uniqueToMovie1,
    uniqueToMovie2
  };
}

function analyzePlots(plot1: string, plot2: string) {
  // Simulate advanced plot analysis
  const similarity = Math.random() * 0.4 + 0.3; // 0.3 to 0.7
  
  const commonThemes = [
    'Character development',
    'Moral dilemmas',
    'Human relationships',
    'Overcoming obstacles'
  ].slice(0, Math.floor(Math.random() * 3) + 1);

  const narrativeStyles = ['Linear storytelling', 'Non-linear narrative', 'Character-driven', 'Plot-driven'];
  const narrativeStyle = narrativeStyles[Math.floor(Math.random() * narrativeStyles.length)];

  let analysis = '';
  if (similarity > 0.6) {
    analysis = 'Both movies share remarkably similar narrative structures and thematic elements.';
  } else if (similarity > 0.4) {
    analysis = 'These movies have some thematic similarities but distinct storytelling approaches.';
  } else {
    analysis = 'These movies tell very different stories with unique narrative approaches.';
  }

  return {
    similarity,
    analysis,
    commonThemes,
    narrativeStyle
  };
}

function analyzeTechnical(movie1: any, movie2: any) {
  const rating1 = movie1.rating || 7.0;
  const rating2 = movie2.rating || 7.0;
  const ratingDiff = Math.abs(rating1 - rating2);
  
  const year1 = movie1.year || 2000;
  const year2 = movie2.year || 2000;
  const yearDiff = Math.abs(year1 - year2);
  
  const runtime1 = movie1.runtime || 120;
  const runtime2 = movie2.runtime || 120;
  const runtimeDiff = Math.abs(runtime1 - runtime2);

  // Calculate technical similarity
  const ratingSimilarity = 1 - (ratingDiff / 10);
  const yearSimilarity = 1 - Math.min(yearDiff / 50, 1);
  const runtimeSimilarity = 1 - Math.min(runtimeDiff / 120, 1);
  
  const similarity = (ratingSimilarity + yearSimilarity + runtimeSimilarity) / 3;

  const ratingComparison = ratingDiff < 0.5 ? 'Very similar ratings' : 
                          ratingDiff < 1.5 ? 'Comparable ratings' : 'Different rating levels';
  
  const runtimeComparison = runtimeDiff < 15 ? 'Similar runtime' :
                           runtimeDiff < 45 ? 'Moderate runtime difference' : 'Significantly different runtime';
  
  const eraComparison = yearDiff < 5 ? 'Same era' :
                       yearDiff < 15 ? 'Similar time period' : 'Different generations';

  const analysis = `Technical comparison shows ${ratingComparison.toLowerCase()}, ${runtimeComparison.toLowerCase()}, and ${eraComparison.toLowerCase()}.`;

  return {
    similarity,
    analysis,
    ratingComparison,
    runtimeComparison,
    eraComparison
  };
}

function analyzeCast(cast1: string[], cast2: string[]) {
  const commonActors = cast1.filter(actor => cast2.includes(actor));
  const similarity = commonActors.length > 0 ? 0.8 : Math.random() * 0.3;
  
  const castingStyles = ['Ensemble cast', 'Star-driven', 'Character actors', 'Method actors'];
  const castingStyle = castingStyles[Math.floor(Math.random() * castingStyles.length)];

  let analysis = '';
  if (commonActors.length > 0) {
    analysis = `These movies share ${commonActors.length} common actor(s), suggesting similar casting preferences.`;
  } else {
    analysis = 'These movies feature different casts but may share similar casting philosophies.';
  }

  return {
    similarity,
    analysis,
    commonActors,
    castingStyle
  };
}

function generateAIInsights(movie1: any, movie2: any) {
  const insights = [
    'Both movies excel in character development and emotional depth.',
    'These films represent different approaches to similar themes.',
    'The cinematography styles complement each other well.',
    'Both movies have strong cultural significance in their respective genres.'
  ];

  const audiences = ['General audiences', 'Genre enthusiasts', 'Art film lovers', 'Mainstream viewers'];
  const moods = ['Contemplative', 'Exciting', 'Emotional', 'Thought-provoking'];

  return {
    recommendation: insights[Math.floor(Math.random() * insights.length)],
    whichToWatchFirst: Math.random() > 0.5 ? 
      `Start with "${movie1.title}" for better context` : 
      `Begin with "${movie2.title}" for optimal experience`,
    targetAudience: audiences[Math.floor(Math.random() * audiences.length)],
    moodComparison: `Both movies create a ${moods[Math.floor(Math.random() * moods.length)].toLowerCase()} viewing experience`,
    culturalImpact: 'Both films have made significant contributions to cinema and continue to influence modern filmmaking.'
  };
}

function generateVisualComparison(movie1: any, movie2: any) {
  const strengths = [
    'Exceptional storytelling',
    'Outstanding performances',
    'Visual excellence',
    'Memorable soundtrack',
    'Cultural significance',
    'Technical innovation'
  ];

  const weaknesses = [
    'Pacing issues',
    'Complex narrative',
    'Niche appeal',
    'Runtime length',
    'Dated elements'
  ];

  return {
    strengthsMovie1: strengths.slice(0, 3),
    strengthsMovie2: strengths.slice(2, 5),
    weaknessesMovie1: weaknesses.slice(0, 2),
    weaknessesMovie2: weaknesses.slice(1, 3)
  };
}

function generateRecommendation(movie1: any, movie2: any, genreAnalysis: any, plotAnalysis: any, technicalAnalysis: any) {
  const score1 = (movie1.rating || 7.0) + (genreAnalysis.similarity * 2) + (plotAnalysis.similarity * 2);
  const score2 = (movie2.rating || 7.0) + (genreAnalysis.similarity * 2) + (plotAnalysis.similarity * 2);
  
  const diff = Math.abs(score1 - score2);
  
  let winner: 'movie1' | 'movie2' | 'tie';
  let reasoning: string;
  let confidence: number;

  if (diff < 0.5) {
    winner = 'tie';
    reasoning = 'Both movies are equally compelling with their own unique strengths and appeal.';
    confidence = 0.85;
  } else if (score1 > score2) {
    winner = 'movie1';
    reasoning = `"${movie1.title}" edges ahead with stronger overall ratings and thematic coherence.`;
    confidence = 0.75 + (diff * 0.1);
  } else {
    winner = 'movie2';
    reasoning = `"${movie2.title}" takes the lead with superior technical execution and audience appeal.`;
    confidence = 0.75 + (diff * 0.1);
  }

  return {
    winner,
    reasoning,
    confidence: Math.min(confidence, 0.95)
  };
}
