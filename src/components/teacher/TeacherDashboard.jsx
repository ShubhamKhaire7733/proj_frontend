import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentTeacher, getCurrentTeacherBatches } from '../../services/teacherService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { cn } from '../../lib/utils';

const BatchCard = ({ batch, onClick }) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg",
        "border border-gray-200 hover:border-blue-500"
      )}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          {batch.name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {batch.division} • {batch.academicYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Subject:</span>
            <span className="ml-2">{batch.subject?.name || 'Not assigned'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Schedule:</span>
            <span className="ml-2">{batch.day} • {batch.time}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TeacherDashboard = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current teacher
        const teacherData = await getCurrentTeacher();
        setTeacher(teacherData);

        // Fetch teacher's batches
        const batchesData = await getCurrentTeacherBatches();
        console.log('Fetched batches:', batchesData);
        
        if (Array.isArray(batchesData)) {
          setBatches(batchesData);
        } else {
          console.error('Batches data is not an array:', batchesData);
          setBatches([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data');
        setBatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBatchClick = (batch) => {
    if (batch && batch.id) {
      navigate(`/teacher/batches/${batch.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Teacher Profile</CardTitle>
            <CardDescription>Your teaching information and assigned batches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900">Name</h3>
                <p className="text-gray-600">{teacher?.name || 'Not available'}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Department</h3>
                <p className="text-gray-600">{teacher?.department || 'Not available'}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="text-gray-600">{teacher?.email || 'Not available'}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Phone</h3>
                <p className="text-gray-600">{teacher?.phone || 'Not available'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Batches</h2>
        <p className="text-gray-600">Click on a batch to view its details and manage attendance</p>
      </div>

      {batches.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-gray-600">No batches assigned yet.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              onClick={() => handleBatchClick(batch)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard; 