import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PoolCard from '../components/PoolCard';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ Fetch pools from backend
  const fetchPools = async () => {
    try {
      const token = localStorage.getItem('campusPoolToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_URL}/api/pools`, config);

      // ✅ Ensure pools are valid array
      const validPools = Array.isArray(response.data)
        ? response.data.filter((pool) => pool && pool._id)
        : [];

      setPools(validPools);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pools:', err);
      setError('Failed to load pools.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, []);

  // ✅ Called by PoolCard after join (so no reload needed)
  const handlePoolJoined = () => {
    fetchPools();
  };

  // --- RENDER UI ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-700">Loading pools...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchPools}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Available Pools</h1>
        <Button onClick={() => navigate('/create-pool')}>Create New Pool</Button>
      </div>

      {pools.length === 0 ? (
        <div className="text-center text-gray-600 mt-10">
          <p>No active pools right now. 🚗</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pools.map((pool) => (
            <PoolCard key={pool._id} pool={pool} onJoin={handlePoolJoined} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
