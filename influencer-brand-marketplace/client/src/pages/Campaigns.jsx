import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignsAPI } from '../api/auth';
import './Campaigns.css';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter campaigns based on selected filter and search term
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesFilter = filter === 'all' || campaign.status === filter;
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="campaigns-page">
        <div className="campaigns-container">
          <div className="campaigns-loading">
            <div className="campaigns-loading-skeleton campaigns-title"></div>
            <div className="campaigns-loading">
              {[1, 2, 3].map(i => (
                <div key={i} className="campaigns-loading-skeleton campaigns-card">
                  <div className="campaigns-loading-skeleton"></div>
                  <div className="campaigns-loading-skeleton"></div>
                  <div className="campaigns-loading-skeleton"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="campaigns-page">
        <div className="campaigns-container">
          <div className="campaigns-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="campaigns-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="campaigns-error-title">Unable to Load Campaigns</h3>
            <p className="campaigns-error-text">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="campaigns-error-btn"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="campaigns-page">
      <div className="campaigns-container">
        <div className="campaigns-header">
          <h1 className="campaigns-title">Discover Campaigns</h1>
          <p className="campaigns-subtitle">Find the perfect campaigns to collaborate with brands</p>
        </div>

        {/* Search and Filter Section */}
        <div className="campaigns-search-section">
          <div className="campaigns-search-container">
            <div className="campaigns-search-wrapper">
              <div className="campaigns-search-input-container">
                <svg xmlns="http://www.w3.org/2000/svg" className="campaigns-search-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="campaigns-search-input"
                />
              </div>
            </div>

            <div className="campaigns-filter-container">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="campaigns-filter-select"
              >
                <option value="all">All Campaigns</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="campaigns-empty">
            <svg xmlns="http://www.w3.org/2000/svg" className="campaigns-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="campaigns-empty-title">No Campaigns Found</h3>
            <p className="campaigns-empty-text">
              {searchTerm || filter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'There are no campaigns available at the moment. Check back later!'
              }
            </p>
          </div>
        ) : (
          <div className="campaigns-grid">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign._id} className="campaigns-card">
                <div className="campaigns-card-content">
                  <div className="campaigns-card-header">
                    <span className={`campaigns-card-status ${campaign.status || 'active'}`}>
                      {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1) || 'Active'}
                    </span>
                    <span className="campaigns-card-budget">${campaign.budget?.toLocaleString()}</span>
                  </div>

                  <Link
                    to={`/campaigns/${campaign._id}`}
                    className="campaigns-card-title"
                  >
                    {campaign.title}
                  </Link>

                  <p className="campaigns-card-description">{campaign.description}</p>

                  <div className="campaigns-card-categories">
                    {campaign.categories?.slice(0, 3).map(category => (
                      <span key={category} className="campaigns-card-category">
                        {category}
                      </span>
                    ))}
                    {campaign.categories?.length > 3 && (
                      <span className="campaigns-card-more">
                        +{campaign.categories.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="campaigns-card-footer">
                    <span className="campaigns-card-deadline">
                      {campaign.deadline ? `Until ${new Date(campaign.deadline).toLocaleDateString()}` : 'Ongoing'}
                    </span>
                    <Link
                      to={`/campaigns/${campaign._id}`}
                      className="campaigns-card-link"
                    >
                      View details
                      <svg xmlns="http://www.w3.org/2000/svg" className="campaigns-card-arrow" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
