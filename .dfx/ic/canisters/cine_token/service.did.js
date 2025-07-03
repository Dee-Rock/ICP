export const idlFactory = ({ IDL }) => {
  const Account = IDL.Principal;
  const RewardType = IDL.Variant({
    'Achievement' : IDL.Null,
    'QualityReview' : IDL.Null,
    'DailyLogin' : IDL.Null,
    'MovieReview' : IDL.Null,
    'HelpfulVote' : IDL.Null,
    'Referral' : IDL.Null,
  });
  const Balance = IDL.Nat;
  const Result_1 = IDL.Variant({ 'ok' : Balance, 'err' : IDL.Text });
  const RewardTransaction = IDL.Record({
    'id' : IDL.Nat,
    'recipient' : Account,
    'description' : IDL.Text,
    'rewardType' : RewardType,
    'timestamp' : IDL.Int,
    'amount' : Balance,
  });
  const TransferArgs = IDL.Record({
    'to' : Account,
    'memo' : IDL.Opt(IDL.Text),
    'amount' : Balance,
  });
  const TransferError = IDL.Variant({
    'InvalidAccount' : IDL.Null,
    'InsufficientBalance' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'Other' : IDL.Text,
  });
  const TransferResult = IDL.Variant({ 'ok' : Balance, 'err' : TransferError });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'batchRewardUsers' : IDL.Func(
        [IDL.Vec(IDL.Tuple(Account, RewardType, IDL.Text))],
        [IDL.Vec(Result_1)],
        [],
      ),
    'getAllBalances' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(Account, Balance))],
        ['query'],
      ),
    'getOwner' : IDL.Func([], [IDL.Principal], ['query']),
    'getRewardStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'rewardsByType' : IDL.Vec(IDL.Tuple(RewardType, IDL.Nat)),
            'totalRewardsDistributed' : Balance,
            'totalTransactions' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getTotalRewardsEarned' : IDL.Func([Account], [Balance], []),
    'getUserRewardHistory' : IDL.Func(
        [Account],
        [IDL.Vec(RewardTransaction)],
        ['query'],
      ),
    'icrc1_balance_of' : IDL.Func([Account], [Balance], ['query']),
    'icrc1_decimals' : IDL.Func([], [IDL.Nat8], ['query']),
    'icrc1_name' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_symbol' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_total_supply' : IDL.Func([], [Balance], ['query']),
    'icrc1_transfer' : IDL.Func([TransferArgs], [TransferResult], []),
    'rewardUser' : IDL.Func([Account, RewardType, IDL.Text], [Result_1], []),
    'setOwner' : IDL.Func([IDL.Principal], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
