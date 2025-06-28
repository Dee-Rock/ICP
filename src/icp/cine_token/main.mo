import Time "mo:base/Time";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";

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
    
    // Token Metadata (ICRC-1 compatible)
    public let name = "CineAI Token";
    public let symbol = "CINE";
    public let decimals = 8;
    public let totalSupply = 1_000_000_000_000_000; // 10M CINE tokens
    
    // State
    private stable var owner: Principal = Principal.fromText("rdmx6-jaaaa-aaaah-qdrqq-cai"); // Replace with actual owner
    private var balances = Map.HashMap<Account, Balance>(100, Principal.equal, Principal.hash);
    private var allowances = Map.HashMap<(Account, Account), Balance>(100, func(a, b) = Principal.equal(a.0, b.0) and Principal.equal(a.1, b.1), func(a) = Principal.hash(a.0));
    private stable var nextTransactionId: Nat = 0;
    private var rewardHistory = Map.HashMap<Nat, RewardTransaction>(100, Nat.equal, func(n: Nat) : Nat32 = Nat32.fromNat(n % (2**32)));
    
    // Reward amounts
    private let MOVIE_REVIEW_REWARD: Balance = 10_000_000; // 0.1 CINE
    private let QUALITY_REVIEW_REWARD: Balance = 50_000_000; // 0.5 CINE
    private let HELPFUL_VOTE_REWARD: Balance = 5_000_000; // 0.05 CINE
    private let DAILY_LOGIN_REWARD: Balance = 2_000_000; // 0.02 CINE
    private let REFERRAL_REWARD: Balance = 100_000_000; // 1 CINE
    private let ACHIEVEMENT_REWARD: Balance = 25_000_000; // 0.25 CINE
    
    // Initialize owner balance
    private func init() {
        balances.put(owner, totalSupply);
    };
    
    // ICRC-1 Standard Functions
    
    public query func icrc1_name(): async Text { name };
    public query func icrc1_symbol(): async Text { symbol };
    public query func icrc1_decimals(): async Nat8 { decimals };
    public query func icrc1_total_supply(): async Balance { totalSupply };
    
    public query func icrc1_balance_of(account: Account): async Balance {
        switch (balances.get(account)) {
            case (?balance) { balance };
            case null { 0 };
        }
    };
    
    public shared(msg) func icrc1_transfer(args: TransferArgs): async TransferResult {
        let from = msg.caller;
        let to = args.to;
        let amount = args.amount;
        
        // Check balance
        let fromBalance = switch (balances.get(from)) {
            case (?balance) { balance };
            case null { 0 };
        };
        
        if (fromBalance < amount) {
            return #err(#InsufficientBalance);
        };
        
        // Update balances
        balances.put(from, fromBalance - amount);
        
        let toBalance = switch (balances.get(to)) {
            case (?balance) { balance };
            case null { 0 };
        };
        balances.put(to, toBalance + amount);
        
        #ok(fromBalance - amount)
    };
    
    // Reward System Functions
    
    public shared(msg) func rewardUser(recipient: Account, rewardType: RewardType, description: Text): async Result.Result<Balance, Text> {
        // Only authorized contracts can call this (in production, add proper access control)
        
        let amount = switch (rewardType) {
            case (#MovieReview) { MOVIE_REVIEW_REWARD };
            case (#QualityReview) { QUALITY_REVIEW_REWARD };
            case (#HelpfulVote) { HELPFUL_VOTE_REWARD };
            case (#DailyLogin) { DAILY_LOGIN_REWARD };
            case (#Referral) { REFERRAL_REWARD };
            case (#Achievement) { ACHIEVEMENT_REWARD };
        };
        
        // Check if owner has enough balance to mint rewards
        let ownerBalance = switch (balances.get(owner)) {
            case (?balance) { balance };
            case null { 0 };
        };
        
        if (ownerBalance < amount) {
            return #err("Insufficient reward pool balance");
        };
        
        // Transfer from owner to recipient
        balances.put(owner, ownerBalance - amount);
        
        let recipientBalance = switch (balances.get(recipient)) {
            case (?balance) { balance };
            case null { 0 };
        };
        balances.put(recipient, recipientBalance + amount);
        
        // Record reward transaction
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
    
    // Batch reward multiple users (for efficiency)
    public shared(msg) func batchRewardUsers(rewards: [(Account, RewardType, Text)]): async [Result.Result<Balance, Text>] {
        Array.map<(Account, RewardType, Text), Result.Result<Balance, Text>>(
            rewards,
            func((recipient, rewardType, description)) = 
                switch (rewardUser(recipient, rewardType, description)) {
                    case (#ok(balance)) { #ok(balance) };
                    case (#err(error)) { #err(error) };
                }
        )
    };
    
    // Get user's reward history
    public query func getUserRewardHistory(user: Account): async [RewardTransaction] {
        let allRewards = Iter.toArray(rewardHistory.vals());
        Array.filter<RewardTransaction>(allRewards, func(reward) = reward.recipient == user)
    };
    
    // Get total rewards earned by user
    public query func getTotalRewardsEarned(user: Account): async Balance {
        let userRewards = getUserRewardHistory(user);
        Array.foldLeft<RewardTransaction, Balance>(
            userRewards,
            0,
            func(acc, reward) = acc + reward.amount
        )
    };
    
    // Get reward statistics
    public query func getRewardStats(): async {
        totalRewardsDistributed: Balance;
        totalTransactions: Nat;
        rewardsByType: [(RewardType, Nat)];
    } {
        let allRewards = Iter.toArray(rewardHistory.vals());
        let totalRewardsDistributed = Array.foldLeft<RewardTransaction, Balance>(
            allRewards,
            0,
            func(acc, reward) = acc + reward.amount
        );
        
        // Count rewards by type (simplified)
        let movieReviewCount = Array.size(Array.filter<RewardTransaction>(allRewards, func(r) = r.rewardType == #MovieReview));
        let qualityReviewCount = Array.size(Array.filter<RewardTransaction>(allRewards, func(r) = r.rewardType == #QualityReview));
        let helpfulVoteCount = Array.size(Array.filter<RewardTransaction>(allRewards, func(r) = r.rewardType == #HelpfulVote));
        let dailyLoginCount = Array.size(Array.filter<RewardTransaction>(allRewards, func(r) = r.rewardType == #DailyLogin));
        let referralCount = Array.size(Array.filter<RewardTransaction>(allRewards, func(r) = r.rewardType == #Referral));
        let achievementCount = Array.size(Array.filter<RewardTransaction>(allRewards, func(r) = r.rewardType == #Achievement));
        
        {
            totalRewardsDistributed = totalRewardsDistributed;
            totalTransactions = allRewards.size();
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
    
    // Admin functions
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
    
    // Get all balances (for debugging/admin)
    public query func getAllBalances(): async [(Account, Balance)] {
        Iter.toArray(balances.entries())
    };
    
    // System upgrade hooks
    system func preupgrade() {
        // State is already stable
    };
    
    system func postupgrade() {
        init(); // Initialize if needed
    };
    
    // Initialize on deployment
    init();
}
