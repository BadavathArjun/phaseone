import { useState, useEffect } from 'react';
import { campaignsAPI } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import './Proposals.css';

const Proposals = () => {
  const { currentUser } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

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

  // Filter campaigns based on active tab
  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return campaign.status === 'active';
    if (activeTab === 'pending') {
      return campaign.proposals.some(proposal => proposal.status === 'pending');
    }
    return true;
  });

  if (loading) {
    return (
      <div className="proposals-page">
        <div className="proposals-container">
          <div className="proposals-loading">
            <div className="proposals-loading-skeleton proposals-title"></div>
            <div className="proposals-loading">
              {[1, 2, 3].map(i => (
                <div key={i} className="proposals-loading-skeleton proposals-campaign-card"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="proposals-page">
        <div className="proposals-container">
          <div className="proposals-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="proposals-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="proposals-error-title">Error Loading Proposals</h3>
            <p className="proposals-error-text">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="proposals-error-btn"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser?.role !== 'brand') {
    return (
      <div className="proposals-page">
        <div className="proposals-container">
          <div className="proposals-access-denied">
            <svg xmlns="http://www.w3.org/2000/svg" className="proposals-access-denied-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 className="proposals-access-denied-title">Access Denied</h3>
            <p className="proposals-access-denied-text">Only brand accounts can view campaign proposals.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="proposals-page">
      <div className="proposals-container">
        <div className="proposals-header">
          <h1 className="proposals-title">Campaign Proposals</h1>
          <p className="proposals-subtitle">Manage and review influencer proposals for your campaigns</p>
        </div>

        {/* Tab Navigation */}
        <div className="proposals-tabs">
          <div className="proposals-tabs-container">
            {[
              { id: 'all', label: 'All Campaigns' },
              { id: 'active', label: 'Active' },
              { id: 'pending', label: 'Pending Review' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`proposals-tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="proposals-empty">
            <svg xmlns="http://www.w3.org/2000/svg" className="proposals-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="proposals-empty-title">
              {activeTab === 'all' ? 'No Campaigns Found' : `No ${activeTab} Campaigns`}
            </h3>
            <p className="proposals-empty-text">
              {activeTab === 'all'
                ? 'Create a campaign to start receiving proposals from influencers.'
                : `You don't have any ${activeTab} campaigns at the moment.`
              }
            </p>
            <button className="proposals-empty-btn">
              Create Campaign
            </button>
          </div>
        ) : (
          <div className="proposals-campaigns">
            {filteredCampaigns.map(campaign => (
              <div key={campaign._id} className="proposals-campaign-card">
                <div className="proposals-campaign-header">
                  <div className="proposals-campaign-content">
                    <div className="proposals-campaign-info">
                      <h2 className="proposals-campaign-title">{campaign.title}</h2>
                      <p className="proposals-campaign-description">{campaign.description}</p>
                    </div>
                    <div className="proposals-campaign-meta">
                      <span className={`proposals-campaign-status ${campaign.status || 'active'}`}>
                        {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1) || 'Active'}
                      </span>
                      <div className="proposals-campaign-stats">
                        <div className="proposals-campaign-count">{campaign.proposals.length}</div>
                        <div className="proposals-campaign-label">Proposals</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="proposals-section">
                  <h3 className="proposals-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" className="proposals-section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Proposals ({campaign.proposals.length})
                  </h3>

                  {campaign.proposals.length === 0 ? (
                    <div className="proposals-empty-section">
                      <svg xmlns="http://www.w3.org/2000/svg" className="proposals-empty-section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="proposals-empty-section-text">No proposals received yet</p>
                    </div>
                  ) : (
                    <div className="proposals-list">
                      {campaign.proposals.map(proposal => (
                        <div key={proposal._id} className="proposals-item">
                          <div className="proposals-item-header">
                            <div className="proposals-item-info">
                              <div className="proposals-item-user">
                                <div className="proposals-item-avatar">
                                  {proposal.influencerId?.charAt(0) || 'I'}
                                </div>
                                <div className="proposals-item-details">
                                  <p className="proposals-item-name">
                                    {proposal.influencerId || 'Influencer'}
                                  </p>
                                  <p className="proposals-item-date">
                                    {new Date(proposal.submittedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <span className={`proposals-item-status ${proposal.status || 'pending'}`}>
                              {proposal.status?.charAt(0).toUpperCase() + proposal.status?.slice(1) || 'Pending'}
                            </span>
                          </div>

                          <div className="proposals-item-message">
                            <p>{proposal.message}</p>
                          </div>

                          {proposal.status === 'pending' && (
                            <div className="proposals-item-actions">
                              <button
                                onClick={() => handleProposalAction(campaign._id, proposal._id, 'accepted')}
                                className="proposals-action-btn accept"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="proposals-action-btn-icon" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Accept Proposal
                              </button>
                              <button
                                onClick={() => handleProposalAction(campaign._id, proposal._id, 'rejected')}
                                className="proposals-action-btn reject"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="proposals-action-btn-icon" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Reject Proposal
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
    </div>
  );
};

export default Proposals;
