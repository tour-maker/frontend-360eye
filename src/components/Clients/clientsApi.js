/**
 * Client logos API service
 * Handles fetching client data from the backend
 */

// Base URL for API requests
const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

/**
 * Fetch all client logos from the API
 * @returns {Promise<Array>} Array of client logo objects
 */
export const fetchClientLogos = async () => {
  try {
    // Add timeout to prevent infinite loading
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${API_URL}/admin/sliders`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && Array.isArray(data.sliders)) {
      // Filter only active sliders and sort by sliderOrder
      const activeSliders = data.sliders.filter(slider => slider.sliderStatus === 'Yes');
      return activeSliders.sort((a, b) => a.sliderOrder - b.sliderOrder);
    } else {
      throw new Error('Invalid data format received from API');
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out after 10 seconds');
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    console.error('Error fetching client logos:', error);
    throw error;
  }
};

/**
 * Filter out duplicate client logos by ID
 * @param {Array} sliders - Array of client logo objects
 * @returns {Array} Array with duplicates removed
 */
export const removeDuplicateLogos = (sliders) => {
  const uniqueSliders = [];
  const seenIds = new Set();
  
  for (const slider of sliders) {
    if (!seenIds.has(slider._id)) {
      uniqueSliders.push(slider);
      seenIds.add(slider._id);
    }
  }
  
  return uniqueSliders;
};

/**
 * Get the full image URL for a client logo
 * @param {string} logoFilename - Filename of the logo image
 * @returns {string} Full URL to the logo image
 */
export const getLogoImageUrl = (logoFilename) => {
  return `${import.meta.env.VITE_BACKEND_URL || API_URL}/uploads/sliders/${logoFilename}`;
};
