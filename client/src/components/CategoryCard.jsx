import React from 'react';
import { Link } from 'react-router-dom';

function CategoryCard({ title, description, to }) {
  return (
    <Link 
      to={to} 
      className="block p-6 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-yellow-500/30 hover:-translate-y-1"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}

export default CategoryCard;