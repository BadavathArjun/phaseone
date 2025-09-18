import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { influencerAPI } from '../api/auth';

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

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Influencer Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              3
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="button"
                onClick={nextStep}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <p className="text-gray-600 mb-4">Select the categories that best describe your content</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={category}
                      checked={formData.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={category} className="ml-2 text-gray-700">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Social Platforms</h2>
              
              {formData.socialPlatforms.map((platform, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Platform
                      </label>
                      <select
                        value={platform.platform}
                        onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      >
                        <option value="">Select Platform</option>
                        <option value="instagram">Instagram</option>
                        <option value="youtube">YouTube</option>
                        <option value="tiktok">TikTok</option>
                        <option value="twitter">Twitter</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={platform.username}
                        onChange={(e) => handleSocialChange(index, 'username', e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Username"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Followers
                      </label>
                      <input
                        type="number"
                        value={platform.followers}
                        onChange={(e) => handleSocialChange(index, 'followers', parseInt(e.target.value) || 0)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove Platform
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addSocialPlatform}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mb-6"
              >
                + Add Another Platform
              </button>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Complete Profile'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}