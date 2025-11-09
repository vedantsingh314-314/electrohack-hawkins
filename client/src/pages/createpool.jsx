import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import TextInput from '../components/TextInput.jsx';
import Button from '../components/Button.jsx';
import Spinner from '../components/Spinner.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function CreatePool() {
  const { type } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: type,
    destination: '',
    meetUpPoint: '',
    time: '',
  });

  const [poolMode, setPoolMode] = useState('later');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, type }));
  }, [type]);

  const handleInputChange = (e) => {
    setError(null);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSend = { ...formData, poolMode };

    try {
      const token = localStorage.getItem('campusPoolToken');
      if (!token) throw new Error('No token found. Please log in again.');

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${API_URL}/api/pools`, dataToSend, config);

      setLoading(false);
      navigate(`/join-pools/${dataToSend.type}`);
    } catch (err) {
      setLoading(false);
      console.error('Failed to create pool:', err);
      setError(err.response?.data?.message || 'Failed to create pool. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Create a New {type === 'Ride' ? '🚗 Ride' : '🍔 Food'} Pool
        </h1>
        <p className="text-lg text-gray-600 mt-1">Share your trip or order to save costs!</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-8 space-y-6"
      >
        {/* --- Pool Mode Toggle Buttons --- */}
        <div className="flex rounded-lg overflow-hidden border-2 border-gray-300">
          <button
            type="button"
            onClick={() => setPoolMode('later')}
            className={`w-1/2 py-3 font-bold ${
              poolMode === 'later'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-all duration-200`}
          >
            Book for Later
          </button>

          <button
            type="button"
            onClick={() => setPoolMode('now')}
            className={`w-1/2 py-3 font-bold ${
              poolMode === 'now'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-all duration-200`}
          >
            Book Now (5-min window)
          </button>
        </div>

        {/* --- Destination --- */}
        <TextInput
          type="text"
          name="destination"
          placeholder={type === 'Ride' ? 'Where are you going?' : 'What restaurant?'}
          value={formData.destination}
          onChange={handleInputChange}
          required
        />

        {/* --- Meet Up Point --- */}
        <TextInput
          type="text"
          name="meetUpPoint"
          placeholder="Where to meet up? (e.g., Library Entrance)"
          value={formData.meetUpPoint}
          onChange={handleInputChange}
          required
        />

        {/* --- Time Input / Info --- */}
        {poolMode === 'later' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === 'Ride' ? 'Meet Up Time' : 'Order Time'}
            </label>
            <input
              type="datetime-local"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-200 text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
              required
            />
          </div>
        ) : (
          <div className="p-3 bg-gray-100 rounded-lg text-center">
            <p className="text-yellow-600 font-medium">
              A 5-minute joining window will start now.
            </p>
            <p className="text-gray-600 text-sm">Meetup will be in 10 minutes.</p>
          </div>
        )}

        {/* --- Error Message --- */}
        {error && (
          <div className="text-red-500 text-sm font-medium p-3 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* --- Submit Button --- */}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? <Spinner /> : 'Create Pool'}
        </Button>
      </form>
    </div>
  );
}

export default CreatePool;
