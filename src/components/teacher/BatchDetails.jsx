import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBatchDetails } from '../../services/teacherService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, UserCircle } from 'lucide-react';
import StudentAssessmentDialog from '../dialog/StudentAssessmentDialog';

const StudentCard = ({ student, onClick }) => {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => onClick(student)}
    >
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <UserCircle className="h-10 w-10 text-[#155E95]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {student.name || 'Student Name'}
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            Roll No: {student.rollNumber}
          </p>
          <p className="text-sm text-gray-500">
            {student.email}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const BatchDetails = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        console.log('🔍 Fetching batch details for ID:', batchId);
        setLoading(true);
        const data = await getBatchDetails(batchId);
        console.log('📦 Received batch details:', data);
        
        if (!data || !data.batch) {
          throw new Error('Invalid batch data received');
        }

        setBatch(data.batch);
        setStudents(data.students || []);
      } catch (err) {
        console.error('❌ Error fetching batch details:', err);
        setError(err.message || 'Failed to fetch batch details');
      } finally {
        setLoading(false);
      }
    };

    fetchBatchDetails();
  }, [batchId]);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setIsAssessmentDialogOpen(true);
  };

  const handleCloseAssessmentDialog = () => {
    setIsAssessmentDialogOpen(false);
    setSelectedStudent(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#155E95]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {batch?.name || 'Batch Details'}
        </h1>
        <Button onClick={() => navigate(-1)}>Back to Dashboard</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Batch Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-medium">{batch?.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Division</p>
              <p className="font-medium">{batch?.division}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Schedule</p>
              <p className="font-medium">{batch?.day} at {batch?.time}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Enrolled Students ({students.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {students
                .sort((a, b) => a.rollNumber - b.rollNumber)
                .map((student) => (
                  <StudentCard 
                    key={student.id} 
                    student={student} 
                    onClick={handleStudentClick}
                  />
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No students enrolled in this batch.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedStudent && (
        <StudentAssessmentDialog
          isOpen={isAssessmentDialogOpen}
          onClose={handleCloseAssessmentDialog}
          student={selectedStudent}
        />
      )}
    </div>
  );
};

export default BatchDetails; 