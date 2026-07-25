import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const api = axios.create({
  baseURL: `${API_URL}/admin/careers`,
});

export const fetchOpenRoles = async () => {
  const response = await api.get("/roles", { params: { openOnly: "true" } });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.roles || [];
};

export const fetchCareerSettings = async () => {
  const response = await api.get("/settings");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.settings;
};

export const submitApplication = async (formData) => {
  const response = await api.post("/apply", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data;
};
