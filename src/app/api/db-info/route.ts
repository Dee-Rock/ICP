import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('Connected successfully');
    
    // List all databases
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();
    console.log('Databases found:', databases.databases.map(db => db.name));
    
    // Check specific database
    const db = client.db('sample_mflix');
    const collections = await db.listCollections().toArray();
    console.log('Collections in sample_mflix:', collections.map(col => col.name));
    
    return NextResponse.json({
      success: true,
      databases: databases.databases.map(db => db.name),
      sampleMflixCollections: collections.map(col => col.name),
      connectionString: process.env.MONGODB_URI ? 'Set' : 'Not set'
    });
    
  } catch (error) {
    console.error('Database info error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        connectionString: process.env.MONGODB_URI ? 'Set' : 'Not set'
      },
      { status: 500 }
    );
  }
}
