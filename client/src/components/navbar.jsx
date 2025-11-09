import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('campusPoolUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('campusPoolToken');
    localStorage.removeItem('campusPoolUser');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. Logo (Your "upright" logo) */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-yellow-600">
              CampusRide 🚀
              {/* ^^^ CHANGE "CampusRide" TO YOUR NEW NAME! */}
            </Link>
          </div>

          {/* 2. Right Side: Eco-Points & Profile */}
          <div className="flex items-center space-x-4">
            {/* Eco-Points */}
            {user && (
              <span className="text-green-600 font-bold text-sm">
                ♻ {user.ecoPoints || 0} Points
              </span>
            )}
            
            {/* Profile Icon (We'll make this a link to a future /profile page) */}
            <Link to="/profile" className="text-gray-700 hover:text-black">
              <span className="text-3xl">👤</span>
            </Link>

            {/* We'll hide the logout button behind the profile icon later.
                For now, we can add it here or just let the user log out 
                from their profile page (which doesn't exist yet). 
                Let's add it for simplicity. */}
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