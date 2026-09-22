import axios from "axios";

import { ENDPOINTS } from "@/api/endpoints";
import { getTokens, setTokens, clearTokens } from "@/utils/tokenStorage";

const axiosClient = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const { access } = getTokens();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

let refreshPromise = null;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // Don't try to refresh on the refresh/login endpoints themselves —
    // that would loop forever if the refresh token is also invalid.
    const isAuthEndpoint = original?.url?.includes("/auth/");

    if (status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      const { refresh } = getTokens();
      if (!refresh) {
        clearTokens();
        return Promise.reject(error);
      }

      try {
        // Multiple simultaneous 401s should trigger exactly one refresh call.
        refreshPromise =
          refreshPromise ||
          axios.post(ENDPOINTS.auth.refresh, { refresh }).finally(() => {
            refreshPromise = null;
          });
        const { data } = await refreshPromise;
        setTokens({ access: data.data.access, refresh });
        original.headers.Authorization = `Bearer ${data.data.access}`;
        return axiosClient(original);
      } catch (refreshError) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
