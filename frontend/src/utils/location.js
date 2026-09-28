/**
 * Geolocation & Google Maps Utility
 * Allows requesting user location, reverse-geocoding, and viewing on Google Maps.
 */

/**
 * Gets the user's current GPS coordinates (Latitude & Longitude)
 * 
 * @returns {Promise<{ latitude: number, longitude: number, accuracy: number }>}
 */
export const getCoordinates = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser.'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let errorMsg = 'Failed to retrieve location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'User denied the request for Geolocation.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMsg = 'The request to get user location timed out.';
            break;
          default:
            break;
        }
        reject(new Error(errorMsg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Reverse geocodes coordinates (lat/lng) into address, city, state, and zipcode
 * Uses OpenStreetMap Nominatim free API.
 * 
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<{ city: string, state: string, zipcode: string, formattedAddress: string, raw: object }>}
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address details');
    }

    const data = await response.json();
    const address = data.address || {};

    // Extract city (handling different administrative level names in Nominatim)
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.suburb ||
      address.county ||
      address.district ||
      'Unknown City';

    const state = address.state || '';
    const zipcode = address.postcode || '';
    const formattedAddress = data.display_name || `${city}, ${state}`;

    return {
      city,
      state,
      zipcode,
      country: address.country || '',
      formattedAddress,
      raw: data,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      city: 'Unknown City',
      state: '',
      zipcode: '',
      country: '',
      formattedAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      raw: null,
    };
  }
};

/**
 * Gets complete user location (Coordinates + Address/City info + Google Maps Link)
 * 
 * @returns {Promise<{ latitude: number, longitude: number, city: string, state: string, zipcode: string, formattedAddress: string, googleMapsUrl: string }>}
 */
export const getUserCurrentLocation = async () => {
  const coords = await getCoordinates();
  const addressInfo = await reverseGeocode(coords.latitude, coords.longitude);
  const googleMapsUrl = getGoogleMapsUrl(coords.latitude, coords.longitude);

  return {
    ...coords,
    ...addressInfo,
    googleMapsUrl,
  };
};

/**
 * Generates a Google Maps URL for given latitude and longitude
 * 
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {string} Google Maps URL
 */
export const getGoogleMapsUrl = (latitude, longitude) => {
  if (!latitude || !longitude) return '';
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
};

/**
 * Opens Google Maps in a new tab showing the current/specified location
 * 
 * @param {number} latitude 
 * @param {number} longitude 
 */
export const openInGoogleMaps = (latitude, longitude) => {
  const url = getGoogleMapsUrl(latitude, longitude);
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

/**
 * Subscribes to real-time location changes
 * 
 * @param {function} onSuccess 
 * @param {function} onError 
 * @returns {number} watchId (use navigator.geolocation.clearWatch(watchId) to stop)
 */
export const watchUserLocation = (onSuccess, onError) => {
  if (!navigator.geolocation) {
    if (onError) onError(new Error('Geolocation is not supported by your browser.'));
    return null;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
    },
    onError,
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000,
    }
  );
};
