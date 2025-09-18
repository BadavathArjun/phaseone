import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { influencerAPI } from '../api/influencer';

export default function Trends({ influencerId }) {
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await influencerAPI.getInstagramStats(influencerId);
        setStats(response.data);
      } catch (error) {
        setError('Failed to load Instagram stats');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [influencerId, timeRange]);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Instagram data not available</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const { followersHistory, engagementHistory, currentFollowers, engagementRate } = stats;

  // Filter data based on selected time range
  const filterData = (data) => {
    const now = new Date();
    let cutoffDate;
    
    switch (timeRange) {
      case '7d':
        cutoffDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        cutoffDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        cutoffDate = new Date(now.setDate(now.getDate() - 90));
        break;
      default:
        cutoffDate = new Date(now.setDate(now.getDate() - 7));
    }
    
    return data.filter(item => new Date(item.date) >= cutoffDate);
  };

  const filteredFollowers = filterData(followersHistory);
  const filteredEngagement = filterData(engagementHistory);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Performance Trends</h2>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Current Followers</p>
          <p className="text-2xl font-bold">{currentFollowers?.toLocaleString() || 'N/A'}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Engagement Rate</p>
          <p className="text-2xl font-bold">{engagementRate ? `${engagementRate.toFixed(2)}%` : 'N/A'}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Posts (30 days)</p>
          <p className="text-2xl font-bold">{engagementHistory.filter(item => {
            const postDate = new Date(item.date);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return postDate >= thirtyDaysAgo;
          }).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Followers Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredFollowers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value.toLocaleString(), 'Followers']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Engagement Rate Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Engagement Rate']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Legend />
                <Bar 
                  dataKey="rate" 
                  fill="#4f46e5" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}