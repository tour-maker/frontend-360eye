import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Axios instance with headers
const api = axios.create({
  baseURL: `${API_URL}/admin/enquiries`,
});

// Submit an enquiry
export const submitEnquiry = async (formData) => {
  try {
    // Extract recipients from formData if present
    const { recipients, ...formFields } = formData;
    
    // Create the data to send
    const dataToSend = {
      ...formFields,
      // Include recipients if they were provided
      ...(recipients && { recipients })
    };
    
    const response = await api.post("/", dataToSend);
    // Don't show toast here as we're using a modal instead
    return response.data;
  } catch (error) {
    toast.error("Error submitting inquiry. Please try again.");
    console.error("Error submitting inquiry:", error);
    throw error;
  }
};

// Fetch all enquiries
export const fetchEnquiries = async (token) => {
  try {
    const response = await api.get("/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // toast.error("Error fetching enquiries");
    console.error("Error fetching enquiries:", error);
    throw error;
  }
};

// Delete an enquiry
export const deleteEnquiry = async (id, token) => {
  try {
    const response = await api.delete(`/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Enquiry deleted successfully");
    return response.data;
  } catch (error) {
    // toast.error("Error deleting enquiry");
    console.error("Error deleting enquiry:", error);
    throw error;
  }
};