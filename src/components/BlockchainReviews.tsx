'use client';

import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Flag, Shield, Coins, Clock, User, Wallet } from 'lucide-react';
import TokenEarningNotification from './TokenEarningNotification';

// Fallback hooks for demo mode
const useFallbackAuth = () => ({
  isAuthenticated: false
});

const useFallbackReviews = () => ({
  createReview: async () => {
    alert('🚀 Deploy Smart Contracts First\n\nTo write real blockchain reviews:\n\n1. Deploy contracts: dfx deploy\n2. Update .env.local with canister IDs\n3. Connect Plug Wallet\n4. Write reviews and earn real CINE tokens!');
    return { err: 'Smart contracts not deployed' };
  },
  getMovieReviews: async () => [],
  voteHelpful: async () => {
    alert('🚀 Deploy Smart Contracts First\n\nTo vote on reviews and earn tokens:\n\n1. Deploy contracts: dfx deploy\n2. Connect Plug Wallet\n3. Vote and earn real CINE rewards!');
    return { err: 'Smart contracts not deployed' };
  }
});

// Try to import ICP context, fall back to demo mode if not available
let useICPAuth: any, useICPReviews: any;
try {
  const icpContext = require('@/contexts/ICPContext');
  useICPAuth = icpContext.useICPAuth;
  useICPReviews = icpContext.useICPReviews;
} catch (error) {
  console.log('ICP context not available, using demo mode');
  useICPAuth = useFallbackAuth;
  useICPReviews = useFallbackReviews;
}

interface BlockchainReviewsProps {
  movieId: string;
  movieTitle: string;
}

interface Review {
  id: string;
  movieId: string;
  userId: any;
  rating: number;
  title: string;
  content: string;
  timestamp: bigint;
  verified: boolean;
  helpfulVotes: number;
  reportCount: number;
}

const BlockchainReviews: React.FC<BlockchainReviewsProps> = ({ movieId, movieTitle }) => {
  // Try to use ICP context, fall back to demo mode
  let authData, reviewData;
  try {
    authData = useICPAuth();
    reviewData = useICPReviews();
  } catch (error) {
    authData = useFallbackAuth();
    reviewData = useFallbackReviews();
  }

  const { isAuthenticated } = authData;
  const { createReview, getMovieReviews, voteHelpful } = reviewData;
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  // Demo reviews for showcase
  const demoReviews: Review[] = [
    {
      id: 'demo-1',
      movieId: movieId,
      userId: 'demo-user-1' as any,
      rating: 9,
      title: 'Absolutely Amazing!',
      content: 'This movie exceeded all my expectations. The storytelling, cinematography, and performances were all top-notch. A must-watch for any movie enthusiast!',
      timestamp: BigInt(Date.now() - 86400000) * BigInt(1000000), // 1 day ago
      verified: true,
      helpfulVotes: 15,
      reportCount: 0
    },
    {
      id: 'demo-2',
      movieId: movieId,
      userId: 'demo-user-2' as any,
      rating: 7,
      title: 'Good but not great',
      content: 'Solid movie with good acting and decent plot. Some pacing issues in the middle, but overall worth watching. The ending was particularly well done.',
      timestamp: BigInt(Date.now() - 172800000) * BigInt(1000000), // 2 days ago
      verified: true,
      helpfulVotes: 8,
      reportCount: 0
    },
    {
      id: 'demo-3',
      movieId: movieId,
      userId: 'demo-user-3' as any,
      rating: 8,
      title: 'Visually Stunning',
      content: 'The visual effects and cinematography are breathtaking. While the story is somewhat predictable, the execution makes up for it. Great for a movie night!',
      timestamp: BigInt(Date.now() - 259200000) * BigInt(1000000), // 3 days ago
      verified: false,
      helpfulVotes: 12,
      reportCount: 0
    }
  ];
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState<{
    amount: number;
    type: 'review' | 'vote' | 'daily' | 'referral' | 'achievement';
  }>({ amount: 0, type: 'review' });

  useEffect(() => {
    loadReviews();
  }, [movieId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      // Try to load real reviews, fall back to demo data
      try {
        const movieReviews = await getMovieReviews(movieId);
        setReviews(movieReviews.length > 0 ? movieReviews : demoReviews);
      } catch (error) {
        // Use demo reviews for showcase
        setReviews(demoReviews);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setReviews(demoReviews);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('🔌 Plug Wallet Required\n\nTo write blockchain reviews and earn CINE tokens:\n\n1. Install Plug Wallet: https://plugwallet.ooo/\n2. Click "Connect Plug Wallet" button\n3. Approve the connection\n4. Write your review and earn rewards!\n\nYour reviews will be stored permanently on the ICP blockchain.');
      return;
    }

    if (newReview.content.length < 10) {
      alert('Review content must be at least 10 characters long');
      return;
    }

    try {
      setSubmitting(true);
      const result = await createReview(
        movieId,
        newReview.rating,
        newReview.title,
        newReview.content
      );

      if ('ok' in result) {
        // Show token earning notification (quality review if >100 characters)
        const isQualityReview = newReview.content.length > 100;
        setNotificationData({
          amount: isQualityReview ? 0.5 : 0.1,
          type: 'review'
        });
        setShowNotification(true);

        setNewReview({ rating: 5, title: '', content: '' });
        setShowReviewForm(false);
        await loadReviews();
      } else {
        alert(`Failed to submit review: ${result.err}`);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('❌ Review Submission Failed\n\nPlease ensure:\n• Smart contracts are deployed\n• Plug Wallet is connected\n• You have sufficient ICP for gas fees\n\nError: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoteHelpful = async (reviewId: string) => {
    if (!isAuthenticated) {
      alert('🔌 Plug Wallet Required\n\nTo vote on reviews and earn CINE tokens:\n\n1. Install Plug Wallet: https://plugwallet.ooo/\n2. Click "Connect Plug Wallet" button\n3. Vote on helpful reviews\n4. Earn CINE tokens for community participation!\n\nYour votes help build a trustworthy review ecosystem.');
      return;
    }

    try {
      const result = await voteHelpful(reviewId);
      if ('ok' in result) {
        // Show token earning notification
        setNotificationData({ amount: 0.05, type: 'vote' });
        setShowNotification(true);

        await loadReviews();
      } else {
        alert(`Failed to vote: ${result.err}`);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('❌ Vote Failed\n\nPlease ensure:\n• Smart contracts are deployed\n• Plug Wallet is connected\n• You haven\'t already voted on this review\n\nError: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString();
  };

  const formatPrincipal = (principal: any) => {
    if (!principal) return 'Anonymous';

    // Handle demo users
    if (typeof principal === 'string') {
      if (principal === 'demo-user-1') return 'CineExpert';
      if (principal === 'demo-user-2') return 'MovieBuff';
      if (principal === 'demo-user-3') return 'FilmCritic';
    }

    const principalStr = principal.toString();
    return `${principalStr.slice(0, 5)}...${principalStr.slice(-5)}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="bg-gray-900 rounded-lg p-4 sm:p-6 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Blockchain Reviews
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Verified on ICP Blockchain</span>
            </div>
            <div className="flex items-center space-x-1">
              <Coins className="h-4 w-4 text-yellow-500" />
              <span>Earn CINE tokens for reviews</span>
            </div>
          </div>
        </div>
        
        {isAuthenticated ? (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            Write Review
          </button>
        ) : (
          <div className="text-center w-full sm:w-auto">
            <button
              onClick={() => alert('🔌 Connect Plug Wallet\n\nTo write blockchain reviews and earn CINE tokens:\n\n1. Install Plug Wallet: https://plugwallet.ooo/\n2. Click "Connect Plug Wallet" in the top-right\n3. Start earning rewards for quality reviews!')}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Connect Plug Wallet to Review</span>
              <span className="sm:hidden">Connect Wallet</span>
            </button>
          </div>
        )}
      </div>

      {/* Review Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-500">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center space-x-1 mt-1">
            {renderStars(Math.round(averageRating))}
          </div>
          <div className="text-sm text-gray-400 mt-1">Average Rating</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-500">{reviews.length}</div>
          <div className="text-sm text-gray-400">Total Reviews</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-500">
            {reviews.filter(r => r.verified).length}
          </div>
          <div className="text-sm text-gray-400">Verified Reviews</div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
            Write a Review for {movieTitle}
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rating
            </label>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {Array.from({ length: 10 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    i < newReview.rating
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Review Title
            </label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Give your review a title..."
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Review Content
            </label>
            <textarea
              value={newReview.content}
              onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Share your thoughts about this movie..."
              required
            />
            <div className="text-sm text-gray-400 mt-1">
              Minimum 10 characters. Quality reviews earn more CINE tokens!
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Submit Review & Earn {newReview.content.length > 100 ? '0.5' : '0.1'} CINE
                    {newReview.content.length > 100 && <span className="text-yellow-300"> (Quality Bonus!)</span>}
                  </span>
                  <span className="sm:hidden">
                    Submit & Earn {newReview.content.length > 100 ? '0.5' : '0.1'} CINE
                  </span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No reviews yet. Be the first to review this movie on the blockchain!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-800 rounded-lg p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">
                        {formatPrincipal(review.userId)}
                      </span>
                      {review.verified && (
                        <Shield className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(review.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-sm text-gray-400">
                    {review.rating}/10
                  </span>
                </div>
              </div>

              <h4 className="font-semibold text-white mb-2">{review.title}</h4>
              <p className="text-gray-300 mb-4">{review.content}</p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <button
                    onClick={() => handleVoteHelpful(review.id)}
                    className="flex items-center space-x-1 text-xs sm:text-sm text-gray-400 hover:text-green-500 transition-colors"
                  >
                    <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Helpful ({review.helpfulVotes}) • +0.05 CINE</span>
                    <span className="sm:hidden">👍 {review.helpfulVotes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-xs sm:text-sm text-gray-400 hover:text-red-500 transition-colors">
                    <Flag className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Report</span>
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  Stored on ICP Blockchain
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Token Earning Notification */}
      <TokenEarningNotification
        show={showNotification}
        amount={notificationData.amount}
        type={notificationData.type}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
};

export default BlockchainReviews;
