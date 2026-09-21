import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const InputField = ({ label, type = 'text', placeholder, value, onChange, name, icon, required, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col mb-4 w-full">
      {label && <label className="text-[14px] font-semibold mb-2 text-[#333]">{label}</label>}
      <div className="relative flex items-center">
        <input
          type={inputType}
          name={name}
          className="w-full py-3 px-3.5 border border-border-light rounded-md text-[14px] outline-none transition-all duration-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder-[#a0a0a0] file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          {...rest}
        />
        {isPassword ? (
          <span 
            className="absolute right-3 text-[#888] flex items-center justify-center cursor-pointer hover:text-[#555] transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </span>
        ) : icon ? (
          <span className="absolute right-3 text-[#888] flex items-center justify-center cursor-pointer">
            {icon}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default InputField;
