import React from 'react';
import Navbar from './navbar';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      <Navbar />
      <main>
        {/* This 'children' prop is where our pages will go */}
        {children}
      </main>
    </div>
  );
}

export default Layout;