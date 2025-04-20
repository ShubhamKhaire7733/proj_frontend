import React, { useState, useEffect } from 'react';
import { Card } from "../ui";
import { User, GraduationCap, Award, BookOpen, Calendar, Clock, Mail, Hash, Building2, Users, CheckCircle } from "lucide-react";
import { getCurrentStudent } from '../../services/studentService';
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        console.log('Fetching student data...');
        const response = await getCurrentStudent();
        console.log('Response:', response);
        
        if (response) {
          setStudent(response);
          setError(null);
        } else {
          setError('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError(err.message || 'Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No student data available
      </div>
    );
  }

  const completionPercentage = (student.summary?.completedAssessments / student.summary?.totalAssessments) * 100;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Student Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Student Profile Card */}
        <Card className="p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 transition-transform duration-300 hover:rotate-12">
              <User className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Student Profile</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 group">
              <Hash className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Roll No: {student.profile.rollNumber}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <User className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Name: {student.profile.name}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <Mail className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Email: {student.profile.email}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <Building2 className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Department: {student.profile.department}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <GraduationCap className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Year: {student.profile.year}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <Users className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Division: {student.profile.division}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <Calendar className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Attendance: {student.profile.attendanceMarks} marks</span>
            </div>
          </div>
        </Card>

        {/* Summary Card - Now Clickable */}
        <Card 
          className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br from-white to-purple-50 border-t-4 border-t-purple-500 cursor-pointer"
          onClick={() => navigate('/student/assessments')}
        >
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 transition-transform duration-300 hover:rotate-12">
                <BookOpen className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Assessment Progress</span>
                <span className="text-sm font-medium text-purple-600">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 group hover:bg-purple-100 transition-colors duration-300">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Total Assessments</span>
                </div>
                <span className="font-semibold text-purple-600 group-hover:text-purple-700 transition-colors duration-300">{student.summary?.totalAssessments || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 group hover:bg-purple-100 transition-colors duration-300">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Completed Assessments</span>
                </div>
                <span className="font-semibold text-purple-600 group-hover:text-purple-700 transition-colors duration-300">{student.summary?.completedAssessments || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 group hover:bg-purple-100 transition-colors duration-300">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Total Attendance</span>
                </div>
                <span className="font-semibold text-purple-600 group-hover:text-purple-700 transition-colors duration-300">{student.summary?.totalAttendance || 0}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Unit Test Marks Card */}
        <Card className="p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600 transition-transform duration-300 hover:rotate-12">
              <Award className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Unit Test Marks</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 group hover:bg-orange-100 transition-colors duration-300">
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Unit Test 1</span>
              <span className="font-semibold text-orange-600 group-hover:text-orange-700 transition-colors duration-300">{student.unitTests?.unitTest1 || 0}/30</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 group hover:bg-orange-100 transition-colors duration-300">
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Unit Test 2</span>
              <span className="font-semibold text-orange-600 group-hover:text-orange-700 transition-colors duration-300">{student.unitTests?.unitTest2 || 0}/30</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 group hover:bg-orange-100 transition-colors duration-300">
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Unit Test 3</span>
              <span className="font-semibold text-orange-600 group-hover:text-orange-700 transition-colors duration-300">{student.unitTests?.unitTest3 || 0}/30</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard; 