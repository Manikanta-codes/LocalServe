import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('localserve_token');
    const storedUser = localStorage.getItem('localserve_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const data = response.data.data;
    
    const jwtToken = data.token;
    const userObj = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
    };

    localStorage.setItem('localserve_token', jwtToken);
    localStorage.setItem('localserve_user', JSON.stringify(userObj));

    setToken(jwtToken);
    setUser(userObj);

    return userObj;
  };

  const register = async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('localserve_token');
    localStorage.removeItem('localserve_user');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('localserve_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'ADMIN',
        isProvider: user?.role === 'PROVIDER',
        isCustomer: user?.role === 'CUSTOMER',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
