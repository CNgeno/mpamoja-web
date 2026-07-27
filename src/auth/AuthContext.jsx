import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, tokenStore } from '../api/client';

const AuthContext = createContext(null);

/** Decode a JWT payload without a library (no verification — display only). */
function decodeJwt(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload));
  } catch { return null; }
}

function userFromToken(token) {
  const c = token ? decodeJwt(token) : null;
  if (!c) return null;
  return {
    id: c.sub,
    name: c['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || c.name || c.unique_name,
    role: c['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || c.role,
    phoneVerified: c.phone_verified === 'true',
    kyc: c.kyc,
    exp: c.exp,
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStore.get());
  const [user, setUser] = useState(() => userFromToken(tokenStore.get()));

  // Auto-logout when the token expires.
  useEffect(() => {
    if (!user?.exp) return;
    const ms = user.exp * 1000 - Date.now();
    if (ms <= 0) { logout(); return; }
    const t = setTimeout(logout, ms);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.exp]);

  function applyToken(t) {
    tokenStore.set(t);
    setToken(t);
    setUser(userFromToken(t));
  }

  function logout() {
    tokenStore.clear();
    setToken(null);
    setUser(null);
  }

  async function login(emailOrPhone, password) {
    const res = await authApi.login(emailOrPhone, password);
    applyToken(res.token);
    return res;
  }

  async function completeVerification(phone, code) {
    const res = await authApi.verify(phone, code);
    applyToken(res.token);
    return res;
  }

  const value = useMemo(() => ({
    token, user, isAuthenticated: !!token,
    login, logout, completeVerification, applyToken,
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
