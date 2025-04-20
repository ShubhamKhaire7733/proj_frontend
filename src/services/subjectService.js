import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
      throw new Error('Network error - please check your connection');
    } else {
      // Other errors
      console.error('Error:', error.message);
      throw error;
    }
  }
);

// Get all subjects
export const getSubjects = async () => {
  try {
    console.log('Fetching subjects from:', `${API_URL}/admin/subjects`);
    const response = await api.get('/admin/subjects');
    console.log('Subjects fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
};

// Get a specific subject by ID
export const getSubjectById = async (id) => {
  try {
    console.log(`Fetching subject with ID: ${id}`);
    const response = await api.get(`/admin/subjects/${id}`);
    console.log('Subject fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching subject:', error);
    throw error;
  }
};

// Create a new subject
export const createSubject = async (subjectData) => {
  try {
    console.log('Creating subject with data:', subjectData);
    const response = await api.post('/admin/subjects', subjectData);
    console.log('Subject created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
};

// Update a subject
export const updateSubject = async (id, subjectData) => {
  try {
    console.log(`Updating subject with ID: ${id}`);
    const response = await api.put(`/admin/subjects/${id}`, subjectData);
    console.log('Subject updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating subject:', error);
    throw error;
  }
};

// Delete a subject
export const deleteSubject = async (id) => {
  try {
    console.log(`Deleting subject with ID: ${id}`);
    const response = await api.delete(`/admin/subjects/${id}`);
    console.log('Subject deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting subject:', error);
    throw error;
  }
}; 