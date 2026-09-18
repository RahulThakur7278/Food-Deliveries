import React from 'react';
import { MdAdd, MdOutlineReceipt } from 'react-icons/md';

const OwnerNavbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      {/* Logo */}
      <div className="flex-shrink-0 cursor-pointer">
        <h1 className="text-primary text-3xl font-extrabold tracking-tight">Vingo</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 flex-shrink-0">
        
        {/* Add Food Item Button */}
        <button className="flex items-center gap-1.5 bg-[#ff4d3d1a] hover:bg-[#ff4d3d2a] text-primary px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200">
          <MdAdd className="text-lg" />
          <span>Add Food Item</span>
        </button>

        {/* My Orders Button */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 bg-[#ff4d3d1a] hover:bg-[#ff4d3d2a] text-primary px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200">
            <MdOutlineReceipt className="text-lg" />
            <span>My Orders</span>
          </button>
          {/* Badge */}
          <div className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
            0
          </div>
        </div>

        {/* User Avatar */}
        <div className="bg-primary hover:bg-primary-hover text-white h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm transition-colors duration-200 ml-2">
          A
        </div>

      </div>
    </nav>
  );
};

export default OwnerNavbar;
