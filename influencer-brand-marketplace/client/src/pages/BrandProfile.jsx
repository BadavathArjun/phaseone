import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { brandAPI } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import './BrandProfile.css';

const BrandProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    companyName: '',
    website: '',
    description: ''
  });
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [onboardingError, setOnboardingError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await brandAPI.getProfile(currentUser.id);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist (404), show onboarding form
        if (error.response && error.response.status === 404) {
          setShowOnboarding(true);
        }
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  const handleOnboardingChange = (e) => {
    setOnboardingData({
      ...onboardingData,
      [e.target.name]: e.target.value
    });
  };

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    setOnboardingLoading(true);
    setOnboardingError('');

    try {
      await brandAPI.createProfile(onboardingData);
      // Refresh profile data
      const response = await brandAPI.getProfile(currentUser.id);
      setProfile(response.data);
      setShowOnboarding(false);
      // Redirect to campaigns page after successful profile creation
      navigate('/campaigns');
    } catch (error) {
      console.error('Error creating brand profile:', error);
      setOnboardingError(error.response?.data?.message || 'Failed to create brand profile. Please try again.');
    } finally {
      setOnboardingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="brand-profile-page">
        <div className="brand-profile-loading">
          <div className="brand-profile-loading-content">
            <div className="brand-profile-spinner"></div>
            <span className="brand-profile-loading-text">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="brand-profile-page">
      <div className="brand-profile-container">
        <div className="brand-profile-header">
          <h1 className="brand-profile-title">Brand Profile</h1>
          <p className="brand-profile-subtitle">Manage your company information and preferences</p>
        </div>

        {profile ? (
          <div className="brand-profile-card">
            <div className="brand-profile-card-header">
              <h2 className="brand-profile-card-title">{profile.companyName}</h2>
              <p className="brand-profile-card-subtitle">Brand Account</p>
            </div>

            <div className="brand-profile-card-content">
              <div className="brand-profile-section">
                <h3 className="brand-profile-section-title">About</h3>
                <p className="brand-profile-section-text">{profile.description}</p>
              </div>

              <div className="brand-profile-grid">
                <div className="brand-profile-info-item">
                  <h3 className="brand-profile-section-title">Website</h3>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brand-profile-info-link"
                  >
                    <span className="brand-profile-info-link-text">{profile.website}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="brand-profile-info-link-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <div className="brand-profile-info-item">
                  <h3 className="brand-profile-section-title">Member Since</h3>
                  <p className="brand-profile-section-text">{new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="brand-profile-card-footer">
              <button className="brand-profile-edit-btn">
                Edit Profile
              </button>
            </div>
          </div>
        ) : showOnboarding ? (
          <div className="brand-profile-onboarding">
            <div className="brand-profile-onboarding-header">
              <h2 className="brand-profile-onboarding-title">Complete Your Brand Profile</h2>
              <p className="brand-profile-onboarding-subtitle">Set up your brand profile to start creating campaigns and connecting with influencers.</p>
            </div>

            {onboardingError && (
              <div className="brand-profile-alert error">
                <svg xmlns="http://www.w3.org/2000/svg" className="brand-profile-alert-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="brand-profile-alert-text">{onboardingError}</span>
              </div>
            )}

            <form onSubmit={handleOnboardingSubmit} className="brand-profile-onboarding-form">
              <div className="brand-profile-form-group">
                <label htmlFor="companyName" className="brand-profile-form-label">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  required
                  value={onboardingData.companyName}
                  onChange={handleOnboardingChange}
                  className="brand-profile-form-input"
                  placeholder="Enter your company name"
                />
              </div>

              <div className="brand-profile-form-group">
                <label htmlFor="website" className="brand-profile-form-label">
                  Website *
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  required
                  value={onboardingData.website}
                  onChange={handleOnboardingChange}
                  className="brand-profile-form-input"
                  placeholder="https://yourcompany.com"
                />
              </div>

              <div className="brand-profile-form-group">
                <label htmlFor="description" className="brand-profile-form-label">
                  Company Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  required
                  value={onboardingData.description}
                  onChange={handleOnboardingChange}
                  className="brand-profile-form-textarea"
                  placeholder="Tell us about your company and what makes you unique..."
                />
              </div>

              <div className="brand-profile-onboarding-actions">
                <button
                  type="button"
                  onClick={() => setShowOnboarding(false)}
                  className="brand-profile-onboarding-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={onboardingLoading}
                  className="brand-profile-onboarding-submit-btn"
                >
                  {onboardingLoading ? (
                    <>
                      <svg className="brand-profile-onboarding-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Profile...
                    </>
                  ) : (
                    'Complete Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="brand-profile-incomplete">
            <div className="brand-profile-incomplete-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="brand-profile-incomplete-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="brand-profile-incomplete-title">Profile Incomplete</h3>
            <p className="brand-profile-incomplete-text">Please complete your brand onboarding process to access all features.</p>
            <div className="brand-profile-incomplete-actions">
              <button
                onClick={() => setShowOnboarding(true)}
                className="brand-profile-onboarding-btn"
              >
                Complete Onboarding
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandProfile;
