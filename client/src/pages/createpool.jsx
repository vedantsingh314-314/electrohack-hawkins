import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect after creation
import axios from 'axios'; // For API calls
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Spinner from '../components/Spinner'; // For loading state

// Get the API URL from our .env file
const API_URL = import.meta.env.VITE_API_URL;

function CreatePool() {
  const [formData, setFormData] = useState({
    type: 'Ride',
    destination: '',
    meetUpPoint: '',
    time: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setError(null); // Clear error on new input
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Get the auth token from browser storage
      const token = localStorage.getItem('campusPoolToken');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      // 2. Set up the authorization header
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Correct template literal
        },
      };

      // 3. Send the form data to the protected API endpoint
      await axios.post(`${API_URL}/api/pools`, formData, config);

      // 4. Success — stop loading and redirect
      setLoading(false);
      navigate('/'); // Go back to the dashboard
    } catch (err) {
      // 5. Handle errors
      setLoading(false);
      console.error('Failed to create pool:', err);
      setError(err.response?.data?.message || 'Failed to create pool. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white">Create a New Pool</h1>
        <p className="text-lg text-gray-400 mt-1">
          Share a ride or a food order to save costs!
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Pool Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-slate-800 text-white border-2 border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-all duration-200"
          >
            <option value="Ride">🚗 Ride</option>
            <option value="Food">🍔 Food</option>
          </select>
        </div>

        <TextInput
          type="text"
          name="destination"
          placeholder="Where are you going? (e.g., Central Mall, Domino's)"
          value={formData.destination}
          onChange={handleInputChange}
        />

        <TextInput
          type="text"
          name="meetUpPoint"
          placeholder="Where to meet up? (e.g., Library Entrance)"
          value={formData.meetUpPoint}
          onChange={handleInputChange}
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Meet Up Time
          </label>
          <input
            type="datetime-local"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-slate-800 text-white border-2 border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-all duration-200"
          />
        </div>

        {/* Show error message if one exists */}
        {error && (
          <div className="text-red-400 text-sm font-medium p-3 bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? <Spinner /> : 'Create Pool'}
        </Button>
      </form>
    </div>
  );
}

export default CreatePool;
