import React from 'react';

const DeliveryboyNavbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="flex-shrink-0 cursor-pointer">
        <h1 className="text-primary text-3xl font-extrabold tracking-tight">Vingo</h1>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <span className="font-medium text-gray-700">Delivery Dashboard</span>
      </div>
    </nav>
  );
};

export default DeliveryboyNavbar;
