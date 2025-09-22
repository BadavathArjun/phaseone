import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI, brandAPI, influencerAPI } from '../api/auth';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Account settings state
  const [accountData, setAccountData] = useState({
    name: '',
    email: '',
    bio: '',
    website: '',
    location: '',
    phone: ''
  });

  // Brand-specific state
  const [brandData, setBrandData] = useState({
    companyName: '',
    description: '',
    industry: '',
    logo: ''
  });

  // Influencer-specific state
  const [influencerData, setInfluencerData] = useState({
    bio: '',
    categories: [],
    socialPlatforms: []
  });

  // Available categories for influencers
  const availableCategories = [
    'Fashion', 'Beauty', 'Lifestyle', 'Travel', 'Food', 'Fitness',
    'Technology', 'Gaming', 'Health', 'Parenting', 'Business',
    'Entertainment', 'Sports', 'Art', 'Music', 'Photography'
  ];

  // Available social platforms
  const socialPlatforms = ['Instagram', 'Twitter', 'YouTube', 'TikTok', 'LinkedIn'];

  // Load user data on component mount
  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Load basic user profile
      const userProfile = await authAPI.getProfile();
      setAccountData({
        name: userProfile.data.name || '',
        email: userProfile.data.email || '',
        bio: userProfile.data.bio || '',
        website: userProfile.data.website || '',
        location: userProfile.data.location || '',
        phone: userProfile.data.phone || ''
      });

      // Load role-specific data
      if (currentUser.role === 'brand') {
        try {
          const brandProfile = await brandAPI.getProfile(currentUser.id);
          setBrandData({
            companyName: brandProfile.data.companyName || '',
            description: brandProfile.data.description || '',
            industry: brandProfile.data.industry || '',
            logo: brandProfile.data.logo || ''
          });
        } catch (error) {
          console.log('Brand profile not found, will create new one');
        }
      } else if (currentUser.role === 'influencer') {
        try {
          const influencerProfile = await influencerAPI.getProfile(currentUser.id);
          setInfluencerData({
            bio: influencerProfile.data.bio || '',
            categories: influencerProfile.data.categories || [],
            socialPlatforms: influencerProfile.data.socialPlatforms || []
          });
        } catch (error) {
          console.log('Influencer profile not found, will create new one');
        }
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to load profile data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle account form input changes
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle brand form input changes
  const handleBrandChange = (e) => {
    const { name, value } = e.target;
    setBrandData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle influencer form input changes
  const handleInfluencerChange = (e) => {
    const { name, value } = e.target;
    setInfluencerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle category selection for influencers
  const handleCategoryChange = (category) => {
    setInfluencerData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  // Handle social platform changes
  const handleSocialPlatformChange = (index, field, value) => {
    setInfluencerData(prev => ({
      ...prev,
      socialPlatforms: prev.socialPlatforms.map((platform, i) =>
        i === index ? { ...platform, [field]: value } : platform
      )
    }));
  };

  // Add new social platform
  const addSocialPlatform = () => {
    setInfluencerData(prev => ({
      ...prev,
      socialPlatforms: [...prev.socialPlatforms, { platform: '', username: '', followers: 0 }]
    }));
  };

  // Remove social platform
  const removeSocialPlatform = (index) => {
    setInfluencerData(prev => ({
      ...prev,
      socialPlatforms: prev.socialPlatforms.filter((_, i) => i !== index)
    }));
  };

  // Handle account form submission
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await authAPI.updateProfile(accountData);
      setMessage({
        type: 'success',
        text: 'Account settings updated successfully!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update account settings'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle brand form submission
  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (currentUser.role === 'brand') {
        await brandAPI.updateProfile(currentUser.id, brandData);
        setMessage({
          type: 'success',
          text: 'Brand profile updated successfully!'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update brand profile'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle influencer form submission
  const handleInfluencerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (currentUser.role === 'influencer') {
        await influencerAPI.updateProfile(currentUser.id, influencerData);
        setMessage({
          type: 'success',
          text: 'Influencer profile updated successfully!'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update influencer profile'
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading && !currentUser) {
    return (
      <div className="profile-settings-loading">
        <div className="profile-settings-spinner"></div>
        <div className="profile-settings-loading-text">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-settings-page">
      <div className="profile-settings-container">
        <div className="profile-settings-header">
          <h1 className="profile-settings-title">Profile Settings</h1>
          <p className="profile-settings-subtitle">
            Manage your account settings and profile information
          </p>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div className={`profile-settings-alert ${message.type}`}>
            <svg className="profile-settings-alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {message.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
            <div className="profile-settings-alert-text">{message.text}</div>
          </div>
        )}

        <div className="profile-settings-tabs">
          {/* Tab Navigation */}
          <div className="profile-settings-tab-nav">
            <button
              className={`profile-settings-tab-btn ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Account
            </button>
            {currentUser?.role === 'brand' && (
              <button
                className={`profile-settings-tab-btn ${activeTab === 'brand' ? 'active' : ''}`}
                onClick={() => setActiveTab('brand')}
              >
                Brand Profile
              </button>
            )}
            {currentUser?.role === 'influencer' && (
              <button
                className={`profile-settings-tab-btn ${activeTab === 'influencer' ? 'active' : ''}`}
                onClick={() => setActiveTab('influencer')}
              >
                Influencer Profile
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="profile-settings-tab-content">
            {/* Account Settings Tab */}
            {activeTab === 'account' && (
              <form className="profile-settings-form" onSubmit={handleAccountSubmit}>
                <h2 className="profile-settings-section-title">Account Information</h2>

                <div className="profile-settings-form-grid">
                  <div className="profile-settings-form-group">
                    <label className="profile-settings-form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={accountData.name}
                      onChange={handleAccountChange}
                      className="profile-settings-form-input"
                      required
                    />
                  </div>

                  <div className="profile-settings-form-group">
                    <label className="profile-settings-form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={accountData.email}
                      onChange={handleAccountChange}
                      className="profile-settings-form-input"
                      required
                    />
                  </div>

                  <div className="profile-settings-form-group">
                    <label className="profile-settings-form-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={accountData.phone}
                      onChange={handleAccountChange}
                      className="profile-settings-form-input"
                    />
                  </div>

                  <div className="profile-settings-form-group">
                    <label className="profile-settings-form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={accountData.location}
                      onChange={handleAccountChange}
                      className="profile-settings-form-input"
                    />
                  </div>

                  <div className="profile-settings-form-group">
                    <label className="profile-settings-form-label">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={accountData.website}
                      onChange={handleAccountChange}
                      className="profile-settings-form-input"
                    />
                  </div>
                </div>

                <div className="profile-settings-form-group">
                  <label className="profile-settings-form-label">Bio</label>
                  <textarea
                    name="bio"
                    value={accountData.bio}
                    onChange={handleAccountChange}
                    className="profile-settings-form-textarea"
                    rows={4}
                  />
                </div>

                <div className="profile-settings-form-actions">
                  <button
                    type="submit"
                    className="profile-settings-submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* Brand Profile Tab */}
            {activeTab === 'brand' && (
              <form className="profile-settings-form" onSubmit={handleBrandSubmit}>
                <h2 className="profile-settings-section-title">Brand Information</h2>

                <div className="profile-settings-form-grid">
                  <div className="profile-settings-form-group">
                    <label className="profile-settings-form-label">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={brandData.companyName}
                      onChange={handleBrandChange}
                      className="profile-settings-form-input"
                      required
                    />
                  </div>

                  <div className="profile-settings-form-group">
                    <label className="profile-settings-form-label">Industry</label>
                    <input
                      type="text"
                      name="industry"
                      value={brandData.industry}
                      onChange={handleBrandChange}
                      className="profile-settings-form-input"
                    />
                  </div>

                  <div className="profile-settings-form-group">
                    <label className="profile-settings-form-label">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={brandData.website}
                      onChange={handleBrandChange}
                      className="profile-settings-form-input"
                      required
                    />
                  </div>
                </div>

                <div className="profile-settings-form-group">
                  <label className="profile-settings-form-label">Company Description</label>
                  <textarea
                    name="description"
                    value={brandData.description}
                    onChange={handleBrandChange}
                    className="profile-settings-form-textarea"
                    rows={4}
                    required
                  />
                </div>

                <div className="profile-settings-form-group">
                  <label className="profile-settings-form-label">Logo URL</label>
                  <input
                    type="url"
                    name="logo"
                    value={brandData.logo}
                    onChange={handleBrandChange}
                    className="profile-settings-form-input"
                  />
                </div>

                <div className="profile-settings-form-actions">
                  <button
                    type="submit"
                    className="profile-settings-submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Brand Profile'}
                  </button>
                </div>
              </form>
            )}

            {/* Influencer Profile Tab */}
            {activeTab === 'influencer' && (
              <form className="profile-settings-form" onSubmit={handleInfluencerSubmit}>
                <h2 className="profile-settings-section-title">Influencer Profile</h2>

                <div className="profile-settings-form-group">
                  <label className="profile-settings-form-label">Bio</label>
                  <textarea
                    name="bio"
                    value={influencerData.bio}
                    onChange={handleInfluencerChange}
                    className="profile-settings-form-textarea"
                    rows={4}
                    required
                  />
                </div>

                <div className="profile-settings-form-group">
                  <label className="profile-settings-form-label">Categories</label>
                  <div className="profile-settings-categories">
                    {availableCategories.map(category => (
                      <label key={category} className="profile-settings-category-item">
                        <input
                          type="checkbox"
                          checked={influencerData.categories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="profile-settings-form-group">
                  <label className="profile-settings-form-label">Social Media Platforms</label>

                  {influencerData.socialPlatforms.map((platform, index) => (
                    <div key={index} className="profile-settings-social-platform">
                      <div className="profile-settings-social-grid">
                        <select
                          value={platform.platform}
                          onChange={(e) => handleSocialPlatformChange(index, 'platform', e.target.value)}
                          className="profile-settings-form-input"
                        >
                          <option value="">Select Platform</option>
                          {socialPlatforms.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>

                        <input
                          type="text"
                          placeholder="Username"
                          value={platform.username}
                          onChange={(e) => handleSocialPlatformChange(index, 'username', e.target.value)}
                          className="profile-settings-form-input"
                        />

                        <input
                          type="number"
                          placeholder="Followers"
                          value={platform.followers}
                          onChange={(e) => handleSocialPlatformChange(index, 'followers', parseInt(e.target.value) || 0)}
                          className="profile-settings-form-input"
                        />

                        <button
                          type="button"
                          onClick={() => removeSocialPlatform(index)}
                          className="profile-settings-remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addSocialPlatform}
                    className="profile-settings-add-btn"
                  >
                    Add Social Platform
                  </button>
                </div>

                <div className="profile-settings-form-actions">
                  <button
                    type="submit"
                    className="profile-settings-submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Influencer Profile'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
