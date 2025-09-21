import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { campaignsAPI } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import './CampaignDetail.css';

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
        setError('Failed to load campaign details');
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
    return (
      <div className="campaign-detail-page">
        <div className="campaign-detail-loading">
          <div className="campaign-detail-loading-content">
            <div className="campaign-detail-spinner"></div>
            <p className="campaign-detail-loading-text">Loading campaign details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !campaign) {
    return (
      <div className="campaign-detail-page">
        <div className="campaign-detail-container">
          <div className="campaign-detail-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="campaign-detail-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="campaign-detail-error-title">Error Loading Campaign</h3>
            <p className="campaign-detail-error-text">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="campaign-detail-error-btn"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="campaign-detail-page">
        <div className="campaign-detail-container">
          <div className="campaign-detail-not-found">
            <svg xmlns="http://www.w3.org/2000/svg" className="campaign-detail-not-found-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="campaign-detail-not-found-title">Campaign Not Found</h3>
            <p className="campaign-detail-not-found-text">The campaign you're looking for doesn't exist or may have been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="campaign-detail-page">
      <div className="campaign-detail-container">
        {error && (
          <div className="campaign-detail-alert">
            <svg xmlns="http://www.w3.org/2000/svg" className="campaign-detail-alert-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="campaign-detail-alert-text">{error}</span>
            <button
              onClick={() => setError('')}
              className="campaign-detail-alert-dismiss"
              aria-label="Dismiss error"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div className="campaign-detail-card">
          <div className="campaign-detail-header">
            <div className="campaign-detail-header-content">
              <div className="campaign-detail-header-info">
                <h1 className="campaign-detail-title">{campaign.title}</h1>
                <div className="campaign-detail-categories">
                  {campaign.categories.map(category => (
                    <span key={category} className="campaign-detail-category">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div className="campaign-detail-budget">
                <span className="campaign-detail-budget-amount">${campaign.budget.toLocaleString()}</span>
                <span className="campaign-detail-budget-label">budget</span>
              </div>
            </div>
          </div>

          <div className="campaign-detail-content">
            <div className="campaign-detail-section">
              <h2 className="campaign-detail-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" className="campaign-detail-section-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Campaign Description
              </h2>
              <p className="campaign-detail-description">{campaign.description}</p>
            </div>

            <div className="campaign-detail-grid">
              <div className="campaign-detail-details-card">
                <h3 className="campaign-detail-details-title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="campaign-detail-details-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                  Campaign Details
                </h3>
                <div className="campaign-detail-details-list">
                  <div className="campaign-detail-detail-item">
                    <span className="campaign-detail-detail-label">Budget:</span>
                    <span className="campaign-detail-detail-value budget">${campaign.budget.toLocaleString()}</span>
                  </div>
                  <div className="campaign-detail-detail-item">
                    <span className="campaign-detail-detail-label">Deadline:</span>
                    <span className="campaign-detail-detail-value">{new Date(campaign.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="campaign-detail-detail-item">
                    <span className="campaign-detail-detail-label">Status:</span>
                    <span className="campaign-detail-status">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="campaign-detail-details-card">
                <h3 className="campaign-detail-details-title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="campaign-detail-details-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                    <path d="M9 11H5v6a2 2 0 002 2h6a2 2 0 002-2v-6h-4z" />
                  </svg>
                  Required Platforms
                </h3>
                <div className="campaign-detail-platforms">
                  {campaign.platforms.map(platform => (
                    <span key={platform} className="campaign-detail-platform">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {campaign.requirements && (
              <div className="campaign-detail-requirements">
                <h2 className="campaign-detail-section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="campaign-detail-section-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Requirements
                </h2>
                <div className="campaign-detail-requirements-content">
                  <p>{campaign.requirements}</p>
                </div>
              </div>
            )}

            <div className="campaign-detail-actions">
              <button className="campaign-detail-action-btn save">
                <svg xmlns="http://www.w3.org/2000/svg" className="campaign-detail-action-btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Save for Later
              </button>
              {currentUser?.role === 'influencer' && (
                <button
                  onClick={() => setShowProposalForm(true)}
                  className="campaign-detail-action-btn apply"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="campaign-detail-action-btn-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Proposal Form Modal */}
        {showProposalForm && (
          <div
            className="campaign-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="proposal-modal-title"
          >
            <div className="campaign-detail-modal-content">
              <div className="campaign-detail-modal-header">
                <h3
                  id="proposal-modal-title"
                  className="campaign-detail-modal-title"
                >
                  Submit Your Proposal
                </h3>
                <p className="campaign-detail-modal-subtitle">Apply for "{campaign.title}"</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleApply(); }} className="campaign-detail-modal-form">
                <div className="campaign-detail-form-group">
                  <label
                    htmlFor="proposal-message"
                    className="campaign-detail-form-label"
                  >
                    Proposal Message
                  </label>
                  <textarea
                    id="proposal-message"
                    value={proposalMessage}
                    onChange={(e) => setProposalMessage(e.target.value)}
                    placeholder="Tell the brand why you're the perfect influencer for this campaign. Include your relevant experience, audience demographics, and creative ideas..."
                    className="campaign-detail-form-textarea"
                    required
                    aria-describedby="proposal-help"
                  />
                  <p id="proposal-help" className="campaign-detail-form-help">
                    A compelling proposal increases your chances of being selected
                  </p>
                </div>

                <div className="campaign-detail-modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowProposalForm(false)}
                    className="campaign-detail-modal-btn cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="campaign-detail-modal-btn submit"
                  >
                    {applying ? (
                      <>
                        <svg className="campaign-detail-modal-btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Proposal'
                    )}
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
