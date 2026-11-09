import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Axios interceptor:", error.response?.status);

    if (error.response?.status === 401) {
      window.location.href = `/logIn?redirect=${encodeURIComponent(
        window.location.pathname,
      )}`;
    }

    return Promise.reject(error);
  },
);
export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
