import React from 'react';
import CategoryCard from '../components/CategoryCard.jsx';

function Home() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-gray-900">What's on your mind today?</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h2 className="text-4xl font-semibold text-yellow-600">🚗 Ride</h2>
          <CategoryCard 
            title="Create a Ride Pool"
            description="Offer a ride, set your destination, and split the cost."
            to="/create-pool/Ride"
          />
          <CategoryCard 
            title="Join an Existing Ride"
            description="Find active pools heading to your destination."
            to="/join-pools/Ride"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-semibold text-yellow-600">🍔 Food</h2>
          <CategoryCard 
            title="Create a Food Order"
            description="Start a group order for a restaurant and save on delivery."
            to="/create-pool/Food"
          />
          <CategoryCard 
            title="Join an Existing Order"
            description="See active food orders and join in."
            to="/join-pools/Food"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;