import React, { useState, useEffect } from 'react';
import { Card } from "../ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ArrowLeft, BookOpen, AlertCircle, GraduationCap } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { getCurrentStudent } from '../../services/studentService';
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const AssessmentDetails = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        console.log("Fetching assessment details...");
        const response = await getCurrentStudent();
        console.log("Assessment details response:", response);
        
        if (response && response.profile) {
          setStudent(response);
          setError(null);
        } else {
          setError('Failed to fetch assessment data');
          toast.error('Failed to fetch assessment data');
        }
      } catch (err) {
        console.error("Error fetching assessment details:", err);
        setError(err.message || 'Error fetching assessment data');
        toast.error(err.message || 'Error fetching assessment data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-500 animate-pulse">Loading assessment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="p-6 bg-red-50 rounded-full mb-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-red-500 max-w-md text-center">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Create dummy data for testing - replace with actual data later
  const assessmentRecords = student.assessments || Array.from({ length: student.summary?.totalAssessments || 0 }, (_, i) => ({
    assignNo: i + 1,
    performanceDate: new Date(2024, 0, 15 + (i * 7)).toLocaleDateString(),
    submissionDate: new Date(2024, 0, 20 + (i * 7)).toLocaleDateString(),
    rppMarks: "4/5",
    spoMarks: "4/5",
    assignmentMarks: `${7 + (i % 4)}/10`,
    status: "Completed"
  }));

  // Calculate final assessment values
  const calculateProportionateMarks = () => {
    const totalAssignmentMarks = assessmentRecords.reduce((sum, record) => {
      const marks = parseInt(record.assignmentMarks.split('/')[0]);
      return sum + marks;
    }, 0);
    return Math.round((totalAssignmentMarks / (assessmentRecords.length * 10)) * 60);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => navigate('/student/dashboard')}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Assessment Records
          </h1>
          <p className="text-gray-500">View your detailed assessment records</p>
        </div>
      </div>

      {/* Subject Information Card */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-800">{student.profile.subject || "Data Structures Laboratory"}</h2>
          </div>
          <div className="flex gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Subject:</span>
              <span>{student.profile.subjectName || "Data Structures"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Semester:</span>
              <span>{student.profile.semester || "3rd"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Academic Year:</span>
              <span>{student.profile.academicYear || "2023-24"}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Assignment Records Table */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Assignment Records
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="font-semibold">Assign. No.</TableHead>
                  <TableHead className="font-semibold">Performance Date</TableHead>
                  <TableHead className="font-semibold">Submission Date</TableHead>
                  <TableHead className="font-semibold">RPP Marks (5)</TableHead>
                  <TableHead className="font-semibold">SPO Marks (5)</TableHead>
                  <TableHead className="font-semibold">Assignment Marks (10)</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessmentRecords.map((record, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell>{record.assignNo}</TableCell>
                    <TableCell>{record.performanceDate}</TableCell>
                    <TableCell>{record.submissionDate}</TableCell>
                    <TableCell>{record.rppMarks}</TableCell>
                    <TableCell>{record.spoMarks}</TableCell>
                    <TableCell>{record.assignmentMarks}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {record.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Final Assessment Section */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Final Assessment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-blue-50">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Proportionate Assignment marks out of 60(A)
              </h3>
              <p className="text-4xl font-bold text-blue-600">{calculateProportionateMarks()}</p>
            </div>
            
            <div className="p-6 rounded-lg bg-purple-50">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Test marks out of 20(B)
              </h3>
              <p className="text-4xl font-bold text-purple-600">15</p>
            </div>
            
            <div className="p-6 rounded-lg bg-green-50">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Theory Attendance marks out of 20(C)
              </h3>
              <p className="text-4xl font-bold text-green-600">18</p>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">
                Final TW marks (Converted to) out of 25 or 50:
              </h3>
              <p className="text-3xl font-bold text-white">42</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AssessmentDetails; 