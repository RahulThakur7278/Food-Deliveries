import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isInitializing } = useSelector((state) => state.auth);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
        <h1 className="text-primary text-xl font-extrabold tracking-tight">HungeryHub</h1>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect user to their respective default dashboard based on their role
    if (user.role === 'owner') return <Navigate to="/owner-dashboard" replace />;
    if (user.role === 'deliveryBoy') return <Navigate to="/delivery-dashboard" replace />;
    return <Navigate to="/user-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
