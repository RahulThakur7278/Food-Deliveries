import { useState, useEffect, useCallback, useRef } from 'react';
import { getUserCurrentLocation } from '../utils/location';

/**
 * Custom React Hook: useUserLocation
 * 
 * Optimized to prevent unnecessary re-renders and repeated API calls:
 * - Uses `useRef` guard to ensure useEffect runs ONLY ONCE on mount.
 * - Uses cached `localStorage` data first to avoid redundant API calls.
 * - Only re-renders when state actually changes.
 * 
 * @param {boolean} autoFetch - Set to true to automatically detect location if not cached.
 */
export const useUserLocation = (autoFetch = true) => {
  // 1. Read cached location from localStorage for instant display
  const savedCity = localStorage.getItem('userCity') || '';
  const savedLoc = localStorage.getItem('userLocation')
    ? JSON.parse(localStorage.getItem('userLocation'))
    : null;

  // 2. Ref guard to track if initial fetch has already run (prevents duplicate calls in Strict Mode)
  const hasFetchedRef = useRef(false);

  // 3. React state for location
  const [location, setLocation] = useState({
    city: savedCity || 'Detecting...',
    latitude: savedLoc?.latitude || null,
    longitude: savedLoc?.longitude || null,
    state: savedLoc?.state || '',
    zipcode: savedLoc?.zipcode || '',
    formattedAddress: savedLoc?.formattedAddress || '',
    googleMapsUrl: savedLoc?.googleMapsUrl || '',
    isLoading: !savedCity && autoFetch,
    error: null,
  });

  // 4. Memoized fetch function using useCallback to prevent recreating on every render
  const fetchLocation = useCallback(async (isManual = false) => {
    setLocation((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await getUserCurrentLocation();

      const newLocationState = {
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        state: data.state,
        zipcode: data.zipcode,
        formattedAddress: data.formattedAddress,
        googleMapsUrl: data.googleMapsUrl,
        isLoading: false,
        error: null,
      };

      // Save to State and localStorage cache
      setLocation(newLocationState);
      localStorage.setItem('userCity', data.city);
      localStorage.setItem('userLocation', JSON.stringify(newLocationState));

      return newLocationState;
    } catch (err) {
      const errorMsg = err.message || 'Unable to detect location.';

      setLocation((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
        city: prev.city === 'Detecting...' ? 'Select Location' : prev.city,
      }));

      if (isManual) {
        alert(errorMsg);
      }
      return null;
    }
  }, []);

  // 5. useEffect Hook: Runs ONLY ONCE when component mounts
  useEffect(() => {
    // If autoFetch is enabled and we haven't fetched yet
    if (autoFetch && !hasFetchedRef.current) {
      hasFetchedRef.current = true; // Mark as fetched immediately

      // If location is not cached in localStorage, detect it automatically
      if (!savedCity) {
        fetchLocation(false);
      }
    }
  }, [autoFetch, savedCity, fetchLocation]); // Controlled dependencies

  return {
    ...location,
    fetchLocation,
  };
};

export default useUserLocation;
