import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // NEW: This hook runs when the component loads
  useEffect(() => {
    // Try to get user info from local storage
    const userData = localStorage.getItem('campusPoolUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []); // The empty [] means this runs only once on load

  // NEW: This is the logout function
  const handleLogout = () => {
    // 1. Clear the token and user data from storage
    localStorage.removeItem('campusPoolToken');
    localStorage.removeItem('campusPoolUser');
    
    // 2. Clear the user state
    setUser(null);
    
    // 3. Redirect to the login page
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. Logo / Home Link */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-cyan-400">
              CampusPool 🚀
            </Link>
          </div>

          {/* 2. Main Nav Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/create"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Create Pool
            </Link>
          </div>

          {/* 3. Right Side / User Info & Logout */}
          <div className="flex items-center space-x-4">
            {/* NEW: Show Eco-Points if user is logged in */}
            {user && (
              <span className="text-lime-400 font-bold text-sm">
                ♻ {user.ecoPoints || 0} Points
              </span>
            )}
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-500"
            >
              Log Out
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;