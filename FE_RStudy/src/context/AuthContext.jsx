import { useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { AUTH_LOGOUT_EVENT } from '../api/axiosClient';
import { tokenStorage } from '../utils/tokenStorage';
import { AuthContext } from './authContextValue';

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(tokenStorage.getRefresh()));

  useEffect(() => {
    if (!tokenStorage.getRefresh()) return undefined;
    let active = true;
    authApi
      .getMe()
      .then((res) => {
        if (active) setAccount(res.data);
      })
      .catch(() => {
        tokenStorage.clear();
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleLogout = () => setAccount(null);
    window.addEventListener(AUTH_LOGOUT_EVENT, handleLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogout);
  }, []);

  const login = async (credentials) => {
    const loginRes = await authApi.login(credentials);
    tokenStorage.set(loginRes.data.accessToken, loginRes.data.refreshToken);
    try {
      const meRes = await authApi.getMe();
      setAccount(meRes.data);
      return meRes.data;
    } catch (error) {
      tokenStorage.clear();
      throw error;
    }
  };

  const logout = async () => {
    const refreshToken = tokenStorage.getRefresh();
    if (refreshToken) await authApi.logout(refreshToken).catch(() => null);
    tokenStorage.clear();
    setAccount(null);
  };

  const value = { account, loading, login, logout, updateAccount: setAccount };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
