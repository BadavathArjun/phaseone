import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { campaignsAPI } from '../api/auth';

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await campaignsAPI.get(id);
        setCampaign(response.data);
      } catch (err) {
        setError('Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center mt-4">{error}</div>;
  }

  if (!campaign) {
    return <div className="text-center mt-4">Campaign not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
      <p className="mb-4">{campaign.description}</p>
      <p className="mb-2"><strong>Budget:</strong> ${campaign.budget}</p>
      <p className="mb-2"><strong>Requirements:</strong> {campaign.requirements}</p>
      <p className="mb-2"><strong>Categories:</strong> {campaign.categories.join(', ')}</p>
      <p className="mb-2"><strong>Platforms:</strong> {campaign.platforms.join(', ')}</p>
      <p className="mb-2"><strong>Deadline:</strong> {new Date(campaign.deadline).toLocaleDateString()}</p>
    </div>
  );
};

export default CampaignDetail;
