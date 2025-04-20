import { useState, useEffect } from 'react';
import { Book, CheckCircle, Clock, FileText } from 'lucide-react';
import AssignmentTable from '../../components/dashboard/AssignmentTable';
import ProgressCard from '../../components/dashboard/ProgressCard';

function StudentDashboard() {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      number: 1,
      performanceDate: '2024-01-15',
      submissionDate: '2024-01-20',
      rppMarks: 4,
      spoMarks: 4,
      assignmentMarks: 8,
      status: 'Completed'
    },
    {
      id: 2,
      number: 2,
      performanceDate: '2024-01-22',
      submissionDate: '2024-01-27',
      rppMarks: 3,
      spoMarks: 4,
      assignmentMarks: 7,
      status: 'Completed'
    },
    // Add more assignments as needed
  ]);

  const stats = {
    totalAssignments: 12,
    completedAssignments: 2,
    totalMarks: 15,
    maxMarks: 20,
    attendanceMarks: 18,
    maxAttendanceMarks: 20
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#155E95]">Term Work Assessment</h1>
        <p className="text-gray-600">AY: 2023-2024 | Semester: II</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ProgressCard
          title="Assignments Progress"
          value={stats.completedAssignments}
          total={stats.totalAssignments}
          icon={FileText}
        />
        <ProgressCard
          title="Total Marks"
          value={stats.totalMarks}
          total={stats.maxMarks}
          icon={CheckCircle}
        />
        <ProgressCard
          title="Attendance Marks"
          value={stats.attendanceMarks}
          total={stats.maxAttendanceMarks}
          icon={Clock}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#155E95] flex items-center">
            <Book className="h-5 w-5 mr-2" />
            Assignment Records
          </h2>
        </div>
        <AssignmentTable assignments={assignments} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#155E95] mb-4">Final Assessment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <p className="text-sm text-gray-600 mb-2">Proportionate Assignment marks out of 60(A)</p>
            <p className="text-2xl font-bold text-[#155E95]">45</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <p className="text-sm text-gray-600 mb-2">Test marks out of 20(B)</p>
            <p className="text-2xl font-bold text-[#155E95]">15</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <p className="text-sm text-gray-600 mb-2">Theory Attendance marks out of 20(C)</p>
            <p className="text-2xl font-bold text-[#155E95]">18</p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-[#155E95] bg-opacity-5 rounded-lg shadow-md  hover:shadow-xl transition-shadow duration-300">
          <p className="text-lg font-semibold text-[#155E95]">
            Final TW marks (Converted to) out of 25 or 50: <span className="text-2xl">42</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;