import axios from "axios";
import { getAuthData } from "../utils/auth";

const api = axios.create({
  baseURL: "http://localhost:9001/rentrova/api",
});

// Public APIs (token nahi bhejna)
const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/send/otp",
  "/verify/user",
];

api.interceptors.request.use((config) => {
  const auth = getAuthData();
  const token = auth?.token;
  const isPublicRoute = publicRoutes.some((route) =>
    config.url?.includes(route),
  );

  // sirf protected APIs me token bhejo
  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle expired token
api.interceptors.response.use(
  (res) => res,

  (err) => {
    if (err.response?.status === 401) {
      console.error("Unauthorized:", err.response);

      // optional auto logout
      // localStorage.removeItem("token");
      // window.location.href="/login";
    }

    return Promise.reject(err);
  },
);

export default api;
