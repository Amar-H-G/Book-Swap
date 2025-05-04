// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      if (res.data.success && res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate(`/${res.data.user.role}`);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err) {
      console.error('Login error:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const res = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      if (res.data.success && res.data.user) {
        // Don't login automatically after registration
        // Just show success and let user login manually
        
        return { 
          success: true, 
          message: 'Registration successful! Please login.' 
        };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      console.error('Registration error:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading,
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);