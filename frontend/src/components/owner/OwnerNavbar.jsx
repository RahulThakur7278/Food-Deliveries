import React from 'react';
import { MdDashboard, MdStorefront, MdRestaurantMenu, MdOutlineReceipt } from 'react-icons/md';

const OwnerNavbar = ({ activeTab, setActiveTab }) => {
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
        <h1 className="text-primary text-3xl font-extrabold tracking-tight">Vingo</h1>
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
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* User Avatar */}
        <div className="bg-primary hover:bg-primary-hover text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm transition-colors duration-200">
          A
        </div>
      </div>
    </nav>
  );
};

export default OwnerNavbar;
