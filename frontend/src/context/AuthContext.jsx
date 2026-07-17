import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
  const logout = useCallback(() => { localStorage.removeItem('campusflow_token'); setUser(null); }, []);
  useEffect(() => {
    const restore = async () => { if (!localStorage.getItem('campusflow_token')) return setLoading(false); try { const { data } = await api.get('/auth/me'); setUser(data.user); } catch { logout(); } finally { setLoading(false); } };
    restore(); window.addEventListener('campusflow:unauthorized', logout); return () => window.removeEventListener('campusflow:unauthorized', logout);
  }, [logout]);
  const authenticate = async (path, values) => { const { data } = await api.post(path, values); localStorage.setItem('campusflow_token', data.token); setUser(data.user); return data.user; };
  const value = useMemo(() => ({ user, loading, login: (v) => authenticate('/auth/login', v), register: (v) => authenticate('/auth/register', v), logout, setUser }), [user, loading, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
