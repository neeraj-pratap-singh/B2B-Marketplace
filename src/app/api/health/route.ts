import { NextResponse } from 'next/server';
import { connectMongoose } from '@/lib/mongodb';

export async function GET() {
  try {
    // Check database connection
    await connectMongoose();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        api: 'operational'
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      services: {
        database: 'disconnected',
        api: 'operational'
      }
    }, { status: 503 });
  }
} 