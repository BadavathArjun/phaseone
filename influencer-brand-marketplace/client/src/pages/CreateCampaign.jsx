import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignsAPI } from '../api/auth';
import './CreateCampaign.css';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    requirements: '',
    categories: [],
    platforms: [],
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    'Fashion', 'Beauty', 'Lifestyle', 'Travel', 'Food',
    'Fitness', 'Technology', 'Gaming', 'Parenting', 'Business'
  ];

  const platforms = ['Instagram', 'YouTube', 'TikTok', 'Twitter'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryChange = (category) => {
    const updatedCategories = formData.categories.includes(category)
      ? formData.categories.filter(c => c !== category)
      : [...formData.categories, category];

    setFormData({
      ...formData,
      categories: updatedCategories
    });
  };

  const handlePlatformChange = (platform) => {
    const updatedPlatforms = formData.platforms.includes(platform)
      ? formData.platforms.filter(p => p !== platform)
      : [...formData.platforms, platform];

    setFormData({
      ...formData,
      platforms: updatedPlatforms
    });
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Campaign title is required';
    if (!formData.description.trim()) return 'Campaign description is required';
    if (!formData.budget || formData.budget <= 0) return 'Budget must be greater than 0';
    if (!formData.deadline) return 'Deadline is required';
    if (formData.categories.length === 0) return 'At least one category must be selected';
    if (formData.platforms.length === 0) return 'At least one platform must be selected';

    // Check if deadline is in the future
    const deadlineDate = new Date(formData.deadline);
    const now = new Date();
    if (deadlineDate <= now) return 'Deadline must be a future date';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await campaignsAPI.create(formData);
      setSuccess('Campaign created successfully! Redirecting to campaigns page...');

      // Clear form
      setFormData({
        title: '',
        description: '',
        budget: '',
        requirements: '',
        categories: [],
        platforms: [],
        deadline: ''
      });

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/campaigns');
      }, 2000);
    } catch (err) {
      console.error('Campaign creation error:', err);
      if (err.response) {
        // Server responded with error status
        setError(err.response.data.message || 'Failed to create campaign. Please try again.');
      } else if (err.request) {
        // Network error
        setError('Network error. Please check your connection and try again.');
      } else {
        // Other error
        setError('Failed to create campaign. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-campaign-page">
      <div className="create-campaign-container">
        <div className="create-campaign-card">
          <div className="create-campaign-header">
            <h1 className="create-campaign-title">Create a New Campaign</h1>
            <p className="create-campaign-subtitle">Launch your influencer marketing campaign and connect with creators</p>
          </div>

          <div className="create-campaign-content">
            {error && (
              <div className="create-campaign-alert error">
                <svg xmlns="http://www.w3.org/2000/svg" className="create-campaign-alert-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="create-campaign-alert-text">{error}</span>
                <button
                  onClick={() => setError('')}
                  className="create-campaign-alert-dismiss"
                  aria-label="Dismiss error"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {success && (
              <div className="create-campaign-alert success">
                <svg xmlns="http://www.w3.org/2000/svg" className="create-campaign-alert-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="create-campaign-alert-text">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="create-campaign-form">
              <div className="create-campaign-form-group">
                <label htmlFor="title" className="create-campaign-form-label">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="create-campaign-form-input"
                  placeholder="e.g., Summer Fashion Collection Promotion"
                />
              </div>

              <div className="create-campaign-form-group">
                <label htmlFor="description" className="create-campaign-form-label">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="create-campaign-form-textarea description"
                  placeholder="Describe your campaign objectives, target audience, and what you're looking for in influencers..."
                />
              </div>

              <div className="create-campaign-grid">
                <div className="create-campaign-grid-item">
                  <label htmlFor="budget" className="create-campaign-form-label">
                    Budget ($) *
                  </label>
                  <div className="create-campaign-budget-input">
                    <div className="create-campaign-budget-symbol">$</div>
                    <input
                      type="number"
                      id="budget"
                      name="budget"
                      required
                      min="0"
                      value={formData.budget}
                      onChange={handleChange}
                      className="create-campaign-form-input"
                      placeholder="5000"
                    />
                  </div>
                </div>

                <div className="create-campaign-grid-item">
                  <label htmlFor="deadline" className="create-campaign-form-label">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    required
                    value={formData.deadline}
                    onChange={handleChange}
                    className="create-campaign-form-input"
                  />
                </div>
              </div>

              <div className="create-campaign-selection-group">
                <label className="create-campaign-selection-label">
                  Categories *
                </label>
                <p className="create-campaign-selection-help">Select at least one category that describes your campaign</p>
                <div className="create-campaign-selection-grid">
                  {categories.map(category => (
                    <label key={category} className={`create-campaign-selection-item ${formData.categories.includes(category) ? 'selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="create-campaign-selection-input"
                      />
                      <span className="create-campaign-selection-text">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="create-campaign-selection-group">
                <label className="create-campaign-selection-label">
                  Platforms *
                </label>
                <p className="create-campaign-selection-help">Select the social media platforms for this campaign</p>
                <div className="create-campaign-selection-grid">
                  {platforms.map(platform => (
                    <label key={platform} className={`create-campaign-selection-item ${formData.platforms.includes(platform) ? 'selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={formData.platforms.includes(platform)}
                        onChange={() => handlePlatformChange(platform)}
                        className="create-campaign-selection-input"
                      />
                      <span className="create-campaign-selection-text">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="create-campaign-form-group">
                <label htmlFor="requirements" className="create-campaign-form-label">
                  Specific Requirements
                </label>
                <p className="create-campaign-selection-help">Any specific requirements for influencers (optional)</p>
                <textarea
                  id="requirements"
                  name="requirements"
                  rows="3"
                  value={formData.requirements}
                  onChange={handleChange}
                  className="create-campaign-form-textarea requirements"
                  placeholder="e.g., Minimum 10K followers, specific content format, mandatory hashtags..."
                />
              </div>

              <div className="create-campaign-actions">
                <button
                  type="button"
                  onClick={() => navigate('/campaigns')}
                  className="create-campaign-action-btn cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="create-campaign-action-btn submit"
                >
                  {loading ? (
                    <>
                      <svg className="create-campaign-action-btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Campaign...
                    </>
                  ) : (
                    'Create Campaign'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
