import axios from 'axios';
import { getCurrentUser } from '../lib/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const studentApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
studentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get current student profile
export const getCurrentStudent = async () => {
  try {
    console.log("Making API request to /students/dashboard");
    const response = await studentApi.get('/students/dashboard');
    console.log("API response:", response.data);

    // The response is already in the correct format, no need to check for success
    return response.data;
  } catch (error) {
    console.error('Error fetching student data:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || 'Failed to fetch student data');
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      throw new Error('No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request setup error:", error.message);
      throw new Error('Error setting up request');
    }
  }
};

// Get student's batch details
export const getStudentBatch = async () => {
  try {
    const response = await studentApi.get('/students/batch');
    console.log('Student batch response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching student batch:', error);
    throw error;
  }
};

// Get student's assessments
export const getStudentAssessments = async () => {
  try {
    const user = getCurrentUser();
    if (!user || !user.rollNumber) {
      throw new Error('Student roll number not found');
    }
    const response = await studentApi.get(`/assessments/student/${user.rollNumber}`);
    console.log('Student assessments response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching student assessments:', error);
    throw error;
  }
};

// Get student's attendance
export const getStudentAttendance = async () => {
  try {
    const response = await studentApi.get('/students/attendance');
    console.log('Student attendance response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    throw error;
  }
};

// Get student's performance summary
export const getStudentPerformance = async () => {
  try {
    const response = await studentApi.get('/students/performance');
    console.log('Student performance response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching student performance:', error);
    throw error;
  }
}; 