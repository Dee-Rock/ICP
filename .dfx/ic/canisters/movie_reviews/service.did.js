export const idlFactory = ({ IDL }) => {
  const MovieId = IDL.Text;
  const ReviewInput = IDL.Record({
    'title' : IDL.Text,
    'content' : IDL.Text,
    'movieId' : MovieId,
    'rating' : IDL.Nat8,
  });
  const ReviewId = IDL.Text;
  const Result_1 = IDL.Variant({ 'ok' : ReviewId, 'err' : IDL.Text });
  const UserId = IDL.Principal;
  const Review = IDL.Record({
    'id' : ReviewId,
    'title' : IDL.Text,
    'verified' : IDL.Bool,
    'content' : IDL.Text,
    'reportCount' : IDL.Nat,
    'userId' : UserId,
    'movieId' : MovieId,
    'timestamp' : IDL.Int,
    'rating' : IDL.Nat8,
    'helpfulVotes' : IDL.Nat,
  });
  const UserStats = IDL.Record({
    'reputation' : IDL.Nat,
    'averageRating' : IDL.Float64,
    'helpfulVotes' : IDL.Nat,
    'totalReviews' : IDL.Nat,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'createReview' : IDL.Func([ReviewInput], [Result_1], []),
    'getAllReviews' : IDL.Func([], [IDL.Vec(Review)], ['query']),
    'getMovieRatingSummary' : IDL.Func(
        [MovieId],
        [
          IDL.Record({
            'averageRating' : IDL.Float64,
            'totalReviews' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getMovieReviews' : IDL.Func([MovieId], [IDL.Vec(Review)], ['query']),
    'getReview' : IDL.Func([ReviewId], [IDL.Opt(Review)], ['query']),
    'getUserReviews' : IDL.Func([UserId], [IDL.Vec(Review)], ['query']),
    'getUserStats' : IDL.Func([UserId], [IDL.Opt(UserStats)], ['query']),
    'reportReview' : IDL.Func([ReviewId], [Result], []),
    'voteHelpful' : IDL.Func([ReviewId], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
