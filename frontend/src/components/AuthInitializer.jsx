import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logoutUser, setAuthLoading } from '../features/auth/authSlice';
import { refreshFn } from '../features/auth/api';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isInitializing } = useSelector((state) => state.auth);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const response = await refreshFn();
        if (isMounted && response?.success && response?.data) {
          dispatch(setCredentials({
            user: response.data,
            accessToken: response.accessToken
          }));
        } else if (isMounted) {
          dispatch(logoutUser());
        }
      } catch (error) {
        if (isMounted) {
          dispatch(logoutUser());
        }
      } finally {
        if (isMounted) {
          dispatch(setAuthLoading(false));
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
        <h1 className="text-primary text-xl font-extrabold tracking-tight">HungeryHub</h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">Verifying session...</p>
      </div>
    );
  }

  return children;
};

export default AuthInitializer;
