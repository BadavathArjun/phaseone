import { useState, useEffect } from 'react';
import { campaignsAPI } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

const Proposals = () => {
  const { currentUser } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Get campaigns created by the current brand
        const response = await campaignsAPI.getAll();
        const brandCampaigns = response.data.filter(campaign =>
          campaign.brandId._id === currentUser.brandId
        );
        setCampaigns(brandCampaigns);
      } catch {
        setError('Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.role === 'brand') {
      fetchCampaigns();
    }
  }, [currentUser]);

  const handleProposalAction = async (campaignId, proposalId, action) => {
    try {
      await campaignsAPI.updateProposal(campaignId, proposalId, action);
      // Refresh campaigns after update
      const response = await campaignsAPI.getAll();
      const brandCampaigns = response.data.filter(campaign =>
        campaign.brandId._id === currentUser.brandId
      );
      setCampaigns(brandCampaigns);
    } catch {
      setError('Failed to update proposal');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64" role="status" aria-live="polite">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center mt-4" role="alert">{error}</div>;
  }

  if (currentUser?.role !== 'brand') {
    return <div className="text-center mt-4" role="alert">Access denied. Only brands can view proposals.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Campaign Proposals</h1>

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No campaigns found. Create a campaign to receive proposals.</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {campaigns.map(campaign => (
            <div key={campaign._id} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div className="mb-2 sm:mb-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{campaign.title}</h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">{campaign.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium self-start sm:self-auto ${
                  campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                  campaign.status === 'closed' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {campaign.status}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">
                  Proposals ({campaign.proposals.length})
                </h3>

                {campaign.proposals.length === 0 ? (
                  <p className="text-gray-500">No proposals yet.</p>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {campaign.proposals.map(proposal => (
                      <div key={proposal._id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                          <div className="mb-2 sm:mb-0">
                            <p className="font-medium text-gray-900 text-sm sm:text-base">
                              Influencer ID: {proposal.influencerId}
                            </p>
                            <p className="text-sm text-gray-500">
                              Submitted: {new Date(proposal.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                            proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {proposal.status}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4 text-sm sm:text-base">{proposal.message}</p>

                        {proposal.status === 'pending' && (
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <button
                              onClick={() => handleProposalAction(campaign._id, proposal._id, 'accepted')}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                              aria-label={`Accept proposal from influencer ${proposal.influencerId}`}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleProposalAction(campaign._id, proposal._id, 'rejected')}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                              aria-label={`Reject proposal from influencer ${proposal.influencerId}`}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Proposals;
