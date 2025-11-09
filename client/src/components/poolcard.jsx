import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Countdown from './Countdown';

const API_URL = import.meta.env.VITE_API_URL;

function PoolCard({ pool, onJoin }) {
  const navigate = useNavigate();

  // ✅ If pool prop is missing or undefined, skip rendering
  if (!pool) {
    return null;
  }

  const {
    _id,
    type,
    destination,
    meetUpPoint,
    time,
    members = [],
    maxSize = 4,
    expiresAt,
    status,
    poolMode,
  } = pool;

  // ✅ Handle joining a pool
  const handleJoinPool = async () => {
    if (!window.confirm('Are you sure you want to join this pool?')) return;

    try {
      const token = localStorage.getItem('campusPoolToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_URL}/api/pools/join/${_id}`, null, config);

      alert('You joined the pool! 🚀');
      if (onJoin) onJoin(); // ✅ Tell parent (Dashboard) to refresh data
    } catch (err) {
      console.error('Failed to join pool:', err);
      alert(err.response?.data?.message || 'Failed to join pool.');
    }
  };

  // ✅ Fake payment demo
  const handlePayment = () => {
    const fakeAmount = (Math.random() * 100 + 50).toFixed(2);
    alert(
      `--- PAYMENT DEMO ---\nThis would open your UPI app (Paytm, GPay) to pay your share of ₹${fakeAmount}!`
    );
  };

  // ✅ Timer conditions
  const now = new Date();
  const expiryDate = expiresAt ? new Date(expiresAt) : null;
  const isBookNowActive = poolMode === 'now' && expiryDate && expiryDate > now;
  const isBookLaterActive = poolMode === 'later' && expiryDate && expiryDate > now;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-yellow-500/30">
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              type === 'Ride'
                ? 'bg-yellow-500 text-yellow-950'
                : 'bg-lime-500 text-lime-950'
            }`}
          >
            {type === 'Ride' ? '🚗 Ride' : '🍔 Food'}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Destination & Meet Point */}
        <h3 className="text-xl font-bold text-gray-900 mb-1">{destination}</h3>
        <p className="text-sm text-gray-500 mb-4">From: {meetUpPoint}</p>

        {/* Members Progress */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900">
            {members.length} / {maxSize} Joined
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div
              className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(members.length / maxSize) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Conditional Actions */}
        {status === 'Active' && (
          <>
            {isBookNowActive && (
              <div className="text-center p-3 bg-gray-100 rounded-lg mb-3">
                <p className="text-gray-700">
                  Joining window closes in:{' '}
                  <Countdown expiryTimestamp={expiresAt} />
                </p>
              </div>
            )}

            {isBookLaterActive && (
              <div className="text-center p-3 bg-gray-100 rounded-lg mb-3">
                <p className="text-gray-700">
                  Can join for: <Countdown expiryTimestamp={expiresAt} />
                </p>
              </div>
            )}

            <Button fullWidth onClick={handleJoinPool}>
              Join Pool
            </Button>
          </>
        )}

        {status === 'Full' && (
          <Button fullWidth onClick={handlePayment}>
            Pay Your Share (Demo)
          </Button>
        )}

        {status === 'Expired' && (
          <div className="text-center p-3 bg-red-100 rounded-lg">
            <p className="font-bold text-red-600">This pool has expired.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PoolCard;
