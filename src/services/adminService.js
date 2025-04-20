import axios from 'axios';

// Configure axios with auth token and timeout
const axiosInstance = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Configure axios with auth token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error (no response):', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Get all teachers (admin only)
export const getAllTeachers = async () => {
  try {
    console.log('Fetching all teachers from:', `${API_URL}/admin/teachers`);
    const response = await axiosInstance.get(`${API_URL}/admin/teachers`);
    console.log('Teachers fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
};

// Get a specific teacher by ID (admin only)
export const getTeacherById = async (id) => {
  try {
    console.log(`Fetching teacher with ID: ${id} from:`, `${API_URL}/admin/teachers/${id}`);
    const response = await axiosInstance.get(`${API_URL}/admin/teachers/${id}`);
    console.log('Teacher fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher:', error);
    throw error;
  }
};

// Create a new teacher (admin only)
export const createTeacher = async (teacherData) => {
  try {
    console.log('Creating teacher with data:', teacherData);
    const response = await axiosInstance.post(`${API_URL}/admin/teachers`, teacherData);
    console.log('Teacher created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating teacher:', error);
    throw error;
  }
};

// Update a teacher (admin only)
export const updateTeacher = async (id, teacherData) => {
  try {
    console.log(`Updating teacher with ID: ${id} with data:`, teacherData);
    const response = await axiosInstance.put(`${API_URL}/admin/teachers/${id}`, teacherData);
    console.log('Teacher updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating teacher:', error);
    throw error;
  }
};

// Delete a teacher (admin only)
export const deleteTeacher = async (id) => {
  try {
    console.log(`Deleting teacher with ID: ${id}`);
    const response = await axiosInstance.delete(`${API_URL}/admin/teachers/${id}`);
    console.log('Teacher deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting teacher:', error);
    throw error;
  }
};

// Get all teacher allocations
export const getTeacherAllocations = async () => {
  try {
    console.log('Fetching teacher allocations from:', `${API_URL}/admin/allocations`);
    const response = await axiosInstance.get(`${API_URL}/admin/allocations`);
    console.log('Teacher allocations fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher allocations:', error);
    throw error;
  }
};

// Create a new teacher allocation
export const createTeacherAllocation = async (allocationData) => {
  try {
    console.log('Creating teacher allocation with data:', allocationData);
    const response = await axiosInstance.post(`${API_URL}/admin/allocations`, allocationData);
    console.log('Teacher allocation created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating teacher allocation:', error);
    throw error;
  }
};

// Update a teacher allocation
export const updateTeacherAllocation = async (id, allocationData) => {
  try {
    console.log(`Updating teacher allocation with ID: ${id} with data:`, allocationData);
    const response = await axiosInstance.put(`${API_URL}/admin/allocations/${id}`, allocationData);
    console.log('Teacher allocation updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating teacher allocation:', error);
    throw error;
  }
};

// Delete a teacher allocation
export const deleteTeacherAllocation = async (id) => {
  try {
    console.log(`Deleting teacher allocation with ID: ${id}`);
    const response = await axiosInstance.delete(`${API_URL}/admin/allocations/${id}`);
    console.log('Teacher allocation deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting teacher allocation:', error);
    throw error;
  }
};

// Get all teachers
export const getTeachers = async () => {
  try {
    console.log('Fetching teachers from:', `${API_URL}/admin/teachers`);
    const response = await axiosInstance.get(`${API_URL}/admin/teachers`);
    console.log('Teachers fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
}; 