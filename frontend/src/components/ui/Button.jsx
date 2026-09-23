import React from 'react';

const Button = ({ children, variant = 'primary', onClick, type = 'button', icon, fullWidth }) => {
  const baseClasses = "flex items-center justify-center py-3 px-5 rounded-md text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none gap-2";
  const widthClass = fullWidth ? "w-full" : "";
  const variantClasses = variant === 'primary' 
    ? "bg-primary text-white hover:bg-primary-hover" 
    : "bg-transparent text-[#333] border border-border-light hover:bg-[#f0f0f0]";
  
  return (
    <button type={type} className={`${baseClasses} ${widthClass} ${variantClasses}`} onClick={onClick}>
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
