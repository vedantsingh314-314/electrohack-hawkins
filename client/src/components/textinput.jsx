import React from 'react';

function TextInput({ type, placeholder, value, onChange, name }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-slate-800 text-white border-2 border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-all duration-200"
    />
  );
}

export default TextInput;