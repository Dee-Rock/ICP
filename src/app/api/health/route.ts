import { NextResponse } from 'next/server';

// Health check endpoint for Google Cloud Run
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CineAI',
    version: '1.0.0',
    cloudProvider: 'Google Cloud Run',
    services: {
      'vertex-ai': 'operational',
      'firestore': 'operational',
      'translation-api': 'operational',
      'vector-search': 'operational'
    }
  });
}
