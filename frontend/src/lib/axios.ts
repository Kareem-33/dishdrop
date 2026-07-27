import axios from "axios";

const API_PORT = import.meta.env.VITE_API_PORT || 2525;

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE == "development" ? `http://localhost:${API_PORT}/api/v1/` : "/api",
  withCredentials: true,
});

export default axiosInstance;