import Time "mo:base/Time";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";

actor MovieReviews {
    
    // Types
    public type ReviewId = Text;
    public type MovieId = Text;
    public type UserId = Principal;
    
    public type Review = {
        id: ReviewId;
        movieId: MovieId;
        userId: UserId;
        rating: Nat8; // 1-10 rating
        title: Text;
        content: Text;
        timestamp: Int;
        verified: Bool;
        helpfulVotes: Nat;
        reportCount: Nat;
    };
    
    public type ReviewInput = {
        movieId: MovieId;
        rating: Nat8;
        title: Text;
        content: Text;
    };
    
    public type UserStats = {
        totalReviews: Nat;
        averageRating: Float;
        helpfulVotes: Nat;
        reputation: Nat;
    };
    
    // State
    private stable var nextReviewId: Nat = 0;
    private var reviews = Map.HashMap<ReviewId, Review>(10, Text.equal, Text.hash);
    private var movieReviews = Map.HashMap<MovieId, [ReviewId]>(10, Text.equal, Text.hash);
    private var userReviews = Map.HashMap<UserId, [ReviewId]>(10, Principal.equal, Principal.hash);
    private var userStats = Map.HashMap<UserId, UserStats>(10, Principal.equal, Principal.hash);
    
    // Create a new review
    public shared(msg) func createReview(input: ReviewInput): async Result.Result<ReviewId, Text> {
        let caller = msg.caller;
        
        // Validate input
        if (input.rating < 1 or input.rating > 10) {
            return #err("Rating must be between 1 and 10");
        };
        
        if (Text.size(input.content) < 10) {
            return #err("Review content must be at least 10 characters");
        };
        
        // Check if user already reviewed this movie
        switch (userReviews.get(caller)) {
            case (?existingReviews) {
                for (reviewId in existingReviews.vals()) {
                    switch (reviews.get(reviewId)) {
                        case (?review) {
                            if (review.movieId == input.movieId) {
                                return #err("You have already reviewed this movie");
                            };
                        };
                        case null {};
                    };
                };
            };
            case null {};
        };
        
        // Create review
        let reviewId = Nat.toText(nextReviewId);
        nextReviewId += 1;
        
        let review: Review = {
            id = reviewId;
            movieId = input.movieId;
            userId = caller;
            rating = input.rating;
            title = input.title;
            content = input.content;
            timestamp = Time.now();
            verified = false; // Can be verified later by moderators
            helpfulVotes = 0;
            reportCount = 0;
        };
        
        // Store review
        reviews.put(reviewId, review);
        
        // Update movie reviews index
        let currentMovieReviews = switch (movieReviews.get(input.movieId)) {
            case (?existing) { existing };
            case null { [] };
        };
        movieReviews.put(input.movieId, Array.append(currentMovieReviews, [reviewId]));
        
        // Update user reviews index
        let currentUserReviews = switch (userReviews.get(caller)) {
            case (?existing) { existing };
            case null { [] };
        };
        userReviews.put(caller, Array.append(currentUserReviews, [reviewId]));
        
        // Update user stats
        updateUserStats(caller);
        
        #ok(reviewId)
    };
    
    // Get reviews for a movie
    public query func getMovieReviews(movieId: MovieId): async [Review] {
        switch (movieReviews.get(movieId)) {
            case (?reviewIds) {
                Array.mapFilter<ReviewId, Review>(reviewIds, func(id) = reviews.get(id))
            };
            case null { [] };
        }
    };
    
    // Get reviews by a user
    public query func getUserReviews(userId: UserId): async [Review] {
        switch (userReviews.get(userId)) {
            case (?reviewIds) {
                Array.mapFilter<ReviewId, Review>(reviewIds, func(id) = reviews.get(id))
            };
            case null { [] };
        }
    };
    
    // Get a specific review
    public query func getReview(reviewId: ReviewId): async ?Review {
        reviews.get(reviewId)
    };
    
    // Vote a review as helpful
    public shared(msg) func voteHelpful(reviewId: ReviewId): async Result.Result<(), Text> {
        switch (reviews.get(reviewId)) {
            case (?review) {
                if (review.userId == msg.caller) {
                    return #err("Cannot vote on your own review");
                };
                
                let updatedReview = {
                    review with helpfulVotes = review.helpfulVotes + 1
                };
                reviews.put(reviewId, updatedReview);
                
                // Update reviewer's stats
                updateUserStats(review.userId);
                
                #ok()
            };
            case null {
                #err("Review not found")
            };
        }
    };
    
    // Report a review
    public shared(msg) func reportReview(reviewId: ReviewId): async Result.Result<(), Text> {
        switch (reviews.get(reviewId)) {
            case (?review) {
                let updatedReview = {
                    review with reportCount = review.reportCount + 1
                };
                reviews.put(reviewId, updatedReview);
                #ok()
            };
            case null {
                #err("Review not found")
            };
        }
    };
    
    // Get user statistics
    public query func getUserStats(userId: UserId): async ?UserStats {
        userStats.get(userId)
    };
    
    // Get movie rating summary
    public query func getMovieRatingSummary(movieId: MovieId): async {averageRating: Float; totalReviews: Nat} {
        switch (movieReviews.get(movieId)) {
            case (?reviewIds) {
                let movieReviewsArray = Array.mapFilter<ReviewId, Review>(reviewIds, func(id) = reviews.get(id));
                let totalReviews = movieReviewsArray.size();
                
                if (totalReviews == 0) {
                    return {averageRating = 0.0; totalReviews = 0};
                };
                
                let totalRating = Array.foldLeft<Review, Nat>(movieReviewsArray, 0, func(acc, review) = acc + Nat8.toNat(review.rating));
                let averageRating = Float.fromInt(totalRating) / Float.fromInt(totalReviews);
                
                {averageRating = averageRating; totalReviews = totalReviews}
            };
            case null {
                {averageRating = 0.0; totalReviews = 0}
            };
        }
    };
    
    // Private helper function to update user stats
    private func updateUserStats(userId: UserId) {
        switch (userReviews.get(userId)) {
            case (?reviewIds) {
                let userReviewsArray = Array.mapFilter<ReviewId, Review>(reviewIds, func(id) = reviews.get(id));
                let totalReviews = userReviewsArray.size();
                
                if (totalReviews > 0) {
                    let totalRating = Array.foldLeft<Review, Nat>(userReviewsArray, 0, func(acc, review) = acc + Nat8.toNat(review.rating));
                    let averageRating = Float.fromInt(totalRating) / Float.fromInt(totalReviews);
                    let totalHelpfulVotes = Array.foldLeft<Review, Nat>(userReviewsArray, 0, func(acc, review) = acc + review.helpfulVotes);
                    let reputation = totalHelpfulVotes * 10 + totalReviews * 5; // Simple reputation calculation
                    
                    let stats: UserStats = {
                        totalReviews = totalReviews;
                        averageRating = averageRating;
                        helpfulVotes = totalHelpfulVotes;
                        reputation = reputation;
                    };
                    
                    userStats.put(userId, stats);
                };
            };
            case null {};
        };
    };
    
    // Get all reviews (for admin/analytics)
    public query func getAllReviews(): async [Review] {
        Iter.toArray(reviews.vals())
    };
    
    // System upgrade hooks
    system func preupgrade() {
        // State is already stable
    };
    
    system func postupgrade() {
        // Reinitialize HashMaps if needed
    };
}
