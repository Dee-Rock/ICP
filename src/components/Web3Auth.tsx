'use client';

import React, { useState } from 'react';
import { Wallet, LogOut, Coins, User, Shield } from 'lucide-react';

// Fallback hooks for when ICP context is not available
const useFallbackAuth = () => ({
  isAuthenticated: false,
  isLoading: false,
  login: async () => {
    alert('🚀 Deploy Smart Contracts Required\n\nTo enable real blockchain functionality:\n\n1. Deploy smart contracts: dfx deploy\n2. Update canister IDs in .env.local\n3. Install Plug Wallet: https://plugwallet.ooo/\n4. Connect and start earning real CINE tokens!\n\nReal blockchain features await!');
    return false;
  },
  logout: async () => {},
  principal: null,
  userProfile: null
});

const useFallbackTokens = () => ({
  tokenBalance: 0
});

// Try to import ICP context, fall back to demo mode if not available
let useICPAuth: any, useICPTokens: any;
try {
  const icpContext = require('@/contexts/ICPContext');
  useICPAuth = icpContext.useICPAuth;
  useICPTokens = icpContext.useICPTokens;
} catch (error) {
  console.log('ICP context not available, using demo mode');
  useICPAuth = useFallbackAuth;
  useICPTokens = useFallbackTokens;
}

const Web3Auth: React.FC = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Try to use ICP context, fall back to demo mode
  let authData, tokenData;
  try {
    authData = useICPAuth();
    tokenData = useICPTokens();
  } catch (error) {
    authData = useFallbackAuth();
    tokenData = useFallbackTokens();
  }

  const { isAuthenticated, isLoading, login, logout, principal, userProfile } = authData;
  const { tokenBalance } = tokenData;

  const handleLogin = async () => {
    try {
      const success = await login();
      if (!success) {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatPrincipal = (principal: any) => {
    if (!principal) return '';
    const principalStr = principal.toString();
    return `${principalStr.slice(0, 5)}...${principalStr.slice(-5)}`;
  };

  const formatTokenBalance = (balance: number) => {
    return balance.toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span className="text-sm text-gray-300">Connecting...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={handleLogin}
        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm"
      >
        <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="font-medium hidden sm:inline">Connect Plug Wallet</span>
        <span className="font-medium sm:hidden">Connect</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowProfile(!showProfile)}
        className="flex items-center space-x-1 sm:space-x-3 px-2 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200"
      >
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-medium text-white">
              {userProfile?.username || formatPrincipal(principal)}
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Coins className="h-3 w-3" />
              <span>{formatTokenBalance(tokenBalance)} CINE</span>
            </div>
          </div>
          {/* Mobile: Show only token balance */}
          <div className="sm:hidden">
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Coins className="h-3 w-3" />
              <span className="text-white font-medium">{formatTokenBalance(tokenBalance)}</span>
            </div>
          </div>
        </div>
      </button>

      {showProfile && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {userProfile?.username || 'Anonymous User'}
                </h3>
                <p className="text-sm text-gray-400">
                  {formatPrincipal(principal)}
                </p>
                {userProfile?.isVerified && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Shield className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Token Balance */}
            <div className="bg-gray-900 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-white">CINE Tokens</span>
                </div>
                <span className="text-lg font-bold text-yellow-500">
                  {formatTokenBalance(tokenBalance)}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Earn tokens by writing reviews and engaging with the community
              </p>
            </div>

            {/* User Stats */}
            {userProfile && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-900 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-blue-500">
                    {userProfile.stats.totalReviews}
                  </div>
                  <div className="text-xs text-gray-400">Reviews</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-500">
                    {userProfile.stats.reputation}
                  </div>
                  <div className="text-xs text-gray-400">Reputation</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-purple-500">
                    {userProfile.stats.moviesWatched}
                  </div>
                  <div className="text-xs text-gray-400">Movies</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-orange-500">
                    {userProfile.watchlist.length}
                  </div>
                  <div className="text-xs text-gray-400">Watchlist</div>
                </div>
              </div>
            )}

            {/* Bio */}
            {userProfile?.bio && (
              <div className="bg-gray-900 rounded-lg p-3">
                <h4 className="text-sm font-medium text-white mb-2">Bio</h4>
                <p className="text-sm text-gray-300">{userProfile.bio}</p>
              </div>
            )}

            {/* Favorite Genres */}
            {userProfile?.favoriteGenres && userProfile.favoriteGenres.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-3">
                <h4 className="text-sm font-medium text-white mb-2">Favorite Genres</h4>
                <div className="flex flex-wrap gap-1">
                  {userProfile.favoriteGenres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-600 text-xs text-white rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Disconnect Wallet</span>
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showProfile && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfile(false)}
        />
      )}
    </div>
  );
};

export default Web3Auth;
