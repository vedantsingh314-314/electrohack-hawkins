import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PoolCard from '../components/PoolCard.jsx';
import Spinner from '../components/Spinner.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const { type } = useParams();
  const navigate = useNavigate();

  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Capitalize first letter of type
  const poolType = type.charAt(0).toUpperCase() + type.slice(1);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('campusPoolToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get(`${API_URL}/api/pools`, config);
        const allPools = response.data || [];
        const filteredPools = allPools.filter(pool => pool.type === poolType);

        setPools(filteredPools);
      } catch (err) {
        console.error('Failed to fetch pools:', err);
        setError('Failed to fetch pools. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, [navigate, poolType]);

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
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Active {poolType === 'Ride' ? '🚗 Ride' : '🍔 Food'} Pools
        </h1>
        <p className="text-lg text-gray-600 mt-1">Find a group and save money!</p>
      </div>

      {pools.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow">
          <h3 className="text-2xl font-bold text-gray-900">No Active {poolType} Pools</h3>
          <p className="text-gray-600 mt-2">Why not be the first to create one?</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.map(pool => (
            <PoolCard key={pool._id} pool={pool} onSettled={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
