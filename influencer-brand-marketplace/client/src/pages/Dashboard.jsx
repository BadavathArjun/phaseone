import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/campaigns"
          className="bg-indigo-600 text-white rounded-lg p-6 shadow hover:bg-indigo-700 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Campaigns</h2>
          <p>View and manage your campaigns</p>
        </Link>

        <Link
          to="/messages"
          className="bg-indigo-600 text-white rounded-lg p-6 shadow hover:bg-indigo-700 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Messages</h2>
          <p>Chat with brands and influencers</p>
        </Link>

        <Link
          to="/search"
          className="bg-indigo-600 text-white rounded-lg p-6 shadow hover:bg-indigo-700 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Search Influencers</h2>
          <p>Discover influencers by category and platform</p>
        </Link>

        {currentUser?.role === 'brand' && (
          <Link
            to="/proposals"
            className="bg-indigo-600 text-white rounded-lg p-6 shadow hover:bg-indigo-700 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Proposals</h2>
            <p>View and manage campaign proposals</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
