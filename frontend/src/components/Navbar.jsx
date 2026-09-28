import React, { useState } from 'react';
import { MdLocationOn, MdLogout, MdPhonelinkErase, MdMap } from 'react-icons/md';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useLogoutMutation, useLogoutAllMutation } from '../features/auth/queries';
import { openInGoogleMaps } from '../utils/location';
import { useUserLocation } from '../hooks/useUserLocation';

const Navbar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // Authentication mutations
  const logoutMutation = useLogoutMutation();
  const logoutAllMutation = useLogoutAllMutation();

  // Local state for dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);

  // Custom hook: handles fetching, state, caching, and auto-detecting user location on mount
  const location = useUserLocation(true);

  // Open location in Google Maps
  const handleOpenMap = (e) => {
    e.stopPropagation(); // Stop click event from bubbling up to parent div
    if (location.latitude && location.longitude) {
      openInGoogleMaps(location.latitude, location.longitude);
    } else {
      location.fetchLocation(true); // Trigger manual location fetch
    }
  };

  // Handle single device logout
  const handleLogout = () => {
    if (user?._id) {
      logoutMutation.mutate(
        { userId: user._id, deviceId: 'web' },
        { onSuccess: () => navigate('/login') }
      );
    } else {
      navigate('/login');
    }
  };

  // Handle logout across all devices
  const handleLogoutAll = () => {
    if (user?._id) {
      logoutAllMutation.mutate(
        { userId: user._id },
        { onSuccess: () => navigate('/login') }
      );
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      
      {/* 1. App Logo */}
      <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
        <h1 className="text-primary text-3xl font-extrabold tracking-tight">HungeryHub</h1>
      </div>

      {/* 2. Search & Location Bar */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow duration-300">

          {/* Location Detection Button */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => location.fetchLocation(true)}
            title="Click to detect current location"
          >
            <MdLocationOn className="text-primary text-xl" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors capitalize">
              {location.isLoading ? 'Locating...' : location.city || 'Select Location'}
            </span>

            {/* Google Maps Button (Visible when coordinates exist) */}
            {location.latitude && location.longitude && (
              <button
                type="button"
                onClick={handleOpenMap}
                className="text-xs bg-red-50 hover:bg-red-100 text-primary px-2 py-0.5 rounded font-semibold transition-colors flex items-center gap-1 ml-1"
                title="Open location on Google Maps"
              >
                <MdMap className="text-sm" /> Map
              </button>
            )}
          </div>

          {/* Vertical Separator */}
          <div className="h-5 w-px bg-gray-300 mx-4"></div>

          {/* Search Input */}
          <div className="flex items-center flex-1 gap-2">
            <FiSearch className="text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>

        </div>
      </div>

      {/* 3. Right Action Items */}
      <div className="flex items-center gap-6 flex-shrink-0 relative">

        {/* Cart Icon */}
        <div className="relative cursor-pointer group">
          <FiShoppingCart className="text-gray-600 text-2xl group-hover:text-primary transition-colors" />
          <div className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
            0
          </div>
        </div>

        {/* My Orders Button */}
        <button className="bg-[#ff4d3d1a] hover:bg-[#ff4d3d2a] text-primary px-4 py-1.5 rounded-md text-sm font-semibold transition-colors duration-200">
          My Orders
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
          <span className="text-gray-700 font-bold text-sm hidden md:block">{user?.name || 'User'}</span>
          <div className="bg-primary hover:bg-primary-hover text-white h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm transition-colors duration-200">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>

        {/* Profile Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 top-12 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-800">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150"
            >
              <MdLogout className="text-gray-500" />
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>

            <button
              onClick={handleLogoutAll}
              disabled={logoutAllMutation.isPending}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-150"
            >
              <MdPhonelinkErase className="text-red-500" />
              {logoutAllMutation.isPending ? 'Logging out...' : 'Logout All Devices'}
            </button>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
