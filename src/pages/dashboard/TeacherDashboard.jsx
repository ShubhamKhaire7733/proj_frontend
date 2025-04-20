import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentTeacher, getCurrentTeacherBatches } from '../../services/teacherService';

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching current teacher profile');
        const teacherData = await getCurrentTeacher();
        console.log('Loaded teacher details:', teacherData);
        setTeacher(teacherData);
        
        console.log('Fetching teacher batches');
        const batchesData = await getCurrentTeacherBatches();
        console.log('Loaded batches:', batchesData);
        
        // Ensure batches is always an array
        if (Array.isArray(batchesData)) {
          setBatches(batchesData);
        } else {
          console.warn('Batches data is not an array:', batchesData);
          setBatches([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBatchClick = (batch) => {
    if (batch && batch.id) {
      navigate(`/teacher/batch/${batch.id}`, { 
        state: { 
          batchId: batch.id,
          batchName: batch.name,
          year: batch.year,
          division: batch.division,
          subjectName: batch.subjectName,
          subjectCode: batch.subjectCode,
          day: batch.day,
          time: batch.time
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-red-700">Error Loading Dashboard</h3>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-red-300 text-red-700 rounded hover:bg-red-100"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">No Teacher Data Found</h3>
            <p className="text-gray-500">Please contact support if this is an error.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        
        {/* Teacher Profile Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Profile Information</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
              <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
                {teacher.name?.charAt(0) || 'T'}
              </div>
              <div className="space-y-3">
                <div>
                  <h2 className="text-2xl font-semibold">{teacher.name}</h2>
                  <p className="text-gray-500">Teacher ID: {teacher.id || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{teacher.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mobile Number</p>
                    <p className="font-medium">{teacher.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{teacher.department || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Active
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Batches Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Assigned Batches</h2>
          </div>
          <div className="p-6">
            {batches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {batches.map((batch) => (
                  <div 
                    key={batch.id} 
                    className="border rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                    onClick={() => handleBatchClick(batch)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium">{batch.name}</h3>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {batch.year}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Division:</span> {batch.division}</p>
                      <p><span className="font-medium">Subject:</span> {batch.subjectName || 'Not assigned'}</p>
                      <p><span className="font-medium">Schedule:</span> {batch.day} at {batch.time}</p>
                      <p><span className="font-medium">Duration:</span> {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No batches assigned yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;