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

// Get all batches
export const getBatches = async () => {
  try {
    console.log('Fetching batches from:', `${API_URL}/admin/batches`);
    const response = await api.get('/admin/batches');
    console.log('Batches fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching batches:', error);
    throw error;
  }
};

// Get a specific batch by ID
export const getBatchById = async (id) => {
  try {
    console.log(`Fetching batch with ID: ${id}`);
    const response = await api.get(`/admin/batches/${id}`);
    console.log('Batch fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching batch:', error);
    throw error;
  }
};

// Create a new batch
export const createBatch = async (batchData) => {
  try {
    console.log('Creating batch with data:', batchData);
    const response = await api.post('/admin/batches', batchData);
    console.log('Batch created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating batch:', error);
    throw error;
  }
};

// Update a batch
export const updateBatch = async (id, batchData) => {
  try {
    console.log(`Updating batch with ID: ${id}`);
    const response = await api.put(`/admin/batches/${id}`, batchData);
    console.log('Batch updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating batch:', error);
    throw error;
  }
};

// Delete a batch
export const deleteBatch = async (id) => {
  try {
    console.log(`Deleting batch with ID: ${id}`);
    const response = await api.delete(`/admin/batches/${id}`);
    console.log('Batch deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting batch:', error);
    throw error;
  }
};

export const getTeacherBatches = async () => {
  try {
    const response = await api.get('/teachers/batches');
    return response;
  } catch (error) {
    console.error('Error fetching teacher batches:', error);
    throw error;
  }
};

export const getBatchDetails = async (batchId) => {
  try {
    const response = await api.get(`/teachers/batches/${batchId}`);
    return response;
  } catch (error) {
    console.error('Error fetching batch details:', error);
    throw error;
  }
};

export const getBatchStudents = async (batchId) => {
  try {
    const response = await api.get(`/batches/${batchId}/students`);
    return response;
  } catch (error) {
    console.error('Error fetching batch students:', error);
    throw error;
  }
};

export const getBatchAssignments = async (batchId) => {
  try {
    const response = await api.get(`/batches/${batchId}/assignments`);
    return response;
  } catch (error) {
    console.error('Error fetching batch assignments:', error);
    throw error;
  }
};

export const getBatchAttendance = async (batchId) => {
  try {
    const response = await api.get(`/batches/${batchId}/attendance`);
    return response;
  } catch (error) {
    console.error('Error fetching batch attendance:', error);
    throw error;
  }
}; 