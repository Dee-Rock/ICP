import Time "mo:base/Time";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat32 "mo:base/Nat32";

actor CineToken {

    // Types
    public type Account = Principal;
    public type Balance = Nat;
    public type TransferArgs = {
        to: Account;
        amount: Balance;
        memo: ?Text;
    };

    public type TransferResult = Result.Result<Balance, TransferError>;

    public type TransferError = {
        #InsufficientBalance;
        #InvalidAccount;
        #Unauthorized;
        #Other: Text;
    };

    public type RewardType = {
        #MovieReview;
        #QualityReview;
        #HelpfulVote;
        #DailyLogin;
        #Referral;
        #Achievement;
    };

    public type RewardTransaction = {
        id: Nat;
        recipient: Account;
        amount: Balance;
        rewardType: RewardType;
        description: Text;
        timestamp: Int;
    };

    // Token Metadata
    let name: Text = "CineAI Token";
    let symbol: Text = "CINE";
    let decimals: Nat8 = 8;
    let totalSupply: Balance = 1_000_000_000_000_000;

    // State
    private stable var owner: Principal = Principal.fromText("taxkf-xu636-ea7he-6k3nk-5gk2i-p4qxr-uvn3u-mpzvl-5nf3l-gleoo-3qe"); // Replace with actual owner
    private var balances = Map.HashMap<Account, Balance>(100, Principal.equal, Principal.hash);
    private var allowances = Map.HashMap<(Account, Account), Balance>(
        100,
        func(a, b) = Principal.equal(a.0, b.0) and Principal.equal(a.1, b.1),
        func(a) = Principal.hash(a.0)
    );
    private stable var nextTransactionId: Nat = 0;
    private var rewardHistory = Map.HashMap<Nat, RewardTransaction>(
        100,
        Nat.equal,
        func(n: Nat): Nat32 = Nat32.fromNat(n % (2 ** 32))
    );

    // Reward amounts
    let MOVIE_REVIEW_REWARD: Balance = 10_000_000;
    let QUALITY_REVIEW_REWARD: Balance = 50_000_000;
    let HELPFUL_VOTE_REWARD: Balance = 5_000_000;
    let DAILY_LOGIN_REWARD: Balance = 2_000_000;
    let REFERRAL_REWARD: Balance = 100_000_000;
    let ACHIEVEMENT_REWARD: Balance = 25_000_000;

    // ICRC-1 Standard Functions
    public query func icrc1_name(): async Text { name };
    public query func icrc1_symbol(): async Text { symbol };
    public query func icrc1_decimals(): async Nat8 { decimals };
    public query func icrc1_total_supply(): async Balance { totalSupply };

    public query func icrc1_balance_of(account: Account): async Balance {
        switch (balances.get(account)) {
            case (?balance) balance;
            case null 0;
        }
    };

    public shared(msg) func icrc1_transfer(args: TransferArgs): async TransferResult {
        let from = msg.caller;
        let to = args.to;
        let amount = args.amount;

        let fromBalance = switch (balances.get(from)) {
            case (?balance) balance;
            case null 0;
        };

        if (fromBalance < amount) {
            return #err(#InsufficientBalance);
        };

        balances.put(from, fromBalance - amount);

        let toBalance = switch (balances.get(to)) {
            case (?balance) balance;
            case null 0;
        };
        balances.put(to, toBalance + amount);

        #ok(fromBalance - amount)
    };

    // Reward System Functions
    public shared(msg) func rewardUser(recipient: Account, rewardType: RewardType, description: Text): async Result.Result<Balance, Text> {
        let amount = switch (rewardType) {
            case (#MovieReview) MOVIE_REVIEW_REWARD;
            case (#QualityReview) QUALITY_REVIEW_REWARD;
            case (#HelpfulVote) HELPFUL_VOTE_REWARD;
            case (#DailyLogin) DAILY_LOGIN_REWARD;
            case (#Referral) REFERRAL_REWARD;
            case (#Achievement) ACHIEVEMENT_REWARD;
        };

        let ownerBalance = switch (balances.get(owner)) {
            case (?balance) balance;
            case null 0;
        };

        if (ownerBalance < amount) {
            return #err("Insufficient reward pool balance");
        };

        balances.put(owner, ownerBalance - amount);

        let recipientBalance = switch (balances.get(recipient)) {
            case (?balance) balance;
            case null 0;
        };
        balances.put(recipient, recipientBalance + amount);

        let transaction: RewardTransaction = {
            id = nextTransactionId;
            recipient = recipient;
            amount = amount;
            rewardType = rewardType;
            description = description;
            timestamp = Time.now();
        };

        rewardHistory.put(nextTransactionId, transaction);
        nextTransactionId += 1;

        #ok(recipientBalance + amount)
    };

    public shared(msg) func batchRewardUsers(rewards: [(Account, RewardType, Text)]): async [Result.Result<Balance, Text>] {
        let results = Array.init<Result.Result<Balance, Text>>(Array.size(rewards), #err("Not processed"));
        var i = 0;
        for ((recipient, rewardType, description) in rewards.vals()) {
            results[i] := await rewardUser(recipient, rewardType, description);
            i += 1;
        };
        Array.freeze(results)
    };

    public query func getUserRewardHistory(user: Account): async [RewardTransaction] {
        let allRewards = Iter.toArray(rewardHistory.vals());
        Array.filter<RewardTransaction>(allRewards, func(reward) = reward.recipient == user)
    };

    public shared(msg) func getTotalRewardsEarned(user: Account): async Balance {
        let userRewards = await getUserRewardHistory(user);
        Array.foldLeft<RewardTransaction, Balance>(
            userRewards,
            0,
            func(acc, reward) = acc + reward.amount
        )
    };

    public query func getRewardStats(): async {
        totalRewardsDistributed: Balance;
        totalTransactions: Nat;
        rewardsByType: [(RewardType, Nat)];
    } {
        let allRewards = Iter.toArray(rewardHistory.vals());

        let totalRewardsDistributed: Balance = Array.foldLeft<RewardTransaction, Balance>(
            allRewards,
            0,
            func(acc, reward) = acc + reward.amount
        );

        let movieReviewCount : Nat = Array.size(Array.filter<RewardTransaction>(allRewards, func(r) = r.rewardType == #MovieReview));
        let qualityReviewCount : Nat = Array.size(Array.filter<RewardTransaction>(allRewards, func(r) = r.rewardType == #QualityReview));
        let helpfulVoteCount : Nat = Array.size(Array.filter<RewardTransaction>(allRewards, func(r) = r.rewardType == #HelpfulVote));
        let dailyLoginCount : Nat = Array.size(Array.filter<RewardTransaction>(allRewards, func(r) = r.rewardType == #DailyLogin));
        let referralCount : Nat = Array.size(Array.filter<RewardTransaction>(allRewards, func(r) = r.rewardType == #Referral));
        let achievementCount : Nat = Array.size(Array.filter<RewardTransaction>(allRewards, func(r) = r.rewardType == #Achievement));

        {
            totalRewardsDistributed = totalRewardsDistributed;
            totalTransactions = Array.size(allRewards);
            rewardsByType = [
                (#MovieReview, movieReviewCount),
                (#QualityReview, qualityReviewCount),
                (#HelpfulVote, helpfulVoteCount),
                (#DailyLogin, dailyLoginCount),
                (#Referral, referralCount),
                (#Achievement, achievementCount)
            ];
        }
    };

    // Admin
    public shared(msg) func setOwner(newOwner: Principal): async Result.Result<(), Text> {
        if (msg.caller != owner) {
            return #err("Unauthorized: Only owner can transfer ownership");
        };
        owner := newOwner;
        #ok()
    };

    public query func getOwner(): async Principal {
        owner
    };

    public query func getAllBalances(): async [(Account, Balance)] {
        Iter.toArray(balances.entries())
    };

    // Lifecycle
    system func preupgrade() {
        // Nothing needed
    };

    system func postupgrade() {
        initialize();
    };

    private func initialize() {
        balances.put(owner, totalSupply);
    };
};
