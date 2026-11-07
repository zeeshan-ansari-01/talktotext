import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Backend ka saaf error message nikalne ka helper
export const getErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong. Please try again.";

export default api;