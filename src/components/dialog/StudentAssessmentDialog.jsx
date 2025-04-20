import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { saveAssessment, getStudentAssessments } from '../../services/assessmentService';
import { toast } from 'react-toastify';
import axios from 'axios';

function StudentAssessmentDialog({ isOpen, onClose, student }) {
  const [experiments, setExperiments] = useState(
    Array(12).fill().map(() => ({
      performanceDate: { scheduled: '', actual: '' },
      submissionDate: { scheduled: '', actual: '' },
      marks: { rpp: '', spo: '', assignment: '' },
      isSaved: false
    }))
  );
  const [unitTests, setUnitTests] = useState({
    test1: '',
    test2: '',
    test3: ''
  });
  const [finalAssessment, setFinalAssessment] = useState({
    proportionateAssignmentMarks: '',
    testMarks: '',
    theoryAttendanceMarks: '',
    finalMarks: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && student) {
      loadStudentAssessments();
    }
  }, [isOpen, student]);

  useEffect(() => {
    console.log('Unit test marks updated:', unitTests);
  }, [unitTests]);

  const loadStudentAssessments = async () => {
    try {
      setLoading(true);
      const response = await getStudentAssessments(student.rollNumber);
      
      console.log('Raw response from server:', response);
      
      if (response && response.data) {
        // Initialize with default experiments
        const updatedExperiments = Array(12).fill().map(() => ({
          performanceDate: { scheduled: '', actual: '' },
          submissionDate: { scheduled: '', actual: '' },
          marks: { rpp: '', spo: '', assignment: '' },
          isSaved: false
        }));
        
        // First, try to find the final assessment (experimentNo = 0)
        const finalAssessment = response.data.find(assessment => assessment.experimentNo === 0);
        if (finalAssessment) {
          console.log('Found final assessment:', finalAssessment);
          setFinalAssessment({
            proportionateAssignmentMarks: finalAssessment.finalAssignmentMarks || '',
            testMarks: finalAssessment.testMarks || '',
            theoryAttendanceMarks: finalAssessment.theoryAttendanceMarks || '',
            finalMarks: finalAssessment.finalMarks || ''
          });
          
          // Load unit test marks only from final assessment
          console.log('Setting unit test marks from final assessment:', {
            test1: finalAssessment.unitTest1Marks,
            test2: finalAssessment.unitTest2Marks,
            test3: finalAssessment.unitTest3Marks
          });
          
          setUnitTests({
            test1: finalAssessment.unitTest1Marks || null,
            test2: finalAssessment.unitTest2Marks || null,
            test3: finalAssessment.unitTest3Marks || null
          });
        }
        
        // Update experiments data
        response.data.forEach(assessment => {
          // Skip final assessment as it's already handled
          if (assessment.experimentNo === 0) {
            return;
          }

          const index = assessment.experimentNo - 1;
          if (index >= 0 && index < 12) {
            const formatDate = (dateString) => {
              if (!dateString) return '';
              const date = new Date(dateString);
              return date.toISOString().split('T')[0];
            };
            
            updatedExperiments[index] = {
              performanceDate: { 
                scheduled: formatDate(assessment.scheduledPerformanceDate), 
                actual: formatDate(assessment.actualPerformanceDate) 
              },
              submissionDate: { 
                scheduled: formatDate(assessment.scheduledSubmissionDate), 
                actual: formatDate(assessment.actualSubmissionDate) 
              },
              marks: { 
                rpp: assessment.rppMarks || '', 
                spo: assessment.spoMarks || '', 
                assignment: assessment.assignmentMarks || '' 
              },
              id: assessment.id,
              isSaved: true
            };
          }
        });
        
        setExperiments(updatedExperiments);
      }
    } catch (error) {
      setError('Error loading student assessments');
      console.error('Error loading assessments:', error);
      toast.error('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (index, field, subField, value) => {
    setExperiments(prev => {
      const newExperiments = [...prev];
      newExperiments[index] = {
        ...newExperiments[index],
        [field]: {
          ...newExperiments[index][field],
          [subField]: value
        }
      };
      return newExperiments;
    });
  };

  const handleMarksChange = (index, field, value) => {
    // Only allow integer values
    const intValue = parseInt(value);
    
    // Validate marks based on field using database model rules
    if (field === 'rpp' || field === 'spo') {
      if (intValue >= 0 && intValue <= 5) { // From Assessment model: rppMarks and spoMarks max: 5
        setExperiments(prev => {
          const newExperiments = [...prev];
          newExperiments[index] = {
            ...newExperiments[index],
            marks: {
              ...newExperiments[index].marks,
              [field]: intValue
            }
          };
          return newExperiments;
        });
        setError('');
      } else {
        setError(`${field.toUpperCase()} marks should be between 0 and 5`);
      }
    } else if (field === 'assignment') {
      if (intValue >= 0 && intValue <= 10) { // From Assessment model: assignmentMarks max: 10
        setExperiments(prev => {
          const newExperiments = [...prev];
          newExperiments[index] = {
            ...newExperiments[index],
            marks: {
              ...newExperiments[index].marks,
              [field]: intValue
            }
          };
          return newExperiments;
        });
        setError('');
      } else {
        setError('Assignment marks should be between 0 and 10');
      }
    }
  };

  const isRowComplete = (experiment) => {
    return (
      experiment.performanceDate.scheduled &&
      experiment.performanceDate.actual &&
      experiment.submissionDate.scheduled &&
      experiment.submissionDate.actual &&
      experiment.marks.rpp !== '' &&
      experiment.marks.spo !== '' &&
      experiment.marks.assignment !== ''
    );
  };

  const handleSaveRow = async (index) => {
    const experiment = experiments[index];
    
    if (isRowComplete(experiment)) {
      try {
        setLoading(true);
        setError('');
        
        // Convert empty strings to null for database
        const rppMarks = experiment.marks.rpp === '' ? null : parseInt(experiment.marks.rpp);
        const spoMarks = experiment.marks.spo === '' ? null : parseInt(experiment.marks.spo);
        const assignmentMarks = experiment.marks.assignment === '' ? null : parseInt(experiment.marks.assignment);
        
        // Validate marks before sending
        if (rppMarks !== null && (rppMarks < 0 || rppMarks > 5)) {
          throw new Error('RPP marks must be between 0 and 5');
        }
        if (spoMarks !== null && (spoMarks < 0 || spoMarks > 5)) {
          throw new Error('SPO marks must be between 0 and 5');
        }
        if (assignmentMarks !== null && (assignmentMarks < 0 || assignmentMarks > 10)) {
          throw new Error('Assignment marks must be between 0 and 10');
        }
        
        const assessmentData = {
          studentRollNo: student.rollNumber,
          experimentNo: index + 1,
          scheduledPerformanceDate: experiment.performanceDate.scheduled || null,
          actualPerformanceDate: experiment.performanceDate.actual || null,
          scheduledSubmissionDate: experiment.submissionDate.scheduled || null,
          actualSubmissionDate: experiment.submissionDate.actual || null,
          rppMarks,
          spoMarks,
          assignmentMarks,
          id: experiment.id || undefined
        };

        console.log('Saving assessment with data:', assessmentData);
        
        const response = await saveAssessment(assessmentData);
        console.log('Save assessment response:', response);
        
        if (response && response.id) {
          toast.success('Assessment saved successfully');
          // Mark this row as saved
          setExperiments(prev => {
            const newExperiments = [...prev];
            newExperiments[index] = {
              ...newExperiments[index],
              id: response.id,
              isSaved: true
            };
            return newExperiments;
          });
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        setError(`Error saving assessment: ${error.message}`);
        console.error('Save assessment error details:', error);
        toast.error(`Failed to save assessment: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please fill all fields in this row before saving');
      toast.warning('Please fill all fields in this row');
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Find all completed but unsaved rows
      const completedRows = experiments.filter(exp => isRowComplete(exp) && !exp.isSaved);
      
      if (completedRows.length > 0) {
        // Save all completed rows
        const savePromises = completedRows.map((exp, index) => {
          const rowIndex = experiments.findIndex(e => e === exp);
          
          // Convert empty strings to null for database
          const rppMarks = exp.marks.rpp === '' ? null : parseInt(exp.marks.rpp);
          const spoMarks = exp.marks.spo === '' ? null : parseInt(exp.marks.spo);
          const assignmentMarks = exp.marks.assignment === '' ? null : parseInt(exp.marks.assignment);
          
          const assessmentData = {
            studentRollNo: student.rollNumber,
            experimentNo: rowIndex + 1,
            scheduledPerformanceDate: exp.performanceDate.scheduled,
            actualPerformanceDate: exp.performanceDate.actual,
            scheduledSubmissionDate: exp.submissionDate.scheduled,
            actualSubmissionDate: exp.submissionDate.actual,
            rppMarks: rppMarks,
            spoMarks: spoMarks,
            assignmentMarks: assignmentMarks,
            id: exp.id || undefined
          };
          return saveAssessment(assessmentData);
        });

        await Promise.all(savePromises);
        toast.success('All assessments saved successfully');
        
        // Mark completed rows as saved
        setExperiments(prev => {
          const newExperiments = [...prev];
          newExperiments.forEach((exp, index) => {
            if (isRowComplete(exp) && !exp.isSaved) {
              newExperiments[index] = {
                ...newExperiments[index],
                isSaved: true
              };
            }
          });
          return newExperiments;
        });
      }
      
      onClose();
    } catch (error) {
      setError('Error saving assessments');
      console.error('Error saving assessments:', error);
      toast.error('Failed to save all assessments');
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalMarks = (assignmentMarks) => {
    // Get the unit test marks (out of 20)
    const unitTestMarks = calculateUnitTestMarks();
    
    // Sum up all marks (60 + 20 = 80)
    const totalMarksObtained = assignmentMarks + unitTestMarks;
    const maxTotalMarks = 80; // 60 + 20
    
    // Convert to out of 25
    const finalMarks = (totalMarksObtained / maxTotalMarks) * 25;
    return Math.round(finalMarks * 100) / 100; // Round to 2 decimal places
  };

  const handleFinalAssessmentChange = (field, value) => {
    const intValue = parseInt(value);
    
    // Validate marks based on database model rules
    if (field === 'proportionateAssignmentMarks' && intValue >= 0 && intValue <= 60) { // From Assessment model: finalAssignmentMarks max: 60
      setFinalAssessment(prev => ({
        ...prev,
        [field]: intValue,
        finalMarks: calculateFinalMarks(intValue)
      }));
      setError('');
    } else {
      setError('Proportionate Assignment marks should be between 0 and 60');
    }
  };

  const handleSaveFinalAssessment = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Validate that all required fields are filled
      if (!finalAssessment.proportionateAssignmentMarks) {
        throw new Error('Please fill the proportionate assignment marks');
      }

      const assignmentMarks = parseInt(finalAssessment.proportionateAssignmentMarks);
      if (assignmentMarks < 0 || assignmentMarks > 60) {
        throw new Error('Proportionate assignment marks must be between 0 and 60');
      }

      // Validate unit test marks
      if ((unitTests.test1 !== null && (unitTests.test1 < 0 || unitTests.test1 > 30)) || 
          (unitTests.test2 !== null && (unitTests.test2 < 0 || unitTests.test2 > 30)) || 
          (unitTests.test3 !== null && (unitTests.test3 < 0 || unitTests.test3 > 30))) {
        throw new Error('Unit test marks cannot exceed 30');
      }

      // Create a new assessment with experimentNo as 0 to indicate it's a final assessment
      const assessmentData = {
        studentRollNo: student.rollNumber,
        experimentNo: 0, // Use 0 to indicate this is a final assessment
        scheduledPerformanceDate: new Date().toISOString(),
        actualPerformanceDate: new Date().toISOString(),
        scheduledSubmissionDate: new Date().toISOString(),
        actualSubmissionDate: new Date().toISOString(),
        rppMarks: 0,
        spoMarks: 0,
        assignmentMarks: 0,
        finalAssignmentMarks: assignmentMarks,
        testMarks: calculateUnitTestMarks(),
        theoryAttendanceMarks: 0,
        finalMarks: parseFloat(finalAssessment.finalMarks),
        unitTest1Marks: unitTests.test1 === null ? 0 : unitTests.test1,
        unitTest2Marks: unitTests.test2 === null ? 0 : unitTests.test2,
        unitTest3Marks: unitTests.test3 === null ? 0 : unitTests.test3,
        convertedUnitTestMarks: calculateUnitTestMarks()
      };

      console.log('Saving final assessment with data:', assessmentData);
      
      const response = await saveAssessment(assessmentData);
      console.log('Save final assessment response:', response);
      
      if (response && response.id) {
        toast.success('Final assessment saved successfully');
        setError('');
      } else {
        throw new Error('Failed to save final assessment');
      }
    } catch (error) {
      setError(`Error saving final assessment: ${error.message}`);
      console.error('Save final assessment error:', error);
      toast.error(`Failed to save final assessment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUnitTestChange = (testNumber, value) => {
    // Convert to integer, but allow empty string for clearing
    const intValue = value === '' ? null : parseInt(value);
    
    // Validate marks based on database model rules
    if (intValue === null || (intValue >= 0 && intValue <= 30)) { // From Assessment model: unitTest1Marks, unitTest2Marks, unitTest3Marks max: 30
      setUnitTests(prev => {
        const newTests = {
          ...prev,
          [`test${testNumber}`]: intValue
        };
        console.log('Updated unit tests:', newTests);
        return newTests;
      });
      setError('');
    } else {
      setError('Unit test marks should be between 0 and 30');
    }
  };

  const calculateUnitTestMarks = () => {
    // Convert empty strings to 0 for calculation
    const test1 = unitTests.test1 === null ? 0 : unitTests.test1;
    const test2 = unitTests.test2 === null ? 0 : unitTests.test2;
    const test3 = unitTests.test3 === null ? 0 : unitTests.test3;
    
    // Calculate total marks (out of 90 - 3 tests * 30 marks each)
    const totalMarks = test1 + test2 + test3;
    const maxPossibleMarks = 90; // 3 tests * 30 marks
    
    // Convert to out of 20 (as per database model)
    const convertedMarks = (totalMarks / maxPossibleMarks) * 20;
    
    // Round to 2 decimal places for precision
    return Math.round(convertedMarks * 100) / 100;
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-7xl bg-white rounded-lg shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Record of Continuous Term work Assessment</h2>
              <p className="text-sm text-gray-500">AY: 2023-2024 | Semester: II</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Student Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Student Name:</label>
                <p className="mt-1 text-lg font-medium text-gray-900">{student.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Roll Number:</label>
                <p className="mt-1 text-lg font-medium text-gray-900">{student.rollNumber}</p>
              </div>
            </div>

            {/* Assessment Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Expt. No.</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>Performance Date</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>Submission Date</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RPP Marks (Out of 5)</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SPO Marks (Out of 5)</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment Marks (Out of 10)</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                  <tr className="bg-gray-50">
                    <th></th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500">Scheduled</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500">Actual</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500">Scheduled</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500">Actual</th>
                    <th colSpan={3}></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {experiments.map((experiment, index) => (
                    <tr key={index + 1} className={experiment.isSaved ? 'bg-green-50' : ''}>
                      <td className="px-3 py-3 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-3 py-3">
                        <input
                          type="date"
                          value={experiment.performanceDate.scheduled}
                          onChange={(e) => handleDateChange(index, 'performanceDate', 'scheduled', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#155E95] focus:ring-[#155E95] sm:text-sm"
                          disabled={experiment.isSaved}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="date"
                          value={experiment.performanceDate.actual}
                          onChange={(e) => handleDateChange(index, 'performanceDate', 'actual', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#155E95] focus:ring-[#155E95] sm:text-sm"
                          disabled={experiment.isSaved}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="date"
                          value={experiment.submissionDate.scheduled}
                          onChange={(e) => handleDateChange(index, 'submissionDate', 'scheduled', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#155E95] focus:ring-[#155E95] sm:text-sm"
                          disabled={experiment.isSaved}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="date"
                          value={experiment.submissionDate.actual}
                          onChange={(e) => handleDateChange(index, 'submissionDate', 'actual', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#155E95] focus:ring-[#155E95] sm:text-sm"
                          disabled={experiment.isSaved}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          value={experiment.marks.rpp}
                          onChange={(e) => handleMarksChange(index, 'rpp', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#155E95] focus:ring-[#155E95] sm:text-sm"
                          disabled={experiment.isSaved}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          value={experiment.marks.spo}
                          onChange={(e) => handleMarksChange(index, 'spo', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#155E95] focus:ring-[#155E95] sm:text-sm"
                          disabled={experiment.isSaved}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={experiment.marks.assignment}
                          onChange={(e) => handleMarksChange(index, 'assignment', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#155E95] focus:ring-[#155E95] sm:text-sm"
                          disabled={experiment.isSaved}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => handleSaveRow(index)}
                          disabled={experiment.isSaved}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            experiment.isSaved
                              ? 'bg-green-100 text-green-800 cursor-not-allowed'
                              : 'bg-[#155E95] text-white hover:bg-[#0f4a75]'
                          }`}
                        >
                          {experiment.isSaved ? 'Saved' : 'Save Row'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Unit Tests Section */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Unit Tests</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit Test-1 (Out of 30)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={unitTests.test1 === null ? '' : unitTests.test1}
                    onChange={(e) => handleUnitTestChange(1, e.target.value)}
                    className="mt-1 block w-full rounded-md border-2 border-gray-800 shadow-sm focus:border-[#155E95] focus:ring-[#155E95] sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit Test-2 (Out of 30)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={unitTests.test2 === null ? '' : unitTests.test2}
                    onChange={(e) => handleUnitTestChange(2, e.target.value)}
                    className="mt-1 block w-full rounded-md border-2 border-gray-800 shadow-sm focus:border-[#155E95] focus:ring-[#155E95] sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit Test-3 (Out of 30)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={unitTests.test3 === null ? '' : unitTests.test3}
                    onChange={(e) => handleUnitTestChange(3, e.target.value)}
                    className="mt-1 block w-full rounded-md border-2 border-gray-800 shadow-sm focus:border-[#155E95] focus:ring-[#155E95] sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-700">
                  Total Unit Test Marks (Out of 20): <span className="font-semibold">{calculateUnitTestMarks().toFixed(2)}</span>
                </p>
              </div>
            </div>

            {/* Final Assessment */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Proportionate Assignment marks out of 60(A)</span>
                  <input 
                    type="number" 
                    min="0"
                    max="60"
                    value={finalAssessment.proportionateAssignmentMarks}
                    onChange={(e) => handleFinalAssessmentChange('proportionateAssignmentMarks', e.target.value)}
                    className="w-20 rounded-md border-2 border-gray-800 shadow-sm focus:border-[#155E95] focus:ring-[#155E95] sm:text-sm" 
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSaveFinalAssessment}
                    className="px-4 py-2 bg-[#155E95] text-white rounded-md hover:bg-[#0f4a75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#155E95]"
                  >
                    Save Final Assessment
                  </button>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="bg-[#155E95] bg-opacity-5 p-4 rounded-lg">
                  <p className="text-lg font-semibold text-[#155E95]">
                    Final TW marks (Converted to) out of 25 or 50: 
                    <span className="ml-2 text-2xl">{finalAssessment.finalMarks}</span>
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#155E95]"
            >
              Close
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#155E95] hover:bg-[#0f4a75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#155E95]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#155E95]"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentAssessmentDialog;