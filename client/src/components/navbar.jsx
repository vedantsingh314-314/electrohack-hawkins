import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check local storage for user data
    const userData = localStorage.getItem('campusPoolUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    // Runs only once on mount
  }, []); 

  const handleLogout = () => {
    // Clear user session data
    localStorage.removeItem('campusPoolToken');
    localStorage.removeItem('campusPoolUser');
    setUser(null);
    navigate('/login');
  };

  const handleLoginSignup = () => {
    navigate('/login'); // Redirect to login/signup page
  };

  const isLoggedIn = !!user; // Convert user object/null to boolean

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* 1. Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-yellow-600">
              UpRight
            </Link>
          </div>

          {/* 2. Right Side: Eco-Points & Profile & Auth Button */}
          <div className="flex items-center space-x-4">
            
            {/* Eco-Points (Only show if logged in) */}
            {isLoggedIn && (
              <span className="text-green-600 font-bold text-sm">
                ♻ {user.ecoPoints || 0} Points
              </span>
            )}
            
            {/* Profile Icon (Only show if logged in) */}
            {isLoggedIn && (
              <Link to="/profile" className="text-gray-700 hover:text-black">
                <span className="text-3xl">👤</span>
              </Link>
            )}

            {/* Dynamic Auth Button */}
            <button
              onClick={isLoggedIn ? handleLogout : handleLoginSignup}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-all
                ${isLoggedIn ? 'bg-red-600 hover:bg-red-500' : 'bg-yellow-600 hover:bg-yellow-500 text-gray-900'}
              `}
            >
              {isLoggedIn ? 'Log Out' : 'Login / Signup'}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
