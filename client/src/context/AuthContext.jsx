import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gv_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Auth error:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, role) => {
    const res = await api.post('/auth/login', { email, password, role });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('gv_token', newToken);
    setToken(newToken);
    setUser({ ...userData, role });
    return userData;
  };

  const registerCustomer = async (data) => {
    const res = await api.post('/auth/register/customer', data);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('gv_token', newToken);
    setToken(newToken);
    setUser({ ...userData, role: 'customer' });
    return userData;
  };

  const registerAgent = async (data) => {
    const res = await api.post('/auth/register/agent', data);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('gv_token', newToken);
    setToken(newToken);
    setUser({ ...userData, role: 'agent' });
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('gv_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, registerCustomer, registerAgent, logout,
      isAuthenticated: !!user,
      isCustomer: user?.role === 'customer',
      isAgent: user?.role === 'agent'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
