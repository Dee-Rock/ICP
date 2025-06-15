'use client';

import { Movie } from '@/lib/mongodb';
// Using emoji icons instead of lucide-react for compatibility
import Image from 'next/image';

interface MovieCardProps {
  movie: Movie;
  onMovieClick?: (movie: Movie) => void;
}

export default function MovieCard({ movie, onMovieClick }: MovieCardProps) {
  const handleClick = () => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  };

  const formatRuntime = (runtime?: number) => {
    if (!runtime) return 'N/A';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getRatingColor = (rating?: number) => {
    if (!rating) return 'text-gray-400';
    if (rating >= 8) return 'text-green-500';
    if (rating >= 7) return 'text-yellow-500';
    if (rating >= 6) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div
      className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:shadow-purple-500/20 hover:scale-[1.05] hover:border-purple-500/50 backdrop-blur-lg ${
        onMovieClick ? 'cursor-pointer group' : ''
      }`}
      onClick={handleClick}
    >
      {/* Movie Poster */}
      <div className="relative h-80 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
        {movie.poster ? (
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">🎬</div>
              <div className="text-sm font-medium">No Poster</div>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Rating Badge */}
        {movie.imdb?.rating && (
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-xl flex items-center gap-2 shadow-lg">
            <span className="text-yellow-400 text-lg">⭐</span>
            <span className={`text-sm font-bold ${getRatingColor(movie.imdb.rating)}`}>
              {movie.imdb.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <span className="text-white text-2xl ml-1">▶️</span>
          </div>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-6">
        <h3 className="font-bold text-xl mb-3 line-clamp-2 text-white group-hover:text-purple-300 transition-colors duration-300">
          {movie.title}
        </h3>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {movie.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30 backdrop-blur-sm font-medium"
              >
                {genre}
              </span>
            ))}
            {movie.genres.length > 3 && (
              <span className="px-3 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full border border-gray-600 backdrop-blur-sm">
                +{movie.genres.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Movie Details */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          {movie.year && (
            <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1 rounded-full">
              <span>📅</span>
              <span className="font-medium">{movie.year}</span>
            </div>
          )}
          {movie.runtime && (
            <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1 rounded-full">
              <span>⏰</span>
              <span className="font-medium">{formatRuntime(movie.runtime)}</span>
            </div>
          )}
        </div>

        {/* Plot */}
        {movie.plot && (
          <p className="text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
            {movie.plot}
          </p>
        )}

        {/* Streaming Availability */}
        {movie.streamingOn && movie.streamingOn.length > 0 && (
          <div className="mb-3">
            <div className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1">
              <span>📺</span>
              <span>Watch on:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {movie.streamingOn.slice(0, 3).map((platform) => (
                <span
                  key={platform}
                  className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 text-xs rounded-full border border-green-500/30 backdrop-blur-sm font-medium"
                >
                  {platform}
                </span>
              ))}
              {movie.streamingOn.length > 3 && (
                <span className="px-3 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full border border-gray-600">
                  +{movie.streamingOn.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Cast */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="text-xs text-gray-400 bg-gray-800/50 p-3 rounded-lg">
            <span className="font-semibold text-gray-300">Cast: </span>
            <span className="text-gray-400">
              {movie.cast.slice(0, 3).join(', ')}
              {movie.cast.length > 3 && '...'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
