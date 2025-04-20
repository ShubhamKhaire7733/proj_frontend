import axios from 'axios';

// Configure axios with auth token
axios.interceptors.request.use(
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

// Make sure this points to where your backend is actually running
const API_URL = 'http://localhost:3000/api';

// Save assessment data
export const saveAssessment = async (assessmentData) => {
  try {
    console.log(`Sending POST request to ${API_URL}/assessments`);
    const response = await axios.post(`${API_URL}/assessments`, assessmentData);
    console.log('API Response:', response);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      throw error.response.data || { message: `Server responded with status ${error.response.status}` };
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      throw { message: 'No response received from server' };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      throw { message: error.message };
    }
  }
};

// Get all assessments for a student
export const getStudentAssessments = async (studentRollNo) => {
  try {
    console.log(`Fetching student assessments for ${studentRollNo}`);
    const response = await axios.get(`${API_URL}/assessments/student/${studentRollNo}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student assessments:', error);
    if (error.response) {
      throw error.response.data || { message: `Server responded with status ${error.response.status}` };
    } else if (error.request) {
      throw { message: 'No response received from server' };
    } else {
      throw { message: error.message };
    }
  }
};

// Get all assessments for a batch
export const getBatchAssessments = async (batchId) => {
  try {
    const response = await axios.get(`${API_URL}/assessments/batch/${batchId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batch assessments:', error);
    if (error.response) {
      throw error.response.data || { message: `Server responded with status ${error.response.status}` };
    } else if (error.request) {
      throw { message: 'No response received from server' };
    } else {
      throw { message: error.message };
    }
  }
}; 