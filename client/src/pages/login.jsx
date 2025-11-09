import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextInput from '../components/TextInput.jsx';
import Button from '../components/Button.jsx';
import Spinner from '../components/Spinner.jsx';

const FORM_MODES = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
};

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [mode, setMode] = useState(FORM_MODES.LOGIN);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setError(null);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = mode === FORM_MODES.LOGIN ? '/api/auth/login' : '/api/auth/register';
    const url = `${API_URL}${endpoint}`;

    try {
      const response = await axios.post(url, formData);
      const { token, email, ecoPoints } = response.data || {};

      if (!token) throw new Error('Authentication failed. No token returned.');

      localStorage.setItem('campusPoolToken', token);
      localStorage.setItem('campusPoolUser', JSON.stringify({ email, ecoPoints }));

      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      console.error('Auth failed:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred. Please try again.');
    }
  };

  const isLoginMode = mode === FORM_MODES.LOGIN;
  const submitDisabled = loading || !formData.email.trim() || !formData.password;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-4xl font-bold text-center text-yellow-600 mb-8">
          {isLoginMode ? 'Welcome Back!' : 'Join CampusRide'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <TextInput
            type="email"
            name="email"
            placeholder="Your College Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            autoComplete="email"
          />

          <TextInput
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            autoComplete={isLoginMode ? 'current-password' : 'new-password'}
          />

          {error && (
            <div className="text-red-500 text-sm font-medium p-3 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth={true} disabled={submitDisabled}>
            {loading ? <Spinner /> : isLoginMode ? 'Log In' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              setMode(isLoginMode ? FORM_MODES.REGISTER : FORM_MODES.LOGIN);
              setError(null);
            }}
            className="text-yellow-600 hover:text-yellow-500 font-medium transition-all"
          >
            {isLoginMode
              ? "Don't have an account? Register"
              : 'Already have an account? Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
