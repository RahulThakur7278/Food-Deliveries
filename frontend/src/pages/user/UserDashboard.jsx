import React from 'react';

const UserDashboard = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f9f9f9] p-5">
      <div className="bg-white w-full max-w-[800px] p-8 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] text-center">
        <h1 className="text-primary text-3xl font-bold mb-4">User Dashboard</h1>
        <p className="text-[#666] text-[16px]">Welcome to the User Dashboard.</p>
      </div>
    </div>
  );
};

export default UserDashboard;
