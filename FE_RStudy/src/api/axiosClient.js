import axios from 'axios';
import { tokenStorage } from '../utils/tokenStorage';

export const AUTH_LOGOUT_EVENT = 'auth:logout';

const baseURL = import.meta.env.VITE_API_URL;
const NO_REFRESH_URLS = ['/auth/login', '/auth/refresh'];

const axiosClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

let refreshPromise = null;

const refreshTokens = () => {
  if (!refreshPromise) {
    const sent = tokenStorage.getRefresh();
    refreshPromise = axios
      .post(`${baseURL}/auth/refresh`, { refreshToken: sent })
      .then((res) => {
        const { accessToken, refreshToken } = res.data.data;
        tokenStorage.set(accessToken, refreshToken);
        return accessToken;
      })
      .catch((err) => {
        // Tab khác đã refresh xong trước (token trong localStorage đã đổi): dùng token mới, không đăng xuất
        if (tokenStorage.getRefresh() !== sent && tokenStorage.getAccess()) return tokenStorage.getAccess();
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

axiosClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccess();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const original = error.config;
    const isNoRefreshUrl = NO_REFRESH_URLS.some((url) => original?.url?.startsWith(url));

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isNoRefreshUrl &&
      tokenStorage.getRefresh()
    ) {
      original._retry = true;
      try {
        const accessToken = await refreshTokens();
        original.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(original);
      } catch {
        tokenStorage.clear();
        window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
      }
    }

    error.message = error.response?.data?.message || 'Không thể kết nối máy chủ';
    return Promise.reject(error);
  },
);

export default axiosClient;
