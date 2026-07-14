import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Axios instance with headers
const api = axios.create({
  baseURL: `${API_URL}/admin/albums`,
});

// Fetch all albums with pagination
export const fetchAlbums = async () => {
  try {
    const response = await api.get("", {});

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    
    return response.data;
  } catch (error) {
    // toast.error("Error fetching albums"); // Display error notification using toast
    console.error("Error fetching albums:", error); // Log error for debugging
    throw error; // Re-throw the error if needed
  }
};


export const updateImage = async (token, imageId, formData) => {
  try {
    const response = await api.put(`/images/${imageId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAlbumImages = async (albumId) => {
  try {
    

    // Make sure to use the complete URL or relative path correctly
    const response = await api.get(`/images/${albumId}`);

    // Log the raw response for debugging
    

    // Check if the response data exists and has the expected structure
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'Failed to fetch images');
    }

    // Verify we have images array before returning
    if (!response.data.images || !Array.isArray(response.data.images)) {
      console.error("Unexpected response format:", response.data);
      throw new Error("Response missing images array");
    }

    return response.data;
  } catch (error) {
    // Enhanced error logging
    console.error("Error fetching album images:", error);

    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    }

    throw new Error("Failed to fetch album images");
  }
};