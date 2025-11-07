import { createContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, loginRequest, registerRequest } from '../services/authService.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => window.localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(!!token);
  const navigate = useNavigate();

  const normaliseUser = useCallback((rawUser) => {
    if (!rawUser) return null;
    return {
      ...rawUser,
      id: rawUser.id || rawUser._id
    };
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getProfile(token);
        setUser(normaliseUser(profile.user));
      } catch (error) {
        window.localStorage.removeItem('token');
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token, normaliseUser]);

  const setSession = useCallback((authToken, authUser) => {
    setToken(authToken);
    setUser(normaliseUser(authUser));
    window.localStorage.setItem('token', authToken);
  }, [normaliseUser]);

  const login = async (credentials) => {
    const { token: authToken, user: authUser } = await loginRequest(credentials);
    setSession(authToken, authUser);
    navigate('/dashboard');
  };

  const register = async (payload) => {
    const { token: authToken, user: authUser } = await registerRequest(payload);
    setSession(authToken, authUser);
    navigate('/dashboard');
  };

  const logout = () => {
    window.localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    navigate('/');
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

