import React from 'react';
import { useParams } from 'react-router-dom';
import Trends from '../components/Trends';
import './TrendsPage.css';

const TrendsPage = () => {
  const { influencerId } = useParams();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Influencer Trends</h1>
            <p className="text-gray-600 mt-1">Analyze performance metrics and engagement patterns</p>
          </div>
        </div>
        
        {influencerId && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-700 font-medium">Viewing analytics for influencer ID: {influencerId}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <Trends influencerId={influencerId} />
      </div>
    </div>
  );
};

export default TrendsPage;