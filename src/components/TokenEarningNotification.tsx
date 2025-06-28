'use client';

import { useState, useEffect } from 'react';
import { Coins, CheckCircle } from 'lucide-react';

interface TokenEarningNotificationProps {
  show: boolean;
  amount: number;
  type: 'review' | 'vote' | 'daily' | 'referral' | 'achievement';
  onClose: () => void;
}

export default function TokenEarningNotification({ 
  show, 
  amount, 
  type, 
  onClose 
}: TokenEarningNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const getTypeInfo = () => {
    switch (type) {
      case 'review':
        return {
          icon: '📝',
          title: 'Review Reward',
          description: 'Thank you for your movie review!'
        };
      case 'vote':
        return {
          icon: '👍',
          title: 'Helpful Vote Reward',
          description: 'Thanks for building community trust!'
        };
      case 'daily':
        return {
          icon: '📅',
          title: 'Daily Login Bonus',
          description: 'Welcome back to CineAI!'
        };
      case 'referral':
        return {
          icon: '🤝',
          title: 'Referral Reward',
          description: 'Thanks for growing our community!'
        };
      case 'achievement':
        return {
          icon: '🏆',
          title: 'Achievement Unlocked',
          description: 'Congratulations on your milestone!'
        };
      default:
        return {
          icon: '💰',
          title: 'Token Reward',
          description: 'You earned CINE tokens!'
        };
    }
  };

  const typeInfo = getTypeInfo();

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-2xl p-4 max-w-sm border border-green-500/20">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg">{typeInfo.icon}</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-200" />
              <h3 className="text-sm font-semibold text-white">
                {typeInfo.title}
              </h3>
            </div>
            
            <p className="text-xs text-green-100 mb-2">
              {typeInfo.description}
            </p>
            
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-bold text-yellow-300">
                +{amount} CINE
              </span>
              <span className="text-xs text-green-200">
                sent to wallet
              </span>
            </div>
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 text-green-200 hover:text-white transition-colors"
          >
            <span className="text-lg">×</span>
          </button>
        </div>
      </div>
    </div>
  );
}
