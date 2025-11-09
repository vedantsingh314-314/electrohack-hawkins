import React from 'react';
import Navbar from './Navbar.jsx';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}

export default Layout;
