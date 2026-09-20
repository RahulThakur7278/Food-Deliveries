import React, { useState } from 'react';
import { MdDashboard, MdStorefront, MdRestaurantMenu, MdOutlineReceipt, MdLogout, MdPhonelinkErase } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation, useLogoutAllMutation } from '../../features/auth/queries';

const OwnerNavbar = ({ activeTab, setActiveTab }) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const logoutAllMutation = useLogoutAllMutation();
  
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    if (user?._id) {
      logoutMutation.mutate({ userId: user._id, deviceId: 'web' }, {
        onSuccess: () => {
          navigate('/login');
        }
      });
    }
  };

  const handleLogoutAll = () => {
    if (user?._id) {
      logoutAllMutation.mutate({ userId: user._id }, {
        onSuccess: () => {
          navigate('/login');
        }
      });
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: MdDashboard },
    { id: 'shop', label: 'Shop', icon: MdStorefront },
    { id: 'foodItem', label: 'Food Item', icon: MdRestaurantMenu },
    { id: 'myOrder', label: 'My Order', icon: MdOutlineReceipt },
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      {/* Logo */}
      <div className="flex-shrink-0 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
        <h1 className="text-primary text-3xl font-extrabold tracking-tight">HungryHub</h1>
      </div>

      {/* Center Navigation */}
      <div className="flex flex-1 justify-center items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                isActive 
                  ? 'bg-[#ff4d3d] text-white shadow-sm' 
                  : 'text-gray-500 hover:bg-[#ff4d3d1a] hover:text-primary'
              }`}
            >
              <Icon className="text-lg" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 flex-shrink-0 relative">
        <span className="text-gray-700 font-bold text-sm hidden md:block">{user?.name || 'Owner'}</span>
        {/* User Avatar */}
        <div 
          className="bg-primary hover:bg-primary-hover text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm transition-colors duration-200"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
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

export default OwnerNavbar;
