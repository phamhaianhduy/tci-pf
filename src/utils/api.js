import axios from "axios";
import { toast } from "react-toastify";
import verifyTokenExpiry from "./verifyTokenExpiry";
import { loadingStore } from "../stores/LoadingStore";

const api = axios.create({
  baseURL: process.env.REACT_APP_RDS_END_POINT,
});

// Request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyTokenExpiry(token);
      config.headers.Authorization = `Bearer ${token}`;
    }

    loadingStore.startLoading();
    return config;
  },
  (error) => {
    loadingStore.stopLoading();
    return Promise.reject(error);
  }
);

// Response
api.interceptors.response.use(
  (response) => {
    loadingStore.stopLoading();
    return response;
  },
  (error) => {
    loadingStore.stopLoading();
    const code = error?.response?.status;

    if (code === 401) {
      toast.warn("Unauthorized. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (code >= 500) {
      toast.error("Server error, please try again later.");
    }

    return Promise.reject(error);
  }
);

export default api;
