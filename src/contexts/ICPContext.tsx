'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { icpService, UserProfile } from '@/lib/icp';
import { Principal } from '@dfinity/principal';

interface ICPContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  principal: Principal | null;
  userProfile: UserProfile | null;
  tokenBalance: number;
  isDemoMode: boolean;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshTokenBalance: () => Promise<void>;
  createReview: (movieId: string, rating: number, title: string, content: string) => Promise<any>;
  getMovieReviews: (movieId: string) => Promise<any>;
  addToWatchlist: (movieId: string) => Promise<any>;
  removeFromWatchlist: (movieId: string) => Promise<any>;
  voteHelpful: (reviewId: string) => Promise<any>;
}

const ICPContext = createContext<ICPContextType | undefined>(undefined);

export const useICP = () => {
  const context = useContext(ICPContext);
  if (context === undefined) {
    throw new Error('useICP must be used within an ICPProvider');
  }
  return context;
};

interface ICPProviderProps {
  children: ReactNode;
}

export const ICPProvider: React.FC<ICPProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(true);

  useEffect(() => {
    initializeICP();
  }, []);

  const initializeICP = async () => {
    try {
      setIsLoading(true);
      await icpService.init();
      
      if (icpService.getIsAuthenticated()) {
        setIsAuthenticated(true);
        setPrincipal(icpService.getPrincipal() || null);
        setIsDemoMode(icpService.isDemoMode());
        await refreshProfile();
        await refreshTokenBalance();
      }
    } catch (error) {
      console.error('Failed to initialize ICP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const success = await icpService.login();

      if (success) {
        setIsAuthenticated(true);
        setPrincipal(icpService.getPrincipal() || null);
        await refreshProfile();
        await refreshTokenBalance();

        // Check for daily login bonus
        await checkDailyLoginBonus();
      }

      return success;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkDailyLoginBonus = async () => {
    try {
      const lastLogin = localStorage.getItem('lastLoginDate');
      const today = new Date().toDateString();

      if (lastLogin !== today) {
        // Award daily login bonus
        const result = await icpService.rewardUser('DailyLogin', 'Daily platform usage');
        if ('ok' in result) {
          localStorage.setItem('lastLoginDate', today);
          await refreshTokenBalance();

          // Show notification (you can emit an event here for the UI to catch)
          setTimeout(() => {
            alert('🎉 Daily Login Bonus!\n\n✅ 0.02 CINE tokens earned\n✅ Welcome back to CineAI!\n\nKeep coming back for daily rewards!');
          }, 2000);
        }
      }
    } catch (error) {
      console.log('Daily login bonus not available:', error);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await icpService.logout();
      setIsAuthenticated(false);
      setPrincipal(null);
      setUserProfile(null);
      setTokenBalance(0);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      if (!isAuthenticated) return;
      
      const profile = await icpService.getOrCreateProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const refreshTokenBalance = async (): Promise<void> => {
    try {
      if (!isAuthenticated) return;
      
      const balance = await icpService.getTokenBalance();
      setTokenBalance(Number(balance) / 100_000_000); // Convert from smallest unit
    } catch (error) {
      console.error('Failed to refresh token balance:', error);
    }
  };

  const createReview = async (movieId: string, rating: number, title: string, content: string) => {
    try {
      if (!isAuthenticated) throw new Error('Not authenticated');
      
      const result = await icpService.createReview(movieId, rating, title, content);
      
      // Refresh profile and token balance after creating review
      await refreshProfile();
      await refreshTokenBalance();
      
      return result;
    } catch (error) {
      console.error('Failed to create review:', error);
      throw error;
    }
  };

  const getMovieReviews = async (movieId: string) => {
    try {
      return await icpService.getMovieReviews(movieId);
    } catch (error) {
      console.error('Failed to get movie reviews:', error);
      throw error;
    }
  };

  const addToWatchlist = async (movieId: string) => {
    try {
      if (!isAuthenticated) throw new Error('Not authenticated');
      
      const result = await icpService.addToWatchlist(movieId);
      await refreshProfile();
      
      return result;
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
      throw error;
    }
  };

  const removeFromWatchlist = async (movieId: string) => {
    try {
      if (!isAuthenticated) throw new Error('Not authenticated');
      
      const result = await icpService.removeFromWatchlist(movieId);
      await refreshProfile();
      
      return result;
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
      throw error;
    }
  };

  const voteHelpful = async (reviewId: string) => {
    try {
      if (!isAuthenticated) throw new Error('Not authenticated');
      
      const result = await icpService.voteHelpful(reviewId);
      await refreshTokenBalance(); // User might get reward tokens
      
      return result;
    } catch (error) {
      console.error('Failed to vote helpful:', error);
      throw error;
    }
  };

  const contextValue: ICPContextType = {
    isAuthenticated,
    isLoading,
    principal,
    userProfile,
    tokenBalance,
    isDemoMode,
    login,
    logout,
    refreshProfile,
    refreshTokenBalance,
    createReview,
    getMovieReviews,
    addToWatchlist,
    removeFromWatchlist,
    voteHelpful,
  };

  return (
    <ICPContext.Provider value={contextValue}>
      {children}
    </ICPContext.Provider>
  );
};

// Hook for easy access to ICP functionality
export const useICPAuth = () => {
  const { isAuthenticated, isLoading, login, logout, principal, userProfile } = useICP();
  return { isAuthenticated, isLoading, login, logout, principal, userProfile };
};

export const useICPReviews = () => {
  const { createReview, getMovieReviews, voteHelpful } = useICP();
  return { createReview, getMovieReviews, voteHelpful };
};

export const useICPWatchlist = () => {
  const { addToWatchlist, removeFromWatchlist, userProfile } = useICP();
  return { 
    addToWatchlist, 
    removeFromWatchlist, 
    watchlist: userProfile?.watchlist || [] 
  };
};

export const useICPTokens = () => {
  const { tokenBalance, refreshTokenBalance } = useICP();
  return { tokenBalance, refreshTokenBalance };
};
