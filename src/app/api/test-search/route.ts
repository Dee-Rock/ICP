import { NextResponse } from 'next/server';
import { getMoviesCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing basic search...');
    const collection = await getMoviesCollection();
    
    // Test 1: Get any movie
    const anyMovie = await collection.findOne({});
    console.log('Any movie found:', !!anyMovie);
    
    // Test 2: Count all movies
    const totalMovies = await collection.countDocuments({});
    console.log('Total movies:', totalMovies);
    
    // Test 3: Find movies with title field
    const moviesWithTitle = await collection.find({ title: { $exists: true } }).limit(5).toArray();
    console.log('Movies with title:', moviesWithTitle.length);
    
    // Test 4: Search for common words
    const commonSearches = ['the', 'love', 'man', 'war'];
    const searchResults = {};
    
    for (const term of commonSearches) {
      const count = await collection.countDocuments({
        title: { $regex: new RegExp(term, 'i') }
      });
      searchResults[term] = count;
    }
    
    // Test 5: Get sample titles
    const sampleTitles = await collection.find({}, { projection: { title: 1, _id: 0 } }).limit(10).toArray();
    
    return NextResponse.json({
      success: true,
      totalMovies,
      anyMovieExists: !!anyMovie,
      moviesWithTitleCount: moviesWithTitle.length,
      searchResults,
      sampleTitles: sampleTitles.map(m => m.title),
      sampleMovieFields: anyMovie ? Object.keys(anyMovie) : []
    });
    
  } catch (error) {
    console.error('Test search error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
