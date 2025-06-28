'use client';

import { useState, useEffect } from 'react';

interface ShowcaseProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function DappathonShowcase({ isVisible, onClose }: ShowcaseProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);

  const features = [
    {
      icon: '🧠',
      title: 'Google Cloud Vector Search',
      description: 'Google Cloud Vertex AI with 768-dimensional embeddings for semantic movie discovery',
      tech: 'Google Cloud Vertex AI + Vector Search',
      demo: 'Search "movies about artificial intelligence" to see semantic matching in action'
    },
    {
      icon: '🤖',
      title: 'Google Cloud AI Analysis',
      description: '6 types of AI-powered movie analysis: themes, mood, cinematography, cultural impact, psychological, and technical',
      tech: 'Google Cloud Vertex AI + Custom Analysis Algorithms',
      demo: 'Click any movie and explore different AI analysis types'
    },
    {
      icon: '🎭',
      title: 'Mood-Based Recommendations',
      description: 'AI analyzes your current mood and context to suggest perfectly matched movies',
      tech: 'Machine Learning + Contextual AI',
      demo: 'Use the mood selector in search to get personalized recommendations'
    },
    {
      icon: '⚡',
      title: 'Real-Time Processing',
      description: 'Live statistics, instant AI analysis, and dynamic content updates',
      tech: 'Next.js + Real-time APIs',
      demo: 'Watch the live stats counter in the header update in real-time'
    },
    {
      icon: '🎬',
      title: 'Comprehensive Movie Database',
      description: 'Integration with TMDb API for millions of real movies with rich metadata',
      tech: 'TMDb API + Smart Caching',
      demo: 'Search for any movie title to access real movie data'
    },
    {
      icon: '🔍',
      title: 'Intelligent Filtering',
      description: 'AI-powered filters that understand context and user preferences',
      tech: 'Custom Filter Algorithms + UI/UX',
      demo: 'Use the AI Filters to narrow down results intelligently'
    }
  ];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 1000);

    const featureInterval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(featureInterval);
    };
  }, [isVisible, features.length]);

  if (!isVisible) return null;

  const currentFeatureData = features[currentFeature];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-3xl shadow-2xl border border-purple-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-8 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🏆</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
                  CineAI Dappathon Demo
                </h1>
                <p className="text-gray-400">Akwaaba Dappathon: Wave 2 - Web3 AI Movie Discovery Platform</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Current Feature */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-2xl">
                  {currentFeatureData.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentFeatureData.title}</h2>
                  <p className="text-purple-400 text-sm font-medium">{currentFeatureData.tech}</p>
                </div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed">
                {currentFeatureData.description}
              </p>

              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <h3 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                  <span>🎯</span>
                  <span>Try it now:</span>
                </h3>
                <p className="text-gray-300 text-sm">{currentFeatureData.demo}</p>
              </div>

              {/* Feature Progress */}
              <div className="flex items-center gap-2">
                {features.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentFeature
                        ? 'w-8 bg-purple-500'
                        : 'w-2 bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Technical Highlights */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>⚡</span>
                <span>Technical Highlights</span>
              </h3>

              <div className="space-y-4">
                {[
                  { icon: '🧠', title: 'Google Cloud Vertex AI', desc: '768-dimensional embeddings for semantic similarity' },
                  { icon: '⛓️', title: 'Internet Computer Protocol', desc: 'Decentralized blockchain for Web3 functionality' },
                  { icon: '💰', title: 'CINE Token (ICRC-1)', desc: 'Real token rewards for community participation' },
                  { icon: '🔌', title: 'Plug Wallet Integration', desc: 'Seamless Web3 wallet connection and transactions' },
                  { icon: '⚡', title: 'Next.js 14', desc: 'Modern React framework with server-side rendering' },
                  { icon: '🔍', title: 'TMDb API', desc: 'Access to millions of real movie records' }
                ].map((tech, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      animationStep === index % 4 ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-gray-800/30'
                    }`}
                  >
                    <span className="text-xl">{tech.icon}</span>
                    <div>
                      <h4 className="text-white font-semibold">{tech.title}</h4>
                      <p className="text-gray-400 text-sm">{tech.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dappathon Themes */}
          <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🏆</span>
              <span>Akwaaba Dappathon: Wave 2 Themes</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                <div className="text-2xl mb-2">🤖</div>
                <h4 className="text-blue-400 font-semibold mb-2">Artificial Intelligence</h4>
                <p className="text-gray-300 text-sm">Advanced Google Cloud AI integration with semantic search and intelligent recommendations</p>
              </div>
              <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                <div className="text-2xl mb-2">💰</div>
                <h4 className="text-green-400 font-semibold mb-2">Decentralized Finance</h4>
                <p className="text-gray-300 text-sm">ICRC-1 CINE token with automated rewards and community-driven economics</p>
              </div>
              <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                <div className="text-2xl mb-2">💳</div>
                <h4 className="text-purple-400 font-semibold mb-2">Digital Payments</h4>
                <p className="text-gray-300 text-sm">Seamless Plug Wallet integration for instant token transactions and rewards</p>
              </div>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'AI Models', value: '3+', icon: '🧠' },
              { label: 'Smart Contracts', value: '3', icon: '⛓️' },
              { label: 'Movie Records', value: '1M+', icon: '🎬' },
              { label: 'Token Rewards', value: '6', icon: '💰' }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 text-center"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
            >
              🚀 Start Exploring CineAI
            </button>
            <p className="text-gray-400 text-sm mt-2">
              Experience the future of Web3 AI-powered movie discovery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
