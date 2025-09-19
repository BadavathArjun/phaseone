import React from 'react';
import { useParams } from 'react-router-dom';
import Trends from '../components/Trends';

const TrendsPage = () => {
  const { influencerId } = useParams();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Influencer Trends</h1>
      <Trends influencerId={influencerId} />
    </div>
  );
};

export default TrendsPage;
