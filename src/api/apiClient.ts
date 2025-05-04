import axios from "axios";
import { useAuthStore } from "../zustand-stores/auth";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<void> | null = null;
let isRefreshing = false;

// Token refresh function
const refreshToken = async () => {
  if (!refreshPromise) {
    isRefreshing = true;
    refreshPromise = apiClient
      .post("/auth/refresh")
      .then(() => {})
      .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
  }
  await refreshPromise;
};

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await refreshToken();
          return apiClient(originalRequest);
        } catch (refreshError) {
          useAuthStore.setState({ isAuthenticated: false, currentUser: null });

          // Prevent redirect if already on login or signup pages
          const publicPaths = ["/", "/sign-up"];
          if (!publicPaths.includes(window.location.pathname)) {
            window.location.href = "/";
          }

          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
