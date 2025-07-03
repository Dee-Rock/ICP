export const idlFactory = ({ IDL }) => {
  const MovieId = IDL.Text;
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const UserId = IDL.Principal;
  const UserPreferences = IDL.Record({
    'emailNotifications' : IDL.Bool,
    'preferredLanguages' : IDL.Vec(IDL.Text),
    'publicProfile' : IDL.Bool,
    'contentRating' : IDL.Text,
    'shareWatchHistory' : IDL.Bool,
    'aiRecommendations' : IDL.Bool,
  });
  const UserStats = IDL.Record({
    'totalRatings' : IDL.Nat,
    'daysActive' : IDL.Nat,
    'tokensEarned' : IDL.Nat,
    'moviesWatched' : IDL.Nat,
    'averageRating' : IDL.Float64,
    'helpfulVotes' : IDL.Nat,
    'totalReviews' : IDL.Nat,
  });
  const UserProfile = IDL.Record({
    'id' : UserId,
    'bio' : IDL.Opt(IDL.Text),
    'username' : IDL.Opt(IDL.Text),
    'createdAt' : IDL.Int,
    'watchlist' : IDL.Vec(MovieId),
    'reputation' : IDL.Nat,
    'preferences' : UserPreferences,
    'favoriteGenres' : IDL.Vec(IDL.Text),
    'stats' : UserStats,
    'isVerified' : IDL.Bool,
    'watchedMovies' : IDL.Vec(MovieId),
    'lastActive' : IDL.Int,
  });
  const WatchHistoryEntry = IDL.Record({
    'watchTime' : IDL.Opt(IDL.Nat),
    'watchedAt' : IDL.Int,
    'movieId' : MovieId,
    'completed' : IDL.Bool,
    'rating' : IDL.Opt(IDL.Nat8),
  });
  const ProfileUpdate = IDL.Record({
    'bio' : IDL.Opt(IDL.Text),
    'username' : IDL.Opt(IDL.Text),
    'preferences' : IDL.Opt(UserPreferences),
    'favoriteGenres' : IDL.Opt(IDL.Vec(IDL.Text)),
  });
  const Result_1 = IDL.Variant({ 'ok' : UserProfile, 'err' : IDL.Text });
  return IDL.Service({
    'addToWatchHistory' : IDL.Func(
        [MovieId, IDL.Opt(IDL.Nat8), IDL.Opt(IDL.Nat), IDL.Bool],
        [Result],
        [],
      ),
    'addToWatchlist' : IDL.Func([MovieId], [Result], []),
    'followUser' : IDL.Func([UserId], [Result], []),
    'getFollowers' : IDL.Func([UserId], [IDL.Vec(UserId)], ['query']),
    'getFollowing' : IDL.Func([UserId], [IDL.Vec(UserId)], ['query']),
    'getOrCreateProfile' : IDL.Func([], [UserProfile], []),
    'getPlatformStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'activeUsers' : IDL.Nat,
            'totalWatchlistItems' : IDL.Nat,
            'totalMoviesWatched' : IDL.Nat,
            'totalUsers' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getProfile' : IDL.Func([UserId], [IDL.Opt(UserProfile)], ['query']),
    'getProfileByUsername' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(UserProfile)],
        ['query'],
      ),
    'getWatchHistory' : IDL.Func(
        [UserId],
        [IDL.Vec(WatchHistoryEntry)],
        ['query'],
      ),
    'removeFromWatchlist' : IDL.Func([MovieId], [Result], []),
    'unfollowUser' : IDL.Func([UserId], [Result], []),
    'updateProfile' : IDL.Func([ProfileUpdate], [Result_1], []),
    'updateUserStats' : IDL.Func(
        [
          UserId,
          IDL.Record({
            'totalRatings' : IDL.Opt(IDL.Nat),
            'tokensEarned' : IDL.Opt(IDL.Nat),
            'averageRating' : IDL.Opt(IDL.Float64),
            'helpfulVotes' : IDL.Opt(IDL.Nat),
            'totalReviews' : IDL.Opt(IDL.Nat),
          }),
        ],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
