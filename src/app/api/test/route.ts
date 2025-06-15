import { NextResponse } from 'next/server';
import { getDatabase, getMoviesCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test database connection
    await getDatabase();
    console.log('Database connected successfully');
    
    // Test collection access
    const collection = await getMoviesCollection();
    console.log('Collection accessed successfully');
    
    // Get a sample movie to test
    const sampleMovie = await collection.findOne({});
    console.log('Sample movie found:', sampleMovie ? 'Yes' : 'No');
    
    // Count total movies
    const totalMovies = await collection.countDocuments({});
    console.log('Total movies in collection:', totalMovies);
    
    // Test a simple search
    const searchResult = await collection.findOne({ 
      title: { $regex: 'Godfather', $options: 'i' } 
    });
    console.log('Search test result:', searchResult ? 'Found movie' : 'No movie found');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      stats: {
        totalMovies,
        sampleMovieExists: !!sampleMovie,
        searchTestPassed: !!searchResult,
        sampleMovieTitle: sampleMovie?.title || 'No sample movie',
      }
    });
    
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      },
      { status: 500 }
    );
  }
}
