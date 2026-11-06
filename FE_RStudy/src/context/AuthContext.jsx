import { useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import { AUTH_LOGOUT_EVENT } from "../api/axiosClient";
import { tokenStorage } from "../utils/tokenStorage";
import { AuthContext } from "./authContextValue";
import { adminApi } from "../api/adminApi";
import { ROLES } from "../constants/roles";

const fetchAccount = async () => {
  const meRes = await authApi.getMe();
  const me = meRes.data;
  if (me.role !== ROLES.ADMINISTRATOR) return me;
  const adminRes = await adminApi.getMe();
  return { ...me, isLeader: adminRes.data.isLeader, permissions: adminRes.data.permissions };
};

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(tokenStorage.getRefresh()));

  useEffect(() => {
    if (!tokenStorage.getRefresh()) return undefined;
    let active = true;
    fetchAccount()
      .then((data) => {
        if (active) setAccount(data);
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
      const data = await fetchAccount();
      setAccount(data);
      return data;
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

  const updateAccount = (next) => setAccount((prev) => ({ ...prev, ...next }));
  const value = { account, loading, login, logout, updateAccount };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
