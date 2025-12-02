import { createContext, useContext, useState, useEffect } from 'react';
import { getUserFromToken } from '../utils/auth';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserFromToken();
      setUser(userData);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const userData = await getUserFromToken();
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    api.defaults.headers.Authorization = '';
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
