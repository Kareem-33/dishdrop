import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://dishdrop-api.vercel.app/api/v1";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default axiosInstance;