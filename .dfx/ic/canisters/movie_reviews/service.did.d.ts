import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type MovieId = string;
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : ReviewId } |
  { 'err' : string };
export interface Review {
  'id' : ReviewId,
  'title' : string,
  'verified' : boolean,
  'content' : string,
  'reportCount' : bigint,
  'userId' : UserId,
  'movieId' : MovieId,
  'timestamp' : bigint,
  'rating' : number,
  'helpfulVotes' : bigint,
}
export type ReviewId = string;
export interface ReviewInput {
  'title' : string,
  'content' : string,
  'movieId' : MovieId,
  'rating' : number,
}
export type UserId = Principal;
export interface UserStats {
  'reputation' : bigint,
  'averageRating' : number,
  'helpfulVotes' : bigint,
  'totalReviews' : bigint,
}
export interface _SERVICE {
  'createReview' : ActorMethod<[ReviewInput], Result_1>,
  'getAllReviews' : ActorMethod<[], Array<Review>>,
  'getMovieRatingSummary' : ActorMethod<
    [MovieId],
    { 'averageRating' : number, 'totalReviews' : bigint }
  >,
  'getMovieReviews' : ActorMethod<[MovieId], Array<Review>>,
  'getReview' : ActorMethod<[ReviewId], [] | [Review]>,
  'getUserReviews' : ActorMethod<[UserId], Array<Review>>,
  'getUserStats' : ActorMethod<[UserId], [] | [UserStats]>,
  'reportReview' : ActorMethod<[ReviewId], Result>,
  'voteHelpful' : ActorMethod<[ReviewId], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
