import React from 'react';
import Navbar from './Navbar.jsx';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
}

export default Layout;