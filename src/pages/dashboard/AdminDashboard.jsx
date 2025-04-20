import { useState, useEffect } from 'react';
import { getToken } from '../../lib/auth';

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('students'); // 'students' or 'stats'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getToken();
        
        // Fetch students with marks
        const studentsResponse = await fetch('http://localhost:3000/api/admin/students/marks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!studentsResponse.ok) {
          throw new Error('Failed to fetch student data');
        }
        
        const studentsData = await studentsResponse.json();
        setStudents(studentsData);
        
        // Fetch dashboard stats
        const statsResponse = await fetch('http://localhost:3000/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!statsResponse.ok) {
          throw new Error('Failed to fetch dashboard statistics');
        }
        
        const statsData = await statsResponse.json();
        setStats(statsData);
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const renderStudentsTab = () => (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Student Marks</h2>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#155E95]"></div>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Roll Number</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Attendance (20)</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Avg Assignment (10)</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Avg RPP (5)</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Avg SPO (5)</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Total Marks</th>
            </tr>
          </thead>
          <tbody>
            {students.map((studentData) => (
              <tr key={studentData.student.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{studentData.student.rollNumber}</td>
                <td className="px-4 py-2 border-b">{studentData.student.email}</td>
                <td className="px-4 py-2 border-b">{studentData.student.attendanceMarks.toFixed(2)}</td>
                <td className="px-4 py-2 border-b">{studentData.statistics.avgAssignmentMarks.toFixed(2)}</td>
                <td className="px-4 py-2 border-b">{studentData.statistics.avgRppMarks.toFixed(2)}</td>
                <td className="px-4 py-2 border-b">{studentData.statistics.avgSpoMarks.toFixed(2)}</td>
                <td className="px-4 py-2 border-b font-semibold">{studentData.statistics.totalMarks.toFixed(2)}</td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-2 text-center text-gray-500">No student records found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderStatsTab = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dashboard Statistics</h2>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#155E95]"></div>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-medium text-[#155E95]">Students</h3>
            <p className="text-3xl font-bold mt-2">{stats.counts.students}</p>
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-medium text-[#155E95]">Assignments</h3>
            <p className="text-3xl font-bold mt-2">{stats.counts.assignments}</p>
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-medium text-[#155E95]">Avg. Attendance Marks</h3>
            <p className="text-3xl font-bold mt-2">{stats.averages.attendanceMarks.toFixed(2)}/20</p>
          </div>
          
          <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-3">
            <h3 className="text-lg font-medium text-[#155E95]">Assignment Submission Rate</h3>
            <div className="mt-2 relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                    {stats.submissions.submissionRate.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
                <div style={{ width: `${stats.submissions.submissionRate}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"></div>
              </div>
              <div className="flex justify-between text-xs">
                <span>Submitted: {stats.submissions.submitted}</span>
                <span>Pending: {stats.submissions.pending}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-500">No statistics available</div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#155E95] mb-4">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'students' ? 'text-[#155E95] border-b-2 border-[#155E95] font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('students')}
        >
          Student Marks
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'stats' ? 'text-[#155E95] border-b-2 border-[#155E95] font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'students' ? renderStudentsTab() : renderStatsTab()}
      </div>
    </div>
  );
}

export default AdminDashboard;