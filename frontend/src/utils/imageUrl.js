/**
 * Formats an image path into a full URL.
 * 
 * @param {string} imagePath - The relative or absolute image path/URL.
 * @returns {string} The full image URL.
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already an absolute URL (Cloudinary, external, or blob/data URI), return as is
  if (
    imagePath.startsWith('http://') || 
    imagePath.startsWith('https://') || 
    imagePath.startsWith('blob:') || 
    imagePath.startsWith('data:')
  ) {
    return imagePath;
  }
  
  // Get base URL for the backend server
  // VITE_API_BASE_URL is typically "http://localhost:3000/api/v1"
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
  
  // Strip the /api/v1 suffix to get the raw server URL
  const backendBaseUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, '');
  
  // Ensure the relative path starts with a slash
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${backendBaseUrl}${cleanPath}`;
};
