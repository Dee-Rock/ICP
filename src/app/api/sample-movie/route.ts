import { NextResponse } from 'next/server';
import { getMoviesCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Getting sample movie...');
    const collection = await getMoviesCollection();
    
    // Get a sample movie to see the data structure
    const sampleMovie = await collection.findOne({});
    console.log('Sample movie:', JSON.stringify(sampleMovie, null, 2));
    
    // Get field names
    const fieldNames = sampleMovie ? Object.keys(sampleMovie) : [];
    
    // Count total movies
    const totalCount = await collection.countDocuments({});
    
    return NextResponse.json({
      success: true,
      totalMovies: totalCount,
      sampleMovie,
      availableFields: fieldNames,
    });
    
  } catch (error) {
    console.error('Sample movie error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
