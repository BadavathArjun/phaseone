import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();

  const dashboardCards = [
    {
      title: 'Campaigns',
      description: 'View and manage your campaigns',
      path: '/campaigns',
      icon: '📊',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      title: 'Messages',
      description: 'Chat with brands and influencers',
      path: '/messages',
      icon: '💬',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      title: 'Search Influencers',
      description: 'Discover influencers by category and platform',
      path: '/search',
      icon: '🔍',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    }
  ];

  if (currentUser?.role === 'brand') {
    dashboardCards.push({
      title: 'Proposals',
      description: 'View and manage campaign proposals',
      path: '/proposals',
      icon: '📝',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100'
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome back!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Here's what's happening with your{' '}
            <span className="font-semibold text-blue-600 capitalize">
              {currentUser?.role}
            </span>{' '}
            account today.
          </p>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {dashboardCards.map((card, index) => (
            <Link
              key={index}
              to={card.path}
              className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${card.bgColor} ${card.hoverColor} border border-gray-100`}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
            </Link>
          ))}
        </div>

        {/* Quick Stats Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">12</span>
              </div>
              <div className="text-gray-600 font-medium">Active Campaigns</div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">8</span>
              </div>
              <div className="text-gray-600 font-medium">Messages</div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">24</span>
              </div>
              <div className="text-gray-600 font-medium">Proposals</div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">95%</span>
              </div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex-center">
                <span className="text-blue-600">📊</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">New campaign proposal received</div>
                <div className="text-sm text-gray-600">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-full flex-center">
                <span className="text-green-600">💬</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">New message from influencer</div>
                <div className="text-sm text-gray-600">4 hours ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex-center">
                <span className="text-purple-600">🔍</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Profile views increased by 15%</div>
                <div className="text-sm text-gray-600">1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
