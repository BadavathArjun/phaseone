import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();

  const dashboardCards = [
    {
      title: 'Campaigns',
      description: 'View and manage your campaigns',
      path: '/campaigns',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'dashboard-card-blue',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      title: 'Messages',
      description: 'Chat with brands and influencers',
      path: '/messages',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      bgColor: 'dashboard-card-green',
      hoverColor: 'hover:bg-green-100'
    },
    {
      title: 'Search Influencers',
      description: 'Discover influencers by category and platform',
      path: '/search',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'dashboard-card-purple',
      hoverColor: 'hover:bg-purple-100'
    }
  ];

  if (currentUser?.role === 'brand') {
    dashboardCards.push({
      title: 'Proposals',
      description: 'View and manage campaign proposals',
      path: '/proposals',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      bgColor: 'dashboard-card-orange',
      hoverColor: 'hover:bg-orange-100'
    });
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Welcome back, {currentUser?.name || 'User'}!
          </h1>
          <p className="dashboard-subtitle">
            Here's what's happening with your{' '}
            <span className="dashboard-role">
              {currentUser?.role}
            </span>{' '}
            account today.
          </p>
        </div>

        {/* Main Dashboard Cards */}
        <div className="dashboard-cards">
          {dashboardCards.map((card, index) => (
            <Link
              key={index}
              to={card.path}
              className={`dashboard-card ${card.bgColor} ${card.hoverColor}`}
            >
              <div className="dashboard-card-content">
                <div className="dashboard-card-header">
                  <div className={`dashboard-card-icon bg-gradient-to-r ${card.color}`}>
                    {card.icon}
                  </div>
                  <div className="dashboard-card-arrow">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="dashboard-card-title">
                  {card.title}
                </h3>
                <p className="dashboard-card-description">
                  {card.description}
                </p>
              </div>
              <div className={`dashboard-card-progress bg-gradient-to-r ${card.color}`}></div>
            </Link>
          ))}
        </div>

        {/* Stats and Activity Container */}
        <div className="dashboard-content">
          {/* Quick Stats Section */}
          <div className="dashboard-stats">
            <h2 className="dashboard-stats-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="dashboard-stats-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Quick Stats
            </h2>
            <div className="dashboard-stats-grid">
              <div className="dashboard-stat-item">
                <div className="dashboard-stat-value dashboard-stat-blue">
                  12
                </div>
                <div className="dashboard-stat-label">Active Campaigns</div>
              </div>
              <div className="dashboard-stat-item">
                <div className="dashboard-stat-value dashboard-stat-green">
                  8
                </div>
                <div className="dashboard-stat-label">Messages</div>
              </div>
              <div className="dashboard-stat-item">
                <div className="dashboard-stat-value dashboard-stat-purple">
                  24
                </div>
                <div className="dashboard-stat-label">Proposals</div>
              </div>
              <div className="dashboard-stat-item">
                <div className="dashboard-stat-value dashboard-stat-orange">
                  95%
                </div>
                <div className="dashboard-stat-label">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="dashboard-activity">
            <h2 className="dashboard-activity-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="dashboard-activity-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Activity
            </h2>
            <div className="dashboard-activity-list">
              <div className="dashboard-activity-item">
                <div className="dashboard-activity-item-icon dashboard-activity-icon-blue">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="dashboard-activity-item-content">
                  <div className="dashboard-activity-item-title">New campaign proposal received</div>
                  <div className="dashboard-activity-item-time">2 hours ago</div>
                </div>
              </div>
              <div className="dashboard-activity-item">
                <div className="dashboard-activity-item-icon dashboard-activity-icon-green">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="dashboard-activity-item-content">
                  <div className="dashboard-activity-item-title">New message from influencer</div>
                  <div className="dashboard-activity-item-time">4 hours ago</div>
                </div>
              </div>
              <div className="dashboard-activity-item">
                <div className="dashboard-activity-item-icon dashboard-activity-icon-purple">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="dashboard-activity-item-content">
                  <div className="dashboard-activity-item-title">Profile views increased by 15%</div>
                  <div className="dashboard-activity-item-time">1 day ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
