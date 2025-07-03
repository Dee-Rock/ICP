import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type MovieId = string;
export interface ProfileUpdate {
  'bio' : [] | [string],
  'username' : [] | [string],
  'preferences' : [] | [UserPreferences],
  'favoriteGenres' : [] | [Array<string>],
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : UserProfile } |
  { 'err' : string };
export type UserId = Principal;
export interface UserPreferences {
  'emailNotifications' : boolean,
  'preferredLanguages' : Array<string>,
  'publicProfile' : boolean,
  'contentRating' : string,
  'shareWatchHistory' : boolean,
  'aiRecommendations' : boolean,
}
export interface UserProfile {
  'id' : UserId,
  'bio' : [] | [string],
  'username' : [] | [string],
  'createdAt' : bigint,
  'watchlist' : Array<MovieId>,
  'reputation' : bigint,
  'preferences' : UserPreferences,
  'favoriteGenres' : Array<string>,
  'stats' : UserStats,
  'isVerified' : boolean,
  'watchedMovies' : Array<MovieId>,
  'lastActive' : bigint,
}
export interface UserStats {
  'totalRatings' : bigint,
  'daysActive' : bigint,
  'tokensEarned' : bigint,
  'moviesWatched' : bigint,
  'averageRating' : number,
  'helpfulVotes' : bigint,
  'totalReviews' : bigint,
}
export interface WatchHistoryEntry {
  'watchTime' : [] | [bigint],
  'watchedAt' : bigint,
  'movieId' : MovieId,
  'completed' : boolean,
  'rating' : [] | [number],
}
export interface _SERVICE {
  'addToWatchHistory' : ActorMethod<
    [MovieId, [] | [number], [] | [bigint], boolean],
    Result
  >,
  'addToWatchlist' : ActorMethod<[MovieId], Result>,
  'followUser' : ActorMethod<[UserId], Result>,
  'getFollowers' : ActorMethod<[UserId], Array<UserId>>,
  'getFollowing' : ActorMethod<[UserId], Array<UserId>>,
  'getOrCreateProfile' : ActorMethod<[], UserProfile>,
  'getPlatformStats' : ActorMethod<
    [],
    {
      'activeUsers' : bigint,
      'totalWatchlistItems' : bigint,
      'totalMoviesWatched' : bigint,
      'totalUsers' : bigint,
    }
  >,
  'getProfile' : ActorMethod<[UserId], [] | [UserProfile]>,
  'getProfileByUsername' : ActorMethod<[string], [] | [UserProfile]>,
  'getWatchHistory' : ActorMethod<[UserId], Array<WatchHistoryEntry>>,
  'removeFromWatchlist' : ActorMethod<[MovieId], Result>,
  'unfollowUser' : ActorMethod<[UserId], Result>,
  'updateProfile' : ActorMethod<[ProfileUpdate], Result_1>,
  'updateUserStats' : ActorMethod<
    [
      UserId,
      {
        'totalRatings' : [] | [bigint],
        'tokensEarned' : [] | [bigint],
        'averageRating' : [] | [number],
        'helpfulVotes' : [] | [bigint],
        'totalReviews' : [] | [bigint],
      },
    ],
    Result
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
