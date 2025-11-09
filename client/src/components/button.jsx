import React from 'react';

function Button({ children, onClick, type = 'button', fullWidth = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-6 py-3 rounded-lg font-bold text-white shadow-lg
        bg-cyan-600 hover:bg-cyan-500
        focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75
        transition-all duration-200 ease-in-out
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {children}
    </button>
  );
}

export default Button;