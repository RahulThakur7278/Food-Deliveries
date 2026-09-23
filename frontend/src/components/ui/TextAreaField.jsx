import React from 'react';

const TextAreaField = ({ label, name, placeholder, value, onChange, required = false, rows = 3 }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-bold text-gray-700">{label}</label>}
      <textarea 
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
      ></textarea>
    </div>
  );
};

export default TextAreaField;
