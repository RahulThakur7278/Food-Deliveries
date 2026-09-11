import React from 'react';

const RoleSelector = ({ options, selectedRole, onChange }) => {
  return (
    <div className="flex flex-col mb-6 w-full">
      <label className="text-[14px] font-semibold mb-2 text-[#333]">Role</label>
      <div className="flex gap-2.5">
        {options.map((option) => (
          <div
            key={option.value}
            className={`flex-1 text-center py-2 border rounded-md text-[14px] cursor-pointer transition-all duration-200 ${
              selectedRole === option.value 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white text-[#333] border-border-light hover:border-primary hover:text-primary'
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;
