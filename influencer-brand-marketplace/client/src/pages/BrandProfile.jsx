import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { brandAPI } from '../api/auth';
import './BrandProfile.css';

const BrandProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await brandAPI.getProfile(currentUser.id);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

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
              <button className="brand-profile-onboarding-btn">
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
