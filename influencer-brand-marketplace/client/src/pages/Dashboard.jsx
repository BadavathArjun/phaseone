import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to Influencer Marketplace</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUser?.role === 'influencer' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Influencer Dashboard</h2>
            <p className="text-gray-600 mb-4">Manage your profile and find campaigns.</p>
            <Link to="/influencer-profile" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              View Profile
            </Link>
          </div>
        )}
        
        {currentUser?.role === 'brand' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Brand Dashboard</h2>
            <p className="text-gray-600 mb-4">Create campaigns and find influencers.</p>
            <Link to="/brand-profile" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              View Profile
            </Link>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Campaigns</h2>
          <p className="text-gray-600 mb-4">Browse and apply to campaigns.</p>
          <Link to="/campaigns" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            View Campaigns
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <p className="text-gray-600 mb-4">Communicate with other users.</p>
          <Link to="/messages" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            View Messages
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Trends</h2>
          <p className="text-gray-600 mb-4">Explore trending topics.</p>
          <Link to="/trends" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            View Trends
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
