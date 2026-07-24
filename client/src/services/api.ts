import axios from "axios";

const api = axios.create({
  baseURL: "https://devflow-ai-twrb.onrender.com/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("❌ Failed URL:", error.config?.url);
    console.log("❌ Status:", error.response?.status);
    console.log("❌ Response:", error.response?.data);
    return Promise.reject(error);
  }
);

export default api;