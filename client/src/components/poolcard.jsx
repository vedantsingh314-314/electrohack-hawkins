import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from './Button.jsx';
import Countdown from './Countdown.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function PoolCard({ pool, onSettled }) {
  const [inputCost, setInputCost] = useState('');
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isLocalPaid, setIsLocalPaid] = useState(false);

  const navigate = useNavigate();

  if (!pool) return null;

  const {
    _id, type, destination, meetUpPoint, time, members, maxSize,
    expiresAt, status, splitCost, baseCost, poolMode, createdBy
  } = pool;

  const userString = localStorage.getItem('campusPoolUser');
  const currentUserEmail = userString ? JSON.parse(userString).email : null;
  const isCreator = createdBy.email === currentUserEmail;
  const poolPaidKey = `paid_${currentUserEmail}_${_id}`;

  // Check if user already paid locally
  useEffect(() => {
    if (localStorage.getItem(poolPaidKey) === 'true') {
      setIsLocalPaid(true);
    }
  }, [poolPaidKey]);

  const isBookNowActive = expiresAt && new Date(expiresAt) > new Date() && poolMode === 'now';
  const isBookLaterActive = expiresAt && new Date(expiresAt) > new Date() && poolMode === 'later';

  // --- Finalize Pool ---
  const handleFinalizePool = async () => {
    if (!inputCost || isNaN(inputCost) || parseFloat(inputCost) <= 0) {
      alert('Please enter a valid base cost (e.g., 400).');
      return;
    }

    if (!window.confirm(`Are you sure you want to finalize this pool with a base cost of ₹${inputCost}? This cannot be undone.`)) return;

    setIsFinalizing(true);

    try {
      const token = localStorage.getItem('campusPoolToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const data = { baseCost: parseFloat(inputCost) };

      await axios.put(`${API_URL}/api/pools/finalize/${_id}`, data, config);
      alert('Pool finalized! The final bill is calculated.');
      window.location.reload();
    } catch (err) {
      console.error('Failed to finalize pool:', err);
      alert(err.response?.data?.message || 'Failed to finalize pool due to a server error.');
    } finally {
      setIsFinalizing(false);
    }
  };

  // --- Join Pool ---
  const handleJoinPool = async () => {
    if (!window.confirm('Are you sure you want to join this pool?')) return;

    try {
      const token = localStorage.getItem('campusPoolToken');
      if (!token) { navigate('/login'); return; }
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`${API_URL}/api/pools/join/${_id}`, null, config);
      alert('You joined the pool! 🚀');
      window.location.reload();
    } catch (err) {
      console.error('Failed to join pool:', err);
      alert(err.response?.data?.message || 'Failed to join pool.');
    }
  };

  // --- Payment Simulation ---
  const handlePayment = () => {
    const fakeAmount = splitCost ? splitCost.toFixed(2) : (Math.random() * 100 + 50).toFixed(2);

    alert(`--- PAYMENT SUCCESSFUL (DEMO) ---\nYou paid your exact share of ₹${fakeAmount} via UPI Split. Transaction complete.`);

    localStorage.setItem(poolPaidKey, 'true');
    if (onSettled) onSettled(_id);
  };

  // Hide card if already paid locally
  if (isLocalPaid) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-yellow-500/20">
      <div className="p-5">

        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${type === 'Ride' ? 'bg-yellow-500 text-yellow-950' : 'bg-lime-500 text-lime-950'}`}>
            {type === 'Ride' ? '🚗 Ride' : '🍔 Food'}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-1">{destination}</h3>
        <p className="text-sm text-gray-500 mb-4">From: {meetUpPoint}</p>

        {/* Members Progress */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900">{members.length} / {maxSize} Joined</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(members.length / maxSize) * 100}%` }} />
          </div>
        </div>

        {/* Finalized */}
        {status === 'Finalized' && (
          <div className="text-center p-4 bg-green-100 rounded-lg">
            <p className="text-lg font-bold text-green-700">✅ FINAL BILL</p>
            <p className="text-sm text-gray-700 mt-1">Total Cost: ₹{baseCost.toFixed(2)}</p>
            <p className="text-xl font-extrabold text-green-900 mt-1">Your Share: ₹{splitCost.toFixed(2)}</p>
            <Button onClick={handlePayment} fullWidth className="mt-3">Pay Your Share (Demo)</Button>
          </div>
        )}

        {/* Closed - Finalization (Creator Only) */}
        {status !== 'Finalized' && !isBookNowActive && !isBookLaterActive && isCreator && (
          <div className="text-center p-3 bg-red-100 rounded-lg space-y-2">
            <p className="font-bold text-red-600">CLOSING WINDOW OVER</p>
            <p className="text-sm text-gray-700">Enter final cost to calculate split:</p>
            <input
              type="number"
              value={inputCost}
              onChange={(e) => setInputCost(e.target.value)}
              placeholder="Enter Base Cost (e.g., 400)"
              className="w-full px-3 py-2 border rounded text-gray-900"
            />
            <Button onClick={handleFinalizePool} fullWidth disabled={isFinalizing}>
              {isFinalizing ? 'Finalizing...' : 'Finalize & Split Bill'}
            </Button>
          </div>
        )}

        {/* Active */}
        {status === 'Active' && (
          <>
            {isBookNowActive && (
              <div className="text-center p-3 bg-gray-100 rounded-lg mb-3">
                <p className="text-gray-700">Joining window closes in: <Countdown expiryTimestamp={expiresAt} /></p>
              </div>
            )}
            {isBookLaterActive && (
              <div className="text-center p-3 bg-gray-100 rounded-lg mb-3">
                <p className="text-gray-700">Can join for: <Countdown expiryTimestamp={expiresAt} /></p>
              </div>
            )}
            <Button fullWidth onClick={handleJoinPool}>Join Pool</Button>
          </>
        )}

        {/* Full but not finalized */}
        {status === 'Full' && status !== 'Finalized' && (
          <Button fullWidth onClick={handlePayment}>Pay Your Share (Demo)</Button>
        )}

        {/* Expired */}
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
