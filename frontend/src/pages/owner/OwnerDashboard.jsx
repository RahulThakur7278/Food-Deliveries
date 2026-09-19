import React, { useState } from 'react';
import OwnerNavbar from '../../components/owner/OwnerNavbar';
import ShopList from '../../components/owner/ShopList';
import FoodList from '../../components/owner/FoodList';
import DashboardHome from '../../components/owner/DashboardHome';

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'shop' | 'foodItem' | 'myOrder'

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <OwnerNavbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <main className="p-5 max-w-7xl mx-auto mt-2">
        {activeTab === 'dashboard' && <DashboardHome />}
        {activeTab === 'shop' && <ShopList />}
        {activeTab === 'foodItem' && <FoodList />}
        {activeTab === 'myOrder' && (
           <div className="flex justify-center items-center h-[50vh]">
             <div className="bg-white w-full max-w-[800px] p-8 rounded-xl shadow-sm text-center border border-gray-100">
               <h1 className="text-gray-400 text-2xl font-bold mb-2">My Orders</h1>
               <p className="text-gray-400 text-sm">Order management view coming soon.</p>
             </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default OwnerDashboard;
