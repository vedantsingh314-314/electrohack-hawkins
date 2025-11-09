import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting after login
import axios from 'axios'; // For API calls
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Spinner from '../components/Spinner'; // For loading state

const FORM_MODES = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
};

// Get the API URL from our .env file
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
    setError(null); // Clear error on new input
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isLoginMode = mode === FORM_MODES.LOGIN;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    const url = `${API_URL}${endpoint}`;

    try {
      // 1. Send the form data to the backend API
      const response = await axios.post(url, formData);

      // 2. If successful, backend sends back a token and user data
      const { token, email, ecoPoints } = response.data;

      // 3. Store token in localStorage
      localStorage.setItem('campusPoolToken', token);

      // 4. Optionally store user info
      localStorage.setItem('campusPoolUser', JSON.stringify({ email, ecoPoints }));

      // 5. Stop loading and redirect to the homepage
      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      console.error('LOGIN/REGISTER FAILED:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl shadow-2xl p-8">
        <h2 className="text-4xl font-bold text-center text-cyan-400 mb-8">
          {isLoginMode ? 'Welcome Back!' : 'Join CampusPool'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextInput
            type="email"
            name="email"
            placeholder="Your College Email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextInput
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />

          {/* Show error message */}
          {error && (
            <div className="text-red-400 text-sm font-medium p-3 bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? <Spinner /> : isLoginMode ? 'Log In' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() =>
              setMode(isLoginMode ? FORM_MODES.REGISTER : FORM_MODES.LOGIN)
            }
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-all"
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
