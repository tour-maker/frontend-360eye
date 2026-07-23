import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Fetch all sliders
export const fetchSliders = async () => {
  try {
    
    
    const response = await axios.get(`${API_URL}/public/sliders`);
    
    
    
    // Check the structure of the response
    if (!response.data || response.data.status === 'error') {
      console.error('API Error:', response.data);
      throw new Error(response.data?.message || 'Failed to fetch client data');
    }
    
    // Return the data based on the API response structure
    // Adjust this based on your actual API response structure
    return response.data.sliders || response.data.data || [];
  } catch (error) {
    console.error("Error fetching sliders:", error);
    throw error;
  }
};