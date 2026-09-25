import React from 'react';
import UserNavbar from '../../components/user/UserNavbar';
import CategoryList from '../../components/user/CategoryList';
import ShopList from '../../components/user/ShopList';
import ItemList from '../../components/user/ItemList';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-[#fffaf8]">
      <UserNavbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <CategoryList />
        <ShopList />
        <ItemList />
      </main>
    </div>
  );
};

export default UserDashboard;
