import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// Plug Wallet interface
declare global {
  interface Window {
    ic?: {
      plug?: {
        requestConnect: (options?: {
          whitelist?: string[];
          host?: string;
        }) => Promise<boolean>;
        createActor: (options: {
          canisterId: string;
          interfaceFactory: any;
        }) => any;
        isConnected: () => Promise<boolean>;
        disconnect: () => Promise<boolean>;
        getPrincipal: () => Promise<Principal>;
        requestBalance: () => Promise<Array<{
          amount: number;
          canisterId: string;
          image: string;
          name: string;
          symbol: string;
        }>>;
        requestTransfer: (options: {
          to: string;
          amount: number;
          opts?: {
            fee?: number;
            memo?: string;
            from_subaccount?: number;
            created_at_time?: {
              timestamp_nanos: number;
            };
          };
        }) => Promise<{ height: number }>;
      };
    };
  }
}

// Canister IDs (using known valid Principal IDs for demo)
export const CANISTER_IDS = {
  MOVIE_REVIEWS: process.env.NEXT_PUBLIC_MOVIE_REVIEWS_CANISTER_ID || 'qjdve-lqaaa-aaaah-qai7q-cai',
  CINE_TOKEN: process.env.NEXT_PUBLIC_CINE_TOKEN_CANISTER_ID || 'qaa6y-5yaaa-aaaah-qabaq-cai',
  USER_PROFILES: process.env.NEXT_PUBLIC_USER_PROFILES_CANISTER_ID || 'qsgjb-riaaa-aaaah-qai4q-cai',
};

// Network configuration
const HOST = process.env.NODE_ENV === 'production'
  ? 'https://ic0.app'
  : 'http://localhost:4943';

// Production mode - always use real blockchain functionality
const DEMO_MODE = false;

// Types
export interface Review {
  id: string;
  movieId: string;
  userId: Principal;
  rating: number;
  title: string;
  content: string;
  timestamp: bigint;
  verified: boolean;
  helpfulVotes: number;
  reportCount: number;
}

export interface UserProfile {
  id: Principal;
  username?: string;
  bio?: string;
  favoriteGenres: string[];
  watchedMovies: string[];
  watchlist: string[];
  preferences: UserPreferences;
  stats: UserStats;
  createdAt: bigint;
  lastActive: bigint;
  isVerified: boolean;
  reputation: number;
}

export interface UserPreferences {
  aiRecommendations: boolean;
  emailNotifications: boolean;
  publicProfile: boolean;
  shareWatchHistory: boolean;
  preferredLanguages: string[];
  contentRating: string;
}

export interface UserStats {
  totalReviews: number;
  totalRatings: number;
  averageRating: number;
  helpfulVotes: number;
  tokensEarned: number;
  daysActive: number;
  moviesWatched: number;
}

export interface RewardType {
  MovieReview?: null;
  QualityReview?: null;
  HelpfulVote?: null;
  DailyLogin?: null;
  Referral?: null;
  Achievement?: null;
}

// IDL (Interface Description Language) for canisters
const movieReviewsIDL = ({ IDL }: any) => {
  const ReviewId = IDL.Text;
  const MovieId = IDL.Text;
  const UserId = IDL.Principal;
  
  const Review = IDL.Record({
    id: ReviewId,
    movieId: MovieId,
    userId: UserId,
    rating: IDL.Nat8,
    title: IDL.Text,
    content: IDL.Text,
    timestamp: IDL.Int,
    verified: IDL.Bool,
    helpfulVotes: IDL.Nat,
    reportCount: IDL.Nat,
  });
  
  const ReviewInput = IDL.Record({
    movieId: MovieId,
    rating: IDL.Nat8,
    title: IDL.Text,
    content: IDL.Text,
  });
  
  return IDL.Service({
    createReview: IDL.Func([ReviewInput], [IDL.Variant({ ok: ReviewId, err: IDL.Text })], []),
    getMovieReviews: IDL.Func([MovieId], [IDL.Vec(Review)], ['query']),
    getUserReviews: IDL.Func([UserId], [IDL.Vec(Review)], ['query']),
    getReview: IDL.Func([ReviewId], [IDL.Opt(Review)], ['query']),
    voteHelpful: IDL.Func([ReviewId], [IDL.Variant({ ok: IDL.Null, err: IDL.Text })], []),
    reportReview: IDL.Func([ReviewId], [IDL.Variant({ ok: IDL.Null, err: IDL.Text })], []),
    getMovieRatingSummary: IDL.Func([MovieId], [IDL.Record({ averageRating: IDL.Float64, totalReviews: IDL.Nat })], ['query']),
  });
};

const cineTokenIDL = ({ IDL }: any) => {
  const Account = IDL.Principal;
  const Balance = IDL.Nat;
  
  const TransferArgs = IDL.Record({
    to: Account,
    amount: Balance,
    memo: IDL.Opt(IDL.Text),
  });
  
  const RewardType = IDL.Variant({
    MovieReview: IDL.Null,
    QualityReview: IDL.Null,
    HelpfulVote: IDL.Null,
    DailyLogin: IDL.Null,
    Referral: IDL.Null,
    Achievement: IDL.Null,
  });
  
  return IDL.Service({
    icrc1_name: IDL.Func([], [IDL.Text], ['query']),
    icrc1_symbol: IDL.Func([], [IDL.Text], ['query']),
    icrc1_decimals: IDL.Func([], [IDL.Nat8], ['query']),
    icrc1_total_supply: IDL.Func([], [Balance], ['query']),
    icrc1_balance_of: IDL.Func([Account], [Balance], ['query']),
    icrc1_transfer: IDL.Func([TransferArgs], [IDL.Variant({ ok: Balance, err: IDL.Text })], []),
    rewardUser: IDL.Func([Account, RewardType, IDL.Text], [IDL.Variant({ ok: Balance, err: IDL.Text })], []),
    getUserRewardHistory: IDL.Func([Account], [IDL.Vec(IDL.Record({
      id: IDL.Nat,
      recipient: Account,
      amount: Balance,
      rewardType: RewardType,
      description: IDL.Text,
      timestamp: IDL.Int,
    }))], ['query']),
    getTotalRewardsEarned: IDL.Func([Account], [Balance], ['query']),
  });
};

const userProfilesIDL = ({ IDL }: any) => {
  const UserId = IDL.Principal;
  const MovieId = IDL.Text;
  
  const UserPreferences = IDL.Record({
    aiRecommendations: IDL.Bool,
    emailNotifications: IDL.Bool,
    publicProfile: IDL.Bool,
    shareWatchHistory: IDL.Bool,
    preferredLanguages: IDL.Vec(IDL.Text),
    contentRating: IDL.Text,
  });
  
  const UserStats = IDL.Record({
    totalReviews: IDL.Nat,
    totalRatings: IDL.Nat,
    averageRating: IDL.Float64,
    helpfulVotes: IDL.Nat,
    tokensEarned: IDL.Nat,
    daysActive: IDL.Nat,
    moviesWatched: IDL.Nat,
  });
  
  const UserProfile = IDL.Record({
    id: UserId,
    username: IDL.Opt(IDL.Text),
    bio: IDL.Opt(IDL.Text),
    favoriteGenres: IDL.Vec(IDL.Text),
    watchedMovies: IDL.Vec(MovieId),
    watchlist: IDL.Vec(MovieId),
    preferences: UserPreferences,
    stats: UserStats,
    createdAt: IDL.Int,
    lastActive: IDL.Int,
    isVerified: IDL.Bool,
    reputation: IDL.Nat,
  });
  
  const ProfileUpdate = IDL.Record({
    username: IDL.Opt(IDL.Text),
    bio: IDL.Opt(IDL.Text),
    favoriteGenres: IDL.Opt(IDL.Vec(IDL.Text)),
    preferences: IDL.Opt(UserPreferences),
  });
  
  return IDL.Service({
    getOrCreateProfile: IDL.Func([], [UserProfile], []),
    updateProfile: IDL.Func([ProfileUpdate], [IDL.Variant({ ok: UserProfile, err: IDL.Text })], []),
    getProfile: IDL.Func([UserId], [IDL.Opt(UserProfile)], ['query']),
    getProfileByUsername: IDL.Func([IDL.Text], [IDL.Opt(UserProfile)], ['query']),
    addToWatchlist: IDL.Func([MovieId], [IDL.Variant({ ok: IDL.Null, err: IDL.Text })], []),
    removeFromWatchlist: IDL.Func([MovieId], [IDL.Variant({ ok: IDL.Null, err: IDL.Text })], []),
    addToWatchHistory: IDL.Func([MovieId, IDL.Opt(IDL.Nat8), IDL.Opt(IDL.Nat), IDL.Bool], [IDL.Variant({ ok: IDL.Null, err: IDL.Text })], []),
    followUser: IDL.Func([UserId], [IDL.Variant({ ok: IDL.Null, err: IDL.Text })], []),
    unfollowUser: IDL.Func([UserId], [IDL.Variant({ ok: IDL.Null, err: IDL.Text })], []),
    getFollowing: IDL.Func([UserId], [IDL.Vec(UserId)], ['query']),
    getFollowers: IDL.Func([UserId], [IDL.Vec(UserId)], ['query']),
  });
};

// ICP Service Class with Plug Wallet
export class ICPService {
  private movieReviewsActor: any = null;
  private cineTokenActor: any = null;
  private userProfilesActor: any = null;
  private isAuthenticated = false;
  private principal: Principal | null = null;

  async init() {
    // Check if Plug Wallet is installed
    if (!window.ic?.plug) {
      console.log('Plug Wallet not detected');
      return;
    }

    // Check if already connected
    try {
      this.isAuthenticated = await window.ic.plug.isConnected();
      if (this.isAuthenticated) {
        this.principal = await window.ic.plug.getPrincipal();
        await this.setupActors();
      }
    } catch (error) {
      console.error('Error checking Plug connection:', error);
    }
  }

  async login() {
    if (!window.ic?.plug) {
      alert('🔌 Plug Wallet Required\n\nPlease install Plug Wallet extension to connect:\n\n1. Visit: https://plugwallet.ooo/\n2. Install the browser extension\n3. Create or import your wallet\n4. Refresh this page and try again');
      return false;
    }

    try {
      // Production mode - connect with canister whitelist for real blockchain functionality
      const connected = await window.ic.plug.requestConnect({
        whitelist: [
          CANISTER_IDS.MOVIE_REVIEWS,
          CANISTER_IDS.CINE_TOKEN,
          CANISTER_IDS.USER_PROFILES,
        ],
        host: HOST,
      });

      if (connected) {
        this.isAuthenticated = true;
        this.principal = await window.ic.plug.getPrincipal();

        try {
          await this.setupActors();
          console.log('✅ Real blockchain: Smart contracts connected successfully');
          alert('🎉 Blockchain Connected!\n\n✅ Plug Wallet connected\n✅ Smart contracts loaded\n✅ Real CINE token rewards active\n✅ Permanent blockchain storage\n\nYou can now earn real tokens and write permanent reviews!');
        } catch (setupError) {
          console.error('Smart contract setup failed:', setupError);
          alert('⚠️ Smart Contracts Not Found\n\nPlease ensure:\n1. Smart contracts are deployed\n2. Canister IDs are correct in .env.local\n3. Try deploying with: dfx deploy\n\nError: ' + setupError);
          return false;
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Plug Wallet connection failed:', error);

      if (error instanceof Error && error.message.includes('checksum')) {
        alert('🔧 Invalid Canister IDs\n\nPlease:\n1. Deploy your smart contracts first\n2. Update .env.local with real canister IDs\n3. Restart the application\n\nCurrent IDs appear to be invalid.');
      } else {
        alert('🔌 Connection Failed\n\nPlease ensure:\n1. Plug Wallet is installed\n2. You have an active wallet\n3. Smart contracts are deployed\n\nError: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }

      return false;
    }
  }

  async logout() {
    if (window.ic?.plug && this.isAuthenticated) {
      try {
        await window.ic.plug.disconnect();
        this.isAuthenticated = false;
        this.principal = null;
        this.movieReviewsActor = null;
        this.cineTokenActor = null;
        this.userProfilesActor = null;
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  }

  private async setupActors() {
    if (!window.ic?.plug || !this.isAuthenticated) return;

    try {
      // Create actors using Plug Wallet
      this.movieReviewsActor = await window.ic.plug.createActor({
        canisterId: CANISTER_IDS.MOVIE_REVIEWS,
        interfaceFactory: movieReviewsIDL,
      });

      this.cineTokenActor = await window.ic.plug.createActor({
        canisterId: CANISTER_IDS.CINE_TOKEN,
        interfaceFactory: cineTokenIDL,
      });

      this.userProfilesActor = await window.ic.plug.createActor({
        canisterId: CANISTER_IDS.USER_PROFILES,
        interfaceFactory: userProfilesIDL,
      });

      console.log('✅ Smart contracts connected successfully');
    } catch (error) {
      console.error('Failed to setup actors (demo mode):', error);
      // In demo mode, we don't have real deployed contracts
      // This is expected and the UI will show demo functionality
      throw error; // Re-throw so login method can handle it
    }
  }

  // Authentication methods
  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getPrincipal() {
    return this.principal;
  }

  isDemoMode() {
    return DEMO_MODE;
  }

  // Movie Reviews methods
  async createReview(movieId: string, rating: number, title: string, content: string) {
    if (!this.movieReviewsActor) throw new Error('Not authenticated');

    const result = await this.movieReviewsActor.createReview({
      movieId,
      rating,
      title,
      content,
    });

    // If review creation successful, reward the user
    if ('ok' in result && this.cineTokenActor && this.principal) {
      try {
        const rewardType = content.length > 100 ? { QualityReview: null } : { MovieReview: null };
        await this.cineTokenActor.rewardUser(
          this.principal,
          rewardType,
          `Review for movie: ${movieId}`
        );
      } catch (error) {
        console.log('Failed to reward review:', error);
      }
    }

    return result;
  }

  async getMovieReviews(movieId: string) {
    if (!this.movieReviewsActor) throw new Error('Not authenticated');
    return await this.movieReviewsActor.getMovieReviews(movieId);
  }

  async voteHelpful(reviewId: string) {
    if (!this.movieReviewsActor) throw new Error('Not authenticated');

    const result = await this.movieReviewsActor.voteHelpful(reviewId);

    // If vote successful, reward the voter
    if ('ok' in result && this.cineTokenActor && this.principal) {
      try {
        await this.cineTokenActor.rewardUser(
          this.principal,
          { HelpfulVote: null },
          'Helpful vote on review'
        );
      } catch (error) {
        console.log('Failed to reward helpful vote:', error);
      }
    }

    return result;
  }

  async rewardUser(rewardType: string, description: string) {
    if (!this.cineTokenActor || !this.principal) throw new Error('Not authenticated');

    const rewardTypeVariant = { [rewardType]: null };
    return await this.cineTokenActor.rewardUser(
      this.principal,
      rewardTypeVariant,
      description
    );
  }

  async getMovieRatingSummary(movieId: string) {
    if (!this.movieReviewsActor) throw new Error('Not authenticated');
    return await this.movieReviewsActor.getMovieRatingSummary(movieId);
  }

  // Token methods
  async getTokenBalance() {
    if (!this.cineTokenActor) throw new Error('Not authenticated');
    const principal = this.getPrincipal();
    if (!principal) throw new Error('No principal found');
    
    return await this.cineTokenActor.icrc1_balance_of(principal);
  }

  async getRewardHistory() {
    if (!this.cineTokenActor) throw new Error('Not authenticated');
    const principal = this.getPrincipal();
    if (!principal) throw new Error('No principal found');
    
    return await this.cineTokenActor.getUserRewardHistory(principal);
  }

  // User Profile methods
  async getOrCreateProfile() {
    if (!this.userProfilesActor) throw new Error('Not authenticated');
    return await this.userProfilesActor.getOrCreateProfile();
  }

  async updateProfile(update: any) {
    if (!this.userProfilesActor) throw new Error('Not authenticated');
    return await this.userProfilesActor.updateProfile(update);
  }

  async addToWatchlist(movieId: string) {
    if (!this.userProfilesActor) throw new Error('Not authenticated');
    return await this.userProfilesActor.addToWatchlist(movieId);
  }

  async removeFromWatchlist(movieId: string) {
    if (!this.userProfilesActor) throw new Error('Not authenticated');
    return await this.userProfilesActor.removeFromWatchlist(movieId);
  }

  async addToWatchHistory(movieId: string, rating?: number, watchTime?: number, completed: boolean = true) {
    if (!this.userProfilesActor) throw new Error('Not authenticated');
    return await this.userProfilesActor.addToWatchHistory(
      movieId, 
      rating ? [rating] : [], 
      watchTime ? [watchTime] : [], 
      completed
    );
  }
}

// Singleton instance
export const icpService = new ICPService();
