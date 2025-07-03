import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Account = Principal;
export type Balance = bigint;
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : Balance } |
  { 'err' : string };
export interface RewardTransaction {
  'id' : bigint,
  'recipient' : Account,
  'description' : string,
  'rewardType' : RewardType,
  'timestamp' : bigint,
  'amount' : Balance,
}
export type RewardType = { 'Achievement' : null } |
  { 'QualityReview' : null } |
  { 'DailyLogin' : null } |
  { 'MovieReview' : null } |
  { 'HelpfulVote' : null } |
  { 'Referral' : null };
export interface TransferArgs {
  'to' : Account,
  'memo' : [] | [string],
  'amount' : Balance,
}
export type TransferError = { 'InvalidAccount' : null } |
  { 'InsufficientBalance' : null } |
  { 'Unauthorized' : null } |
  { 'Other' : string };
export type TransferResult = { 'ok' : Balance } |
  { 'err' : TransferError };
export interface _SERVICE {
  'batchRewardUsers' : ActorMethod<
    [Array<[Account, RewardType, string]>],
    Array<Result_1>
  >,
  'getAllBalances' : ActorMethod<[], Array<[Account, Balance]>>,
  'getOwner' : ActorMethod<[], Principal>,
  'getRewardStats' : ActorMethod<
    [],
    {
      'rewardsByType' : Array<[RewardType, bigint]>,
      'totalRewardsDistributed' : Balance,
      'totalTransactions' : bigint,
    }
  >,
  'getTotalRewardsEarned' : ActorMethod<[Account], Balance>,
  'getUserRewardHistory' : ActorMethod<[Account], Array<RewardTransaction>>,
  'icrc1_balance_of' : ActorMethod<[Account], Balance>,
  'icrc1_decimals' : ActorMethod<[], number>,
  'icrc1_name' : ActorMethod<[], string>,
  'icrc1_symbol' : ActorMethod<[], string>,
  'icrc1_total_supply' : ActorMethod<[], Balance>,
  'icrc1_transfer' : ActorMethod<[TransferArgs], TransferResult>,
  'rewardUser' : ActorMethod<[Account, RewardType, string], Result_1>,
  'setOwner' : ActorMethod<[Principal], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
