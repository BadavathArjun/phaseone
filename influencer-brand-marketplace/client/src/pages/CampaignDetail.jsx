import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { campaignsAPI } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

const CampaignDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalMessage, setProposalMessage] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await campaignsAPI.get(id);
        setCampaign(response.data);
      } catch {
        setError('Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleApply = async () => {
    if (!proposalMessage.trim()) {
      setError('Please enter a proposal message');
      return;
    }

    setApplying(true);
    try {
      await campaignsAPI.apply(id, { message: proposalMessage });
      setShowProposalForm(false);
      setProposalMessage('');
      // Refresh campaign data to show updated proposals
      const response = await campaignsAPI.get(id);
      setCampaign(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setApplying(false);
    }
  };

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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {campaign.categories.map(category => (
              <span key={category} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-700 leading-relaxed">{campaign.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Budget:</span>
                <span className="font-semibold text-green-600">${campaign.budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deadline:</span>
                <span className="font-semibold">{new Date(campaign.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {campaign.platforms.map(platform => (
                <span key={platform} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>

        {campaign.requirements && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-gray-700">{campaign.requirements}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Save for Later
          </button>
          {currentUser?.role === 'influencer' && (
            <button
              onClick={() => setShowProposalForm(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Apply Now
            </button>
          )}
        </div>

        {/* Proposal Form Modal */}
        {showProposalForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="proposal-modal-title"
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
              <h3
                id="proposal-modal-title"
                className="text-lg font-semibold text-gray-900 mb-4"
              >
                Submit Your Proposal
              </h3>
              <form onSubmit={(e) => { e.preventDefault(); handleApply(); }}>
                <div className="mb-4">
                  <label
                    htmlFor="proposal-message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Proposal Message
                  </label>
                  <textarea
                    id="proposal-message"
                    value={proposalMessage}
                    onChange={(e) => setProposalMessage(e.target.value)}
                    placeholder="Tell the brand why you're the perfect influencer for this campaign..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    required
                    aria-describedby="proposal-help"
                  />
                  <p id="proposal-help" className="mt-1 text-sm text-gray-500">
                    Explain why you're the right fit for this campaign
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowProposalForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {applying ? 'Submitting...' : 'Submit Proposal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetail;
