import { jwtDecode } from 'jwt-decode';

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    return jwtDecode(token);
  } catch {
    removeToken();
    return null;
  }
};

export const logout = () => {
  removeToken();
  // Clear any other user-related data from localStorage if needed
  localStorage.clear();
};