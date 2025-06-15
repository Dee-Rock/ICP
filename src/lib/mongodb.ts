import { MongoClient, Db, Collection } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Helper function to get the database
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('sample_mflix');
}

// Helper function to get the movies collection
export async function getMoviesCollection(): Promise<Collection> {
  const db = await getDatabase();

  // Try different possible collection names
  const possibleNames = ['embedded_movies', 'movies'];

  for (const name of possibleNames) {
    try {
      const collection = db.collection(name);
      const count = await collection.countDocuments({}, { limit: 1 });
      if (count > 0) {
        console.log(`Using collection: ${name}`);
        return collection;
      }
    } catch {
      console.log(`Collection ${name} not found or empty`);
    }
  }

  // Default to embedded_movies if nothing else works
  console.log('Using default collection: embedded_movies');
  return db.collection('embedded_movies');
}

// Types for our movie data
export interface Movie {
  _id: string;
  title: string;
  plot?: string;
  genres?: string[];
  runtime?: number;
  cast?: string[];
  directors?: string[];
  writers?: string[];
  year?: number;
  imdb?: {
    rating?: number;
    votes?: number;
    id?: number;
  };
  poster?: string;
  fullplot?: string;
  countries?: string[];
  released?: Date;
  rated?: string;
  awards?: {
    wins?: number;
    nominations?: number;
    text?: string;
  };
  plot_embedding?: number[];
  streamingOn?: string[];
  trailerUrl?: string;
}

export interface SearchResult {
  movies: Movie[];
  total: number;
  page: number;
  limit: number;
}
