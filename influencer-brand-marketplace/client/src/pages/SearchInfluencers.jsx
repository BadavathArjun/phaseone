import React, { useState } from 'react';
import './SearchInfluencers.css';

const SearchInfluencers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Placeholder: simulate search results
    setResults([
      { id: 1, name: 'Influencer One', category: 'Fashion' },
      { id: 2, name: 'Influencer Two', category: 'Tech' },
      { id: 3, name: 'Influencer Three', category: 'Fitness' },
    ]);
  };

  return (
    <div className="search-influencers-page">
      <div className="search-influencers-container">
        <div className="search-influencers-content">
          <div className="search-influencers-header">
            <h1 className="search-influencers-title">Search Influencers</h1>
            <p className="search-influencers-subtitle">Find the perfect influencers for your brand</p>
          </div>

          <form onSubmit={handleSearch} className="search-influencers-form">
            <div className="search-influencers-input-container">
              <input
                type="text"
                placeholder="Search by name, category, or tags"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-influencers-input"
              />
              <button
                type="submit"
                className="search-influencers-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="search-influencers-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
          </form>

          {results.length > 0 ? (
            <div className="search-influencers-results">
              {results.map((influencer) => (
                <div key={influencer.id} className="search-influencers-card">
                  <div className="search-influencers-card-content">
                    <div className="search-influencers-avatar">
                      <div className="search-influencers-avatar-circle">
                        {influencer.name.charAt(0)}
                      </div>
                    </div>
                    <div className="search-influencers-details">
                      <h2 className="search-influencers-name">{influencer.name}</h2>
                      <div className="search-influencers-category">
                        {influencer.category}
                      </div>
                      <div className="search-influencers-stats">
                        <svg xmlns="http://www.w3.org/2000/svg" className="search-influencers-stats-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        125K followers
                      </div>
                    </div>
                    <button className="search-influencers-view-btn">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="search-influencers-empty">
              <svg xmlns="http://www.w3.org/2000/svg" className="search-influencers-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="search-influencers-empty-title">No results to display. Please enter a search term.</p>
              <p className="search-influencers-empty-text">Try searching for fashion, tech, or fitness influencers</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchInfluencers;
