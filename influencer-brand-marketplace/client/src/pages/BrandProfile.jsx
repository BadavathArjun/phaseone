import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { brandAPI } from '../api/auth';

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
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Brand Profile</h1>
      
      {profile ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">{profile.companyName}</h2>
          <p className="text-gray-600 mb-4">{profile.description}</p>
          <p className="text-gray-500">Website: {profile.website}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Profile not found. Please complete your onboarding.</p>
        </div>
      )}
    </div>
  );
};

export default BrandProfile;
