import axios from "axios";
import STORAGE_KEYS from "../constants/storageKeys";
import { isDemoMode } from "../utils/demoMode";
import { routeDemoRequest } from "../demo/demoRouter";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (isDemoMode()) {
    return Promise.reject({ __smartbizzDemo: true, config });
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.__smartbizzDemo) {
      const { status, body } = routeDemoRequest(error.config);
      return Promise.resolve({
        data: body,
        status,
        statusText: "OK",
        headers: {},
        config: error.config,
      });
    }
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;