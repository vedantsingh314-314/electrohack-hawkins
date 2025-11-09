import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PoolCard from '../components/PoolCard';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';

// Get the API URL from .env
const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPools = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Get auth token
        const token = localStorage.getItem('campusPoolToken');
        if (!token) {
          navigate('/login');
          return;
        }

        // 2. Set up authorization header
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // 3. Fetch active pools
        const response = await axios.get(`${API_URL}/api/pools`, config);

        // 4. Update state
        setPools(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch pools:', err);
        setError('Failed to fetch pools. Please try again.');
        setLoading(false);
      }
    };

    fetchPools();
  }, [navigate]);

  // --- Conditional rendering ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white">Active Pools</h1>
        <p className="text-lg text-gray-400 mt-1">
          Find a ride or a food group and save money!
        </p>
      </div>

      {pools.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white">No Active Pools</h3>
          <p className="text-gray-400 mt-2">
            Why not be the first to create one?
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.map((pool) => (
            <PoolCard key={pool._id} pool={pool} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
