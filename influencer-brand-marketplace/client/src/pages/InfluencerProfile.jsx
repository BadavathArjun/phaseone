import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { influencerAPI } from '../api/auth';
import './InfluencerProfile.css';

export default function InfluencerProfile() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    bio: '',
    categories: [],
    socialPlatforms: [
      { platform: 'instagram', username: '', followers: 0 }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSocialChange = (index, field, value) => {
    const updatedPlatforms = [...formData.socialPlatforms];
    updatedPlatforms[index][field] = value;
    setFormData({
      ...formData,
      socialPlatforms: updatedPlatforms
    });
  };

  const addSocialPlatform = () => {
    setFormData({
      ...formData,
      socialPlatforms: [
        ...formData.socialPlatforms,
        { platform: '', username: '', followers: 0 }
      ]
    });
  };

  const removeSocialPlatform = (index) => {
    const updatedPlatforms = formData.socialPlatforms.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      socialPlatforms: updatedPlatforms
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await influencerAPI.createProfile(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save profile');
    }
    
    setLoading(false);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const categories = [
    'Fashion', 'Beauty', 'Lifestyle', 'Travel', 'Food',
    'Fitness', 'Technology', 'Gaming', 'Parenting', 'Business'
  ];

  const platformOptions = [
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'youtube', label: 'YouTube', icon: '🎥' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'twitter', label: 'Twitter', icon: '🐦' },
    { value: 'facebook', label: 'Facebook', icon: '📘' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Influencer Profile</h1>
          <p className="text-gray-600">Build your professional profile to attract brand collaborations</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step >= stepNumber 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'border-gray-300 text-gray-400'
                  } font-semibold transition-colors duration-300`}>
                    {stepNumber}
                  </div>
                  <div className="text-xs font-medium text-gray-600 mt-2 capitalize">
                    {stepNumber === 1 && 'Basic Info'}
                    {stepNumber === 2 && 'Categories'}
                    {stepNumber === 3 && 'Social Media'}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative max-w-md mx-auto mt-3">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 -translate-y-1/2 transition-all duration-300"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700">{error}</span>
                <button 
                  onClick={() => setError('')} 
                  className="ml-auto text-red-500 hover:text-red-700"
                  aria-label="Dismiss error"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Basic Information</h2>
                    <p className="text-gray-600">Tell brands about yourself and your content</p>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      Bio *
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows="5"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Describe your content style, audience demographics, and what makes your channel unique..."
                      value={formData.bio}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">This will be displayed on your public profile</p>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Continue to Categories
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 inline" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Categories */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Content Categories</h2>
                    <p className="text-gray-600">Select the categories that best describe your content</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map(category => (
                      <label 
                        key={category} 
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          formData.categories.includes(category)
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={category}
                          checked={formData.categories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 font-medium">{category}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Continue to Social Media
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 inline" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Social Platforms */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Social Media Profiles</h2>
                    <p className="text-gray-600">Add your social media accounts to showcase your reach</p>
                  </div>
                  
                  {formData.socialPlatforms.map((platform, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Platform *
                          </label>
                          <select
                            value={platform.platform}
                            onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            required
                          >
                            <option value="">Select Platform</option>
                            {platformOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.icon} {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username *
                          </label>
                          <input
                            type="text"
                            value={platform.username}
                            onChange={(e) => handleSocialChange(index, 'username', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="@username"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Followers *
                          </label>
                          <input
                            type="number"
                            value={platform.followers}
                            onChange={(e) => handleSocialChange(index, 'followers', parseInt(e.target.value) || 0)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="0"
                            min="0"
                            required
                          />
                        </div>
                      </div>
                      
                      {formData.socialPlatforms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSocialPlatform(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Remove Platform
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addSocialPlatform}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Another Platform
                  </button>
                  
                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        'Complete Profile'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}