// galleryService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Get all products with pagination support
 * @param {number} page - Current page number (default: 1)
 * @param {number} limit - Number of items per page (default: 10)
 * @param {string} categoryType - Optional filter by category type
 * @param {object} filters - Optional additional filters (status, type, area, search)
 * @returns {Object} Products and pagination data
 */
export const getAllProducts = async (page = 1, limit = 10, categoryType = null, filters = {}) => {
  try {
    // Start with basic pagination params
    const params = { page, limit };
    
    // Add categoryType to params if provided
    if (categoryType) {
      params.categoryType = categoryType;
    }
    
    // Add any additional filters
    if (filters.status && filters.status.length > 0) {
      params.status = filters.status.join(',');
    }
    
    if (filters.type && filters.type.length > 0) {
      params.type = filters.type.join(',');
    }
    
    if (filters.area && filters.area.length > 0) {
      params.area = filters.area.join(',');
    }
    
    if (filters.search) {
      params.search = filters.search;
    }
    
    const response = await axios.get(`${API_URL}/admin/products`, { params });
    
    return {
      success: response.data.success,
      products: response.data.products,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('Error fetching products with pagination:', error);
    throw error;
  }
};

/**
 * Fetch products with pagination and optional filters
 * @param {string} categoryType - Category type to filter by
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Number of items per page (default: 100)
 * @returns {Object} Products data and pagination info
 */
export const fetchProducts = async (categoryType, page = 1, limit = 400) => {
  try {
    const response = await axios.get(`${API_URL}/admin/products`, {
      params: {
        categoryType,
        page,
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchPropertyStatus = async () => {
  try {
    
    const response = await axios.get(`${API_URL}/admin/propertyStatus`);
    
    
    
    if (!response.data) {
      throw new Error("Empty response data");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    throw error;
  }
};

export const fetchPropertyType = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/propertyTypes`);

    return response.data;
  } catch (error) {
    console.error("Error fetching property type:", error);
    throw error;
  }
};

export const fetchAreas = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/area`);
    const areas = response.data.areas.map((area) => area.area);
    return { success: true, areas };
  } catch (error) {
    console.error("Error fetching areas:", error);
    throw error;
  }
};