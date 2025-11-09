import React from 'react';
import axios from 'axios';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

// Get the API URL from .env
const API_URL = import.meta.env.VITE_API_URL;

function PoolCard({ pool }) {
  const { _id, type, destination, meetUpPoint, time, members, maxSize } = pool;
  const navigate = useNavigate();

  // Function to call the 'join pool' API
  const handleJoinPool = async () => {
    if (!window.confirm('Are you sure you want to join this pool?')) return;

    try {
      // 1. Get auth token
      const token = localStorage.getItem('campusPoolToken');
      if (!token) {
        navigate('/login');
        return;
      }

      // 2. Set authorization header
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // 3. Call the API to join the pool
      await axios.put(`${API_URL}/api/pools/join/${_id}`, null, config);

      // 4. Success
      alert('You joined the pool! 🚀');
      window.location.reload(); // Refresh dashboard
    } catch (err) {
      console.error('Failed to join pool:', err);
      alert(err.response?.data?.message || 'Failed to join pool.');
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-cyan-500/20">
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              type === 'Ride'
                ? 'bg-cyan-500 text-cyan-950'
                : 'bg-lime-500 text-lime-950'
            }`}
          >
            {type === 'Ride' ? '🚗 Ride' : '🍔 Food'}
          </span>
          <span className="text-sm text-gray-400">
            {new Date(time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-1">{destination}</h3>
        <p className="text-sm text-gray-400 mb-4">From: {meetUpPoint}</p>

        <div className="mb-4">
          <p className="text-sm font-medium text-white">
            {members.length} / {maxSize} Joined
          </p>
          <div className="w-full bg-slate-700 rounded-full h-2.5 mt-1">
            <div
              className="bg-cyan-500 h-2.5 rounded-full"
              style={{ width: `${(members.length / maxSize) * 100}%` }}
            ></div>
          </div>
        </div>

        <Button fullWidth={true} onClick={handleJoinPool}>
          Join Pool
        </Button>
      </div>
    </div>
  );
}

export default PoolCard;
