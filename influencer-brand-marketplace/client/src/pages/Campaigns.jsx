import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignsAPI } from '../api/auth';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await campaignsAPI.getAll();
        setCampaigns(response.data);
      } catch (err) {
        setError('Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center mt-4">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Campaigns</h1>
      {campaigns.length === 0 ? (
        <p>No campaigns available.</p>
      ) : (
        <ul className="space-y-4">
          {campaigns.map((campaign) => (
            <li key={campaign._id} className="bg-white rounded shadow p-4">
              <Link to={`/campaigns/${campaign._id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                {campaign.title}
              </Link>
              <p className="text-gray-600">{campaign.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Campaigns;
