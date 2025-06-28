import Time "mo:base/Time";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";

actor UserProfiles {
    
    // Types
    public type UserId = Principal;
    public type MovieId = Text;
    
    public type UserProfile = {
        id: UserId;
        username: ?Text;
        bio: ?Text;
        favoriteGenres: [Text];
        watchedMovies: [MovieId];
        watchlist: [MovieId];
        preferences: UserPreferences;
        stats: UserStats;
        createdAt: Int;
        lastActive: Int;
        isVerified: Bool;
        reputation: Nat;
    };
    
    public type UserPreferences = {
        aiRecommendations: Bool;
        emailNotifications: Bool;
        publicProfile: Bool;
        shareWatchHistory: Bool;
        preferredLanguages: [Text];
        contentRating: Text; // "G", "PG", "PG-13", "R", "NC-17"
    };
    
    public type UserStats = {
        totalReviews: Nat;
        totalRatings: Nat;
        averageRating: Float;
        helpfulVotes: Nat;
        tokensEarned: Nat;
        daysActive: Nat;
        moviesWatched: Nat;
    };
    
    public type ProfileUpdate = {
        username: ?Text;
        bio: ?Text;
        favoriteGenres: ?[Text];
        preferences: ?UserPreferences;
    };
    
    public type WatchHistoryEntry = {
        movieId: MovieId;
        watchedAt: Int;
        rating: ?Nat8;
        watchTime: ?Nat; // in minutes
        completed: Bool;
    };
    
    // State
    private var profiles = Map.HashMap<UserId, UserProfile>(100, Principal.equal, Principal.hash);
    private var usernames = Map.HashMap<Text, UserId>(100, Text.equal, Text.hash);
    private var watchHistory = Map.HashMap<UserId, [WatchHistoryEntry]>(100, Principal.equal, Principal.hash);
    private var followRelations = Map.HashMap<UserId, [UserId]>(100, Principal.equal, Principal.hash); // following
    private var followers = Map.HashMap<UserId, [UserId]>(100, Principal.equal, Principal.hash);
    
    // Create or get user profile
    public shared(msg) func getOrCreateProfile(): async UserProfile {
        let userId = msg.caller;
        
        switch (profiles.get(userId)) {
            case (?existingProfile) { existingProfile };
            case null {
                let defaultPreferences: UserPreferences = {
                    aiRecommendations = true;
                    emailNotifications = true;
                    publicProfile = true;
                    shareWatchHistory = false;
                    preferredLanguages = ["en"];
                    contentRating = "PG-13";
                };
                
                let defaultStats: UserStats = {
                    totalReviews = 0;
                    totalRatings = 0;
                    averageRating = 0.0;
                    helpfulVotes = 0;
                    tokensEarned = 0;
                    daysActive = 1;
                    moviesWatched = 0;
                };
                
                let newProfile: UserProfile = {
                    id = userId;
                    username = null;
                    bio = null;
                    favoriteGenres = [];
                    watchedMovies = [];
                    watchlist = [];
                    preferences = defaultPreferences;
                    stats = defaultStats;
                    createdAt = Time.now();
                    lastActive = Time.now();
                    isVerified = false;
                    reputation = 0;
                };
                
                profiles.put(userId, newProfile);
                newProfile
            };
        }
    };
    
    // Update user profile
    public shared(msg) func updateProfile(update: ProfileUpdate): async Result.Result<UserProfile, Text> {
        let userId = msg.caller;
        
        switch (profiles.get(userId)) {
            case (?currentProfile) {
                // Check username availability if updating username
                switch (update.username) {
                    case (?newUsername) {
                        if (Text.size(newUsername) < 3 or Text.size(newUsername) > 20) {
                            return #err("Username must be between 3 and 20 characters");
                        };
                        
                        // Check if username is already taken
                        switch (usernames.get(newUsername)) {
                            case (?existingUserId) {
                                if (existingUserId != userId) {
                                    return #err("Username already taken");
                                };
                            };
                            case null {};
                        };
                        
                        // Remove old username mapping if exists
                        switch (currentProfile.username) {
                            case (?oldUsername) {
                                usernames.delete(oldUsername);
                            };
                            case null {};
                        };
                        
                        // Add new username mapping
                        usernames.put(newUsername, userId);
                    };
                    case null {};
                };
                
                let updatedProfile: UserProfile = {
                    currentProfile with
                    username = switch (update.username) { case (?u) ?u; case null currentProfile.username };
                    bio = switch (update.bio) { case (?b) ?b; case null currentProfile.bio };
                    favoriteGenres = switch (update.favoriteGenres) { case (?g) g; case null currentProfile.favoriteGenres };
                    preferences = switch (update.preferences) { case (?p) p; case null currentProfile.preferences };
                    lastActive = Time.now();
                };
                
                profiles.put(userId, updatedProfile);
                #ok(updatedProfile)
            };
            case null {
                #err("Profile not found. Create profile first.")
            };
        }
    };
    
    // Get user profile by ID
    public query func getProfile(userId: UserId): async ?UserProfile {
        profiles.get(userId)
    };
    
    // Get user profile by username
    public query func getProfileByUsername(username: Text): async ?UserProfile {
        switch (usernames.get(username)) {
            case (?userId) { profiles.get(userId) };
            case null { null };
        }
    };
    
    // Add movie to watchlist
    public shared(msg) func addToWatchlist(movieId: MovieId): async Result.Result<(), Text> {
        let userId = msg.caller;
        
        switch (profiles.get(userId)) {
            case (?profile) {
                // Check if movie is already in watchlist
                if (Array.find<MovieId>(profile.watchlist, func(id) = id == movieId) != null) {
                    return #err("Movie already in watchlist");
                };
                
                let updatedProfile = {
                    profile with
                    watchlist = Array.append(profile.watchlist, [movieId]);
                    lastActive = Time.now();
                };
                
                profiles.put(userId, updatedProfile);
                #ok()
            };
            case null {
                #err("Profile not found")
            };
        }
    };
    
    // Remove movie from watchlist
    public shared(msg) func removeFromWatchlist(movieId: MovieId): async Result.Result<(), Text> {
        let userId = msg.caller;
        
        switch (profiles.get(userId)) {
            case (?profile) {
                let updatedWatchlist = Array.filter<MovieId>(profile.watchlist, func(id) = id != movieId);
                
                let updatedProfile = {
                    profile with
                    watchlist = updatedWatchlist;
                    lastActive = Time.now();
                };
                
                profiles.put(userId, updatedProfile);
                #ok()
            };
            case null {
                #err("Profile not found")
            };
        }
    };
    
    // Add movie to watch history
    public shared(msg) func addToWatchHistory(movieId: MovieId, rating: ?Nat8, watchTime: ?Nat, completed: Bool): async Result.Result<(), Text> {
        let userId = msg.caller;
        
        let entry: WatchHistoryEntry = {
            movieId = movieId;
            watchedAt = Time.now();
            rating = rating;
            watchTime = watchTime;
            completed = completed;
        };
        
        let currentHistory = switch (watchHistory.get(userId)) {
            case (?history) { history };
            case null { [] };
        };
        
        watchHistory.put(userId, Array.append(currentHistory, [entry]));
        
        // Update profile stats
        switch (profiles.get(userId)) {
            case (?profile) {
                let updatedStats = {
                    profile.stats with
                    moviesWatched = profile.stats.moviesWatched + 1;
                };
                
                let updatedProfile = {
                    profile with
                    stats = updatedStats;
                    watchedMovies = Array.append(profile.watchedMovies, [movieId]);
                    lastActive = Time.now();
                };
                
                profiles.put(userId, updatedProfile);
            };
            case null {};
        };
        
        #ok()
    };
    
    // Get user's watch history
    public query func getWatchHistory(userId: UserId): async [WatchHistoryEntry] {
        switch (watchHistory.get(userId)) {
            case (?history) { history };
            case null { [] };
        }
    };
    
    // Follow another user
    public shared(msg) func followUser(targetUserId: UserId): async Result.Result<(), Text> {
        let userId = msg.caller;
        
        if (userId == targetUserId) {
            return #err("Cannot follow yourself");
        };
        
        // Check if target user exists
        switch (profiles.get(targetUserId)) {
            case null { return #err("User not found") };
            case (?_) {};
        };
        
        // Add to following list
        let currentFollowing = switch (followRelations.get(userId)) {
            case (?following) { following };
            case null { [] };
        };
        
        // Check if already following
        if (Array.find<UserId>(currentFollowing, func(id) = id == targetUserId) != null) {
            return #err("Already following this user");
        };
        
        followRelations.put(userId, Array.append(currentFollowing, [targetUserId]));
        
        // Add to target user's followers list
        let currentFollowers = switch (followers.get(targetUserId)) {
            case (?followersList) { followersList };
            case null { [] };
        };
        
        followers.put(targetUserId, Array.append(currentFollowers, [userId]));
        
        #ok()
    };
    
    // Unfollow a user
    public shared(msg) func unfollowUser(targetUserId: UserId): async Result.Result<(), Text> {
        let userId = msg.caller;
        
        // Remove from following list
        let currentFollowing = switch (followRelations.get(userId)) {
            case (?following) { following };
            case null { return #err("Not following this user") };
        };
        
        let updatedFollowing = Array.filter<UserId>(currentFollowing, func(id) = id != targetUserId);
        followRelations.put(userId, updatedFollowing);
        
        // Remove from target user's followers list
        let currentFollowers = switch (followers.get(targetUserId)) {
            case (?followersList) { followersList };
            case null { [] };
        };
        
        let updatedFollowers = Array.filter<UserId>(currentFollowers, func(id) = id != userId);
        followers.put(targetUserId, updatedFollowers);
        
        #ok()
    };
    
    // Get user's following list
    public query func getFollowing(userId: UserId): async [UserId] {
        switch (followRelations.get(userId)) {
            case (?following) { following };
            case null { [] };
        }
    };
    
    // Get user's followers list
    public query func getFollowers(userId: UserId): async [UserId] {
        switch (followers.get(userId)) {
            case (?followersList) { followersList };
            case null { [] };
        }
    };
    
    // Update user stats (called by other canisters)
    public shared func updateUserStats(userId: UserId, statsUpdate: {
        totalReviews: ?Nat;
        totalRatings: ?Nat;
        averageRating: ?Float;
        helpfulVotes: ?Nat;
        tokensEarned: ?Nat;
    }): async Result.Result<(), Text> {
        switch (profiles.get(userId)) {
            case (?profile) {
                let updatedStats = {
                    profile.stats with
                    totalReviews = switch (statsUpdate.totalReviews) { case (?v) v; case null profile.stats.totalReviews };
                    totalRatings = switch (statsUpdate.totalRatings) { case (?v) v; case null profile.stats.totalRatings };
                    averageRating = switch (statsUpdate.averageRating) { case (?v) v; case null profile.stats.averageRating };
                    helpfulVotes = switch (statsUpdate.helpfulVotes) { case (?v) v; case null profile.stats.helpfulVotes };
                    tokensEarned = switch (statsUpdate.tokensEarned) { case (?v) v; case null profile.stats.tokensEarned };
                };
                
                let updatedProfile = {
                    profile with
                    stats = updatedStats;
                    lastActive = Time.now();
                };
                
                profiles.put(userId, updatedProfile);
                #ok()
            };
            case null {
                #err("Profile not found")
            };
        }
    };
    
    // Get platform statistics
    public query func getPlatformStats(): async {
        totalUsers: Nat;
        activeUsers: Nat;
        totalWatchlistItems: Nat;
        totalMoviesWatched: Nat;
    } {
        let allProfiles = Iter.toArray(profiles.vals());
        let totalUsers = allProfiles.size();
        
        // Users active in last 7 days (simplified)
        let now = Time.now();
        let sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1_000_000_000);
        let activeUsers = Array.size(Array.filter<UserProfile>(allProfiles, func(profile) = profile.lastActive > sevenDaysAgo));
        
        let totalWatchlistItems = Array.foldLeft<UserProfile, Nat>(allProfiles, 0, func(acc, profile) = acc + profile.watchlist.size());
        let totalMoviesWatched = Array.foldLeft<UserProfile, Nat>(allProfiles, 0, func(acc, profile) = acc + profile.stats.moviesWatched);
        
        {
            totalUsers = totalUsers;
            activeUsers = activeUsers;
            totalWatchlistItems = totalWatchlistItems;
            totalMoviesWatched = totalMoviesWatched;
        }
    };
    
    // System upgrade hooks
    system func preupgrade() {
        // State is already stable
    };
    
    system func postupgrade() {
        // Reinitialize HashMaps if needed
    };
}
