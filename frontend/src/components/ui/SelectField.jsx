import React from 'react';

const SelectField = ({ label, name, value, onChange, options = [], required = false }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-bold text-gray-700">{label}</label>}
      <select 
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
