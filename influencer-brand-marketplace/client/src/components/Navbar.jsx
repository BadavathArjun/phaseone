import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="flex-between h-16">
          <div className="flex-start">
            <Link to="/dashboard" className="navbar-brand text-gradient">
              Influencer Market
            </Link>
          </div>

          {currentUser && (
            <div className="flex items-center space-x-6">
              <Link
                to="/dashboard"
                className="navbar-link"
              >
                Dashboard
              </Link>

              <Link
                to="/campaigns"
                className="navbar-link"
              >
                Campaigns
              </Link>

              {currentUser.role === 'brand' && (
                <Link
                  to="/search"
                  className="navbar-link"
                >
                  Search Influencers
                </Link>
              )}

              {currentUser.role === 'brand' && (
                <Link
                  to="/create-campaign"
                  className="navbar-link"
                >
                  Create Campaign
                </Link>
              )}

              <Link
                to="/messages"
                className="navbar-link"
              >
                Messages
              </Link>

              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex-center text-white text-sm font-medium">
                    {currentUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-gray-900">
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {currentUser.role}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
