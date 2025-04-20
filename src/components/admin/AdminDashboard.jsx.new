import { useState, useEffect } from 'react';
import { getToken } from '../../lib/auth';
import BatchManagement from './BatchManagement';
import SubjectManagement from './SubjectManagement';
import TeacherAllocation from './TeacherAllocation';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [file, setFile] = useState(null);
  const [uploadType, setUploadType] = useState('students');
  const [uploadStatus, setUploadStatus] = useState({ loading: false, message: '', error: '' });
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  const [stats, setStats] = useState({
    counts: {
      students: 0,
      teachers: 0,
      batches: 0
    }
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setDashboardLoading(true);
      setDashboardError(null);
      
      const token = getToken();
      console.log('Token:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        console.error('No authentication token found');
        setDashboardError('No authentication token found. Please log in again.');
        setDashboardLoading(false);
        return;
      }
      
      console.log('Fetching dashboard stats from:', 'http://localhost:3000/api/admin/dashboard');
      
      const response = await fetch('http://localhost:3000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`Failed to fetch dashboard stats: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Dashboard stats data:', data);
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setDashboardError(err.message);
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setUploadStatus({
        loading: false,
        message: '',
        error: 'Please select a file to upload'
      });
      return;
    }
    
    try {
      setUploadStatus({
        loading: true,
        message: '',
        error: ''
      });
      
      const token = getToken();
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`http://localhost:3000/api/admin/upload/${uploadType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to upload ${uploadType} data`);
      }
      
      setUploadStatus({
        loading: false,
        message: `Successfully uploaded ${uploadType} data`,
        error: ''
      });
      
      // Reset file input
      setFile(null);
      document.getElementById('file-upload').value = '';
      
      // Refresh dashboard stats
      fetchDashboardStats();
      
    } catch (err) {
      setUploadStatus({
        loading: false,
        message: '',
        error: err.message
      });
      console.error(`Error uploading ${uploadType} data:`, err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#155E95] mb-6">Admin Dashboard</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-[#155E95] text-[#155E95]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-[#155E95] text-[#155E95]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Data Upload
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'batch'
                  ? 'border-[#155E95] text-[#155E95]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Batch Management
            </button>
            <button
              onClick={() => setActiveTab('subject')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subject'
                  ? 'border-[#155E95] text-[#155E95]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Subject Management
            </button>
            <button
              onClick={() => setActiveTab('allocation')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'allocation'
                  ? 'border-[#155E95] text-[#155E95]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Teacher Allocation
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'dashboard' && (
        <div>
          {dashboardLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#155E95]"></div>
              <p className="ml-3 text-gray-600">Loading dashboard data...</p>
            </div>
          ) : dashboardError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-red-700">Error Loading Dashboard</h3>
                <p className="text-red-600">{dashboardError}</p>
                <button 
                  onClick={fetchDashboardStats}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded hover:bg-red-100"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Students</h3>
                <p className="text-3xl font-bold text-[#155E95]">{stats.counts.students}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Teachers</h3>
                <p className="text-3xl font-bold text-[#155E95]">{stats.counts.teachers}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Batches</h3>
                <p className="text-3xl font-bold text-[#155E95]">{stats.counts.batches}</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'upload' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Data Upload</h2>
          
          <form onSubmit={handleUpload} className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Type</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#155E95] focus:border-[#155E95]"
              >
                <option value="students">Students</option>
                <option value="teachers">Teachers</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">CSV File</label>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#155E95] focus:border-[#155E95]"
              />
              <p className="mt-1 text-sm text-gray-500">
                {uploadType === 'students' 
                  ? 'Upload a CSV file with columns: name, email, rollNumber, year, division' 
                  : 'Upload a CSV file with columns: name, email, department, subjects (JSON array), phone (optional)'}
              </p>
            </div>
            
            <button
              type="submit"
              disabled={uploadStatus.loading}
              className="bg-[#155E95] text-white px-4 py-2 rounded hover:bg-[#0d4a7a] transition-colors disabled:opacity-50"
            >
              {uploadStatus.loading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
          
          {uploadStatus.message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {uploadStatus.message}
            </div>
          )}
          
          {uploadStatus.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {uploadStatus.error}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'batch' && <BatchManagement />}
      {activeTab === 'subject' && <SubjectManagement />}
      {activeTab === 'allocation' && <TeacherAllocation />}
    </div>
  );
}

export default AdminDashboard; 