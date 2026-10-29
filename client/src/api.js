import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: 90000,
  headers: { "Content-Type": "application/json" },
});

export function getApiError(error) {
  return error?.response?.data?.error?.message
    || "Something went wrong. Check your connection and try again.";
}

export default api;
