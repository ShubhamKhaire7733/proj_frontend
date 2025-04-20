import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, ClipboardList, Calendar, ArrowLeft, UserCircle, ClipboardCheck } from 'lucide-react';
import StudentAssessmentDialog from '../../components/dialog/StudentAssessmentDialog';

function SE() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  // This would come from an API in production
  const batchInfo = {
    id: 'A1',
    name: 'Batch A1',
    subject: 'Data Structures Laboratory',
    teacherName: 'Jyoti Jadhav',
    labCoordinator: 'Sheetal Patil',
    academicYear: '2023-2024',
    semester: 'II',
    schedule: 'Monday, Wednesday (10:30 AM - 12:30 PM)',
    students: [
      { rollNo: '33101', name: 'Sandesh Nakkawar', attendance: 85 },
      { rollNo: '33102', name: 'Adwait Borate', attendance: 90 },
      { rollNo: '33103', name: 'Shubham Khaire', attendance: 88 },
      { rollNo: '33104', name: 'Sairaj Bodhale', attendance: 92 },
      { rollNo: '33105', name: 'Shreyash Ingle', attendance: 95 },
      { rollNo: '33106', name: 'Himanshu Sabale', attendance: 87 },
    ]
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#155E95] hover:text-[#0f4a75] mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-[#155E95] px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white bg-opacity-10 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    PUNE INSTITUTE OF COMPUTER TECHNOLOGY
                  </h1>
                  <p className="text-[#155E95]-100">Record of Continuous Term work Assessment</p>
                </div>
              </div>
              <div className="text-white text-right">
                <p className="text-sm opacity-80">Academic Year</p>
                <p className="font-semibold">{batchInfo.academicYear}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-[#155E95] mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Batch</p>
                  <p className="font-medium text-gray-900">{batchInfo.name}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ClipboardList className="w-5 h-5 text-[#155E95] mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium text-gray-900">{batchInfo.subject}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-[#155E95] mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Schedule</p>
                  <p className="font-medium text-gray-900">{batchInfo.schedule}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <UserCircle className="w-5 h-5 text-[#155E95] mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Teacher Name</p>
                  <p className="font-medium text-gray-900">{batchInfo.teacherName}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <UserCircle className="w-5 h-5 text-[#155E95] mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Lab Coordinator</p>
                  <p className="font-medium text-gray-900">{batchInfo.labCoordinator}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => navigate(`/teacher/batch/${batchInfo.id}/attendance`)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#155E95] hover:bg-[#0f4a75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#155E95]"
              >
                <ClipboardCheck className="w-5 h-5 mr-2" />
                Lab Attendance
              </button>
            </div>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batchInfo.students.map((student) => (
            <button
              key={student.rollNo}
              onClick={() => handleStudentClick(student)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="border-b border-gray-100 p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Roll No.</span>
                  <span className="px-3 py-1 bg-[#155E95] bg-opacity-10 text-[#155E95] rounded-full text-sm">
                    {student.attendance}% Attendance
                  </span>
                </div>
                <div className="text-lg font-semibold text-gray-900">{student.rollNo}</div>
              </div>
              <div className="p-4 bg-gray-50 group-hover:bg-[#155E95] group-hover:text-white transition-colors duration-300">
                <div className="text-lg font-medium">{student.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Student Assessment Dialog */}
      <StudentAssessmentDialog
        isOpen={selectedStudent !== null}
        onClose={() => setSelectedStudent(null)}
        student={selectedStudent}
      />
    </div>
  );
}

export default SE; 