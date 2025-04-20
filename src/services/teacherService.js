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

// Get current teacher's profile
export const getCurrentTeacher = async () => {
  try {
    console.log('Fetching current teacher profile from:', `${API_URL}/teachers/me`);
    const response = await axiosInstance.get(`${API_URL}/teachers/me`);
    console.log('Current teacher profile fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching current teacher profile:', error);
    throw error;
  }
};

// Get current teacher's batches
export const getCurrentTeacherBatches = async () => {
  try {
    console.log('🔍 Fetching current teacher batches...');
    const token = localStorage.getItem('token');
    console.log('🔑 Token available:', !!token);
    
    // Fetch the teacher's batches directly from the /batches endpoint
    const response = await axiosInstance.get(`${API_URL}/teachers/batches`);
    console.log('📦 Raw response:', response);
    console.log('📦 Response data:', response.data);
    console.log('📦 Response data type:', typeof response.data);
    console.log('📦 Is response.data array?', Array.isArray(response.data));

    // The response data is already in the correct format
    const batches = Array.isArray(response.data) ? response.data : [];
    
    console.log('✅ Final processed batches:', batches);
    console.log('✅ Final batches length:', batches.length);
    console.log('✅ Final batches type:', typeof batches);
    console.log('✅ Final batches isArray:', Array.isArray(batches));

    return batches;
  } catch (error) {
    console.error('❌ Error fetching teacher batches:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return []; // Always return an empty array on error
  }
};

// Get batch details for current teacher
export const getBatchDetails = async (batchId) => {
  try {
    console.log(`🔍 Fetching batch details for ID: ${batchId}`);
    const response = await axiosInstance.get(`${API_URL}/teachers/batches/${batchId}`);
    console.log('📦 Raw response:', response);
    console.log('📦 Response data:', response.data);

    if (!response.data || !response.data.batch) {
      throw new Error('Invalid batch data received');
    }

    return {
      batch: response.data.batch,
      students: response.data.students || []
    };
  } catch (error) {
    console.error('❌ Error fetching batch details:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

// Get all teachers
export const getAllTeachers = async () => {
  try {
    console.log('Fetching all teachers from:', `${API_URL}/teachers`);
    const response = await axiosInstance.get(`${API_URL}/teachers`);
    console.log('Teachers fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
};

// Get a specific teacher by ID
export const getTeacherById = async (id) => {
  try {
    console.log(`Fetching teacher with ID: ${id} from:`, `${API_URL}/teachers/${id}`);
    const response = await axiosInstance.get(`${API_URL}/teachers/${id}`);
    console.log('Teacher fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher:', error);
    throw error;
  }
};

// Get teachers by department
export const getTeachersByDepartment = async (department) => {
  try {
    console.log(`Fetching teachers in department: ${department} from:`, `${API_URL}/teachers?department=${department}`);
    const response = await axiosInstance.get(`${API_URL}/teachers?department=${department}`);
    console.log('Teachers fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching teachers by department:', error);
    throw error;
  }
};

// Create a new teacher
export const createTeacher = async (teacherData) => {
  try {
    console.log('Creating teacher with data:', teacherData);
    const response = await axiosInstance.post(`${API_URL}/teachers`, teacherData);
    console.log('Teacher created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating teacher:', error);
    throw error;
  }
};

// Update a teacher
export const updateTeacher = async (id, teacherData) => {
  try {
    console.log(`Updating teacher with ID: ${id} with data:`, teacherData);
    const response = await axiosInstance.put(`${API_URL}/teachers/${id}`, teacherData);
    console.log('Teacher updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating teacher:', error);
    throw error;
  }
};

// Delete a teacher
export const deleteTeacher = async (id) => {
  try {
    console.log(`Deleting teacher with ID: ${id}`);
    const response = await axiosInstance.delete(`${API_URL}/teachers/${id}`);
    console.log('Teacher deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting teacher:', error);
    throw error;
  }
}; 