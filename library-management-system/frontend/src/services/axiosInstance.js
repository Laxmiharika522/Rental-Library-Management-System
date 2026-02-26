  // src/services/axiosInstance.js
  import axios from "axios";

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true, // for JWT cookies if your backend uses credentials
  });

  // Automatically attach JWT from localStorage
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  export default axiosInstance;
