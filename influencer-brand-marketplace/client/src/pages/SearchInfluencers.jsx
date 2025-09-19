import React, { useState } from 'react';

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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Search Influencers</h1>
      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          placeholder="Search by name, category, or tags"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Search
        </button>
      </form>

      {results.length > 0 ? (
        <ul className="space-y-4">
          {results.map((influencer) => (
            <li key={influencer.id} className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold">{influencer.name}</h2>
              <p className="text-gray-600">Category: {influencer.category}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No results to display. Please enter a search term.</p>
      )}
    </div>
  );
};

export default SearchInfluencers;
