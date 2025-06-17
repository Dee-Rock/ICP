'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  realTimeMetrics: {
    activeUsers: number;
    searchesPerMinute: number;
    aiAnalysesPerMinute: number;
    averageResponseTime: number;
    systemLoad: number;
    errorRate: number;
  };
  searchAnalytics: {
    topSearchTerms: Array<{ term: string; count: number; trend: 'up' | 'down' | 'stable' }>;
    searchTypes: {
      vectorSearch: number;
      keywordSearch: number;
      moodSearch: number;
      voiceSearch: number;
    };
    languageDistribution: Array<{ language: string; percentage: number; flag: string }>;
    searchSuccessRate: number;
  };
  movieAnalytics: {
    topMovies: Array<{ title: string; views: number; rating: number; trend: string }>;
    genrePopularity: Array<{ genre: string; percentage: number; color: string }>;
  };
  aiPerformance: {
    recommendationAccuracy: number;
    vectorSearchPrecision: number;
    translationQuality: number;
    analysisConfidence: number;
    processingSpeed: number;
  };
  systemHealth: {
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
    databaseConnections: number;
  };
}

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnalyticsDashboard({ isOpen, onClose }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen) {
      loadAnalytics();
      const interval = setInterval(loadAnalytics, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics?realTime=true');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-700 w-full max-w-7xl h-[95vh] sm:h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-4 sm:p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-2xl sm:text-3xl">📊</span>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-white">CineAI Analytics</h2>
                <p className="text-gray-300 text-sm sm:text-base hidden sm:block">Real-time insights and performance metrics</p>
                <p className="text-gray-300 text-xs sm:hidden">Live metrics</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl sm:text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-800 px-2 sm:px-6 py-3 border-b border-gray-700">
          <div className="flex gap-1 sm:gap-3 lg:gap-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: '📈' },
              { id: 'search', label: 'Search', icon: '🔍' },
              { id: 'movies', label: 'Movies', icon: '🎬' },
              { id: 'ai', label: 'AI', icon: '🤖' },
              { id: 'system', label: 'System', icon: '⚡' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span className="text-sm sm:text-base">{tab.icon}</span>
                <span className="font-medium text-xs sm:text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 h-full overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading analytics data...</p>
              </div>
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              {activeTab === 'overview' && <OverviewTab analytics={analytics} />}
              {activeTab === 'search' && <SearchTab analytics={analytics} />}
              {activeTab === 'movies' && <MoviesTab analytics={analytics} />}
              {activeTab === 'ai' && <AITab analytics={analytics} />}
              {activeTab === 'system' && <SystemTab analytics={analytics} />}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p>Failed to load analytics data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ analytics }: { analytics: AnalyticsData }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {/* Real-time Metrics */}
      <MetricCard
        title="Active Users"
        value={analytics.realTimeMetrics.activeUsers.toLocaleString()}
        icon="👥"
        color="green"
        trend="+12%"
      />
      <MetricCard
        title="Searches/Min"
        value={analytics.realTimeMetrics.searchesPerMinute.toString()}
        icon="🔍"
        color="blue"
        trend="+8%"
      />
      <MetricCard
        title="AI Analyses/Min"
        value={analytics.realTimeMetrics.aiAnalysesPerMinute.toString()}
        icon="🤖"
        color="purple"
        trend="+15%"
      />
      <MetricCard
        title="Avg Response"
        value={`${analytics.realTimeMetrics.averageResponseTime.toFixed(0)}ms`}
        icon="⚡"
        color="yellow"
        trend="-5%"
      />

      {/* System Health Overview */}
      <div className="col-span-2 lg:col-span-4">
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span>⚡</span>
            <span className="hidden sm:inline">System Health Overview</span>
            <span className="sm:hidden">System Health</span>
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <HealthIndicator label="Uptime" value={`${analytics.systemHealth.uptime}%`} status="healthy" />
            <HealthIndicator label="Memory" value={`${analytics.systemHealth.memoryUsage.toFixed(1)}%`} status="warning" />
            <HealthIndicator label="CPU" value={`${analytics.systemHealth.cpuUsage.toFixed(1)}%`} status="healthy" />
            <HealthIndicator label="DB Connections" value={analytics.systemHealth.databaseConnections.toString()} status="healthy" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchTab({ analytics }: { analytics: AnalyticsData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Search Terms */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🔥</span>
          Top Search Terms
        </h3>
        <div className="space-y-3">
          {analytics.searchAnalytics.topSearchTerms.slice(0, 8).map((term, index) => (
            <div key={term.term} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm w-6">#{index + 1}</span>
                <span className="text-white font-medium">{term.term}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{term.count.toLocaleString()}</span>
                <span className={`text-sm ${
                  term.trend === 'up' ? 'text-green-400' : 
                  term.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {term.trend === 'up' ? '📈' : term.trend === 'down' ? '📉' : '📊'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Language Distribution */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🌍</span>
          Language Distribution
        </h3>
        <div className="space-y-3">
          {analytics.searchAnalytics.languageDistribution.map((lang) => (
            <div key={lang.language} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{lang.flag}</span>
                <span className="text-white font-medium">{lang.language}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${lang.percentage}%` }}
                  ></div>
                </div>
                <span className="text-gray-400 text-sm w-12">{lang.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MoviesTab({ analytics }: { analytics: AnalyticsData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Movies */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🏆</span>
          Most Popular Movies
        </h3>
        <div className="space-y-3">
          {analytics.movieAnalytics.topMovies.slice(0, 8).map((movie, index) => (
            <div key={movie.title} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm w-6">#{index + 1}</span>
                <div>
                  <span className="text-white font-medium block">{movie.title}</span>
                  <span className="text-gray-400 text-xs">⭐ {movie.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{movie.views.toLocaleString()}</span>
                <span className="text-lg">{movie.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Genre Popularity */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🎭</span>
          Genre Popularity
        </h3>
        <div className="space-y-3">
          {analytics.movieAnalytics.genrePopularity.map((genre) => (
            <div key={genre.genre} className="flex items-center justify-between">
              <span className="text-white font-medium">{genre.genre}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${genre.percentage}%`,
                      backgroundColor: genre.color
                    }}
                  ></div>
                </div>
                <span className="text-gray-400 text-sm w-12">{genre.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AITab({ analytics }: { analytics: AnalyticsData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AIMetricCard
        title="Recommendation Accuracy"
        value={`${analytics.aiPerformance.recommendationAccuracy}%`}
        icon="🎯"
        status="excellent"
      />
      <AIMetricCard
        title="Vector Search Precision"
        value={`${analytics.aiPerformance.vectorSearchPrecision}%`}
        icon="🧠"
        status="excellent"
      />
      <AIMetricCard
        title="Translation Quality"
        value={`${analytics.aiPerformance.translationQuality}%`}
        icon="🌍"
        status="excellent"
      />
      <AIMetricCard
        title="Analysis Confidence"
        value={`${analytics.aiPerformance.analysisConfidence}%`}
        icon="📊"
        status="good"
      />
      <AIMetricCard
        title="Processing Speed"
        value={`${analytics.aiPerformance.processingSpeed}s`}
        icon="⚡"
        status="good"
      />
    </div>
  );
}

function SystemTab({ analytics }: { analytics: AnalyticsData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">System Resources</h3>
        <div className="space-y-4">
          <ResourceBar label="Memory Usage" value={analytics.systemHealth.memoryUsage} max={100} color="blue" />
          <ResourceBar label="CPU Usage" value={analytics.systemHealth.cpuUsage} max={100} color="green" />
          <ResourceBar label="Uptime" value={analytics.systemHealth.uptime} max={100} color="purple" />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color, trend }: any) {
  const colorClasses = {
    green: 'border-green-500/30 bg-green-500/10',
    blue: 'border-blue-500/30 bg-blue-500/10',
    purple: 'border-purple-500/30 bg-purple-500/10',
    yellow: 'border-yellow-500/30 bg-yellow-500/10'
  };

  return (
    <div className={`rounded-lg sm:rounded-xl p-3 sm:p-6 border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <span className="text-lg sm:text-2xl">{icon}</span>
        <span className="text-green-400 text-xs sm:text-sm font-medium">{trend}</span>
      </div>
      <div className="text-lg sm:text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-xs sm:text-sm">{title}</div>
    </div>
  );
}

function HealthIndicator({ label, value, status }: any) {
  const statusColors = {
    healthy: 'text-green-400',
    warning: 'text-yellow-400',
    critical: 'text-red-400'
  };

  return (
    <div className="text-center">
      <div className={`text-lg font-bold ${statusColors[status as keyof typeof statusColors]}`}>{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}

function AIMetricCard({ title, value, icon, status }: any) {
  const statusColors = {
    excellent: 'border-green-500/30 bg-green-500/10',
    good: 'border-yellow-500/30 bg-yellow-500/10',
    poor: 'border-red-500/30 bg-red-500/10'
  };

  return (
    <div className={`rounded-xl p-6 border ${statusColors[status as keyof typeof statusColors]}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-white font-medium">{title}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

function ResourceBar({ label, value, max, color }: any) {
  const percentage = (value / max) * 100;
  const colorMap = {
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    red: '#ef4444',
    yellow: '#f59e0b'
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-medium">{value.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: colorMap[color as keyof typeof colorMap] || '#3b82f6'
          }}
        ></div>
      </div>
    </div>
  );
}
