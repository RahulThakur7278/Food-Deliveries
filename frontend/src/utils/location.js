/**
 * Location Utility Functions
 * 
 * Provides easy-to-use functions to:
 * 1. Get browser GPS coordinates (Latitude & Longitude)
 * 2. Convert coordinates into a human-readable city/address (Reverse Geocoding)
 * 3. Generate and open Google Maps links
 */

/**
 * Step 1: Fetch raw GPS coordinates from the user's browser.
 * Uses the browser's built-in Geolocation API.
 * 
 * @returns {Promise<{ latitude: number, longitude: number }>}
 */
export const getCoordinates = () => {
  return new Promise((resolve, reject) => {
    // Check if the browser supports Geolocation
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser.'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success callback: return latitude and longitude
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        // Error callback: user denied access or location service failed
        let errorMessage = 'Failed to fetch location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission was denied. Please allow location access in your browser.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is currently unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true, // Request best possible accuracy
        timeout: 10000,          // Time limit: 10 seconds
        maximumAge: 0,           // Always fetch fresh coordinates
      }
    );
  });
};

/**
 * Step 2: Convert GPS coordinates (lat, lng) into city name and address.
 * Uses OpenStreetMap's free Nominatim Reverse Geocoding API.
 * 
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<{ city: string, state: string, zipcode: string, formattedAddress: string }>}
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'Accept-Language': 'en', // Get address names in English
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address details from reverse geocoding API.');
    }

    const data = await response.json();
    const address = data.address || {};

    // OpenStreetMap returns city under different field names depending on region:
    let extractedCity =
      address.city ||
      address.state_district ||
      address.municipality ||
      address.town ||
      address.county ||
      address.city_district ||
      address.suburb ||
      address.village ||
      address.district ||
      'Unknown City';


    const city = address.city || 'Unknown City';
    const state = address.state || '';
    const zipcode = address.postcode || '';
    const formattedAddress = data.display_name || `${city}, ${state}`;

    return {
      city,
      state,
      zipcode,
      country: address.country || '',
      formattedAddress,
    };
  } catch (error) {
    console.error('Error during reverse geocoding:', error);
    return {
      city: 'Unknown City',
      state: '',
      zipcode: '',
      country: '',
      formattedAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
    };
  }
};

/**
 * Step 3: Combined helper function.
 * Gets user coordinates, converts them to city/address, and adds a Google Maps link.
 * 
 * @returns {Promise<{ latitude: number, longitude: number, city: string, state: string, googleMapsUrl: string }>}
 */
export const getUserCurrentLocation = async () => {
  const coords = await getCoordinates();
  const addressDetails = await reverseGeocode(coords.latitude, coords.longitude);
  const googleMapsUrl = getGoogleMapsUrl(coords.latitude, coords.longitude);

  return {
    ...coords,
    ...addressDetails,
    googleMapsUrl,
  };
};

/**
 * Helper: Creates a Google Maps link for given latitude & longitude.
 */
export const getGoogleMapsUrl = (latitude, longitude) => {
  if (!latitude || !longitude) return '';
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
};

/**
 * Helper: Opens Google Maps in a new browser tab.
 */
export const openInGoogleMaps = (latitude, longitude) => {
  const url = getGoogleMapsUrl(latitude, longitude);
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
