import React from 'react';
import { MdLocationOn } from 'react-icons/md';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      {/* Logo */}
      <div className="flex-shrink-0 cursor-pointer">
        <h1 className="text-primary text-3xl font-extrabold tracking-tight">HungeryHub</h1>
      </div>

      {/* Search Bar Container */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow duration-300">

          {/* Location Area */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <MdLocationOn className="text-primary text-xl" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">jhansi</span>
          </div>

          {/* Vertical Divider */}
          <div className="h-5 w-px bg-gray-300 mx-4"></div>

          {/* Search Area */}
          <div className="flex items-center flex-1 gap-2">
            <FiSearch className="text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="search delicious food..."
              className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>

        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6 flex-shrink-0">

        {/* Cart Icon */}
        <div className="relative cursor-pointer group">
          <FiShoppingCart className="text-gray-600 text-2xl group-hover:text-primary transition-colors" />
          {/* Badge */}
          <div className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
            0
          </div>
        </div>

        {/* My Orders Pill */}
        <button className="bg-[#ff4d3d1a] hover:bg-[#ff4d3d2a] text-primary px-4 py-1.5 rounded-md text-sm font-semibold transition-colors duration-200">
          My Orders
        </button>

        {/* User Avatar */}
        <div className="bg-primary hover:bg-primary-hover text-white h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm transition-colors duration-200">
          A
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
