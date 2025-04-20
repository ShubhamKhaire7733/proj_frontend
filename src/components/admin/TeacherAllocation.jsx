import React, { useState, useEffect } from 'react';
import { getToken } from '../../lib/auth';
import { 
  getTeacherAllocations, 
  createTeacherAllocation, 
  updateTeacherAllocation, 
  deleteTeacherAllocation 
} from '../../services/adminService';
import { getTeachers } from '../../services/adminService';
import { getSubjects } from '../../services/subjectService';
import { getBatches } from '../../services/batchService';

function TeacherAllocation() {
  const [allocations, setAllocations] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [formData, setFormData] = useState({
    teacherId: '',
    subjectId: '',
    batchId: '',
    division: '',
    academicYear: new Date().getFullYear().toString()
  });
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchAllocations();
    fetchTeachers();
    fetchSubjects();
    fetchBatches();
  }, []);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const data = await getTeacherAllocations();
      setAllocations(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch teacher allocations');
      console.error('Error fetching allocations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      console.log('Fetching teachers...');
      const data = await getTeachers();
      console.log('Teachers fetched:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected an array of teachers');
      }
      
      setTeachers(data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to fetch teachers: ' + err.message);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  const fetchBatches = async () => {
    try {
      const data = await getBatches();
      setBatches(data);
    } catch (err) {
      console.error('Error fetching batches:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingAllocation) {
        await updateTeacherAllocation(editingAllocation.id, formData);
        setSuccess('Teacher allocation updated successfully');
      } else {
        await createTeacherAllocation(formData);
        setSuccess('Teacher allocation created successfully');
      }
      fetchAllocations();
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save teacher allocation');
      console.error('Error saving allocation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (allocation) => {
    setEditingAllocation(allocation);
    setFormData({
      teacherId: allocation.teacherId,
      subjectId: allocation.subjectId,
      batchId: allocation.batchId,
      division: allocation.division || '',
      academicYear: allocation.academicYear || new Date().getFullYear().toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this allocation?')) {
      try {
        setLoading(true);
        await deleteTeacherAllocation(id);
        setSuccess('Teacher allocation deleted successfully');
        fetchAllocations();
      } catch (err) {
        setError(err.message || 'Failed to delete teacher allocation');
        console.error('Error deleting allocation:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      teacherId: '',
      subjectId: '',
      batchId: '',
      division: '',
      academicYear: new Date().getFullYear().toString()
    });
    setShowForm(false);
    setEditingAllocation(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#155E95]">Teacher Allocation</h2>
        <button
          onClick={() => {
            setEditingAllocation(null);
            setFormData({
              teacherId: '',
              subjectId: '',
              batchId: '',
              division: '',
              academicYear: new Date().getFullYear().toString()
            });
            setShowForm(true);
          }}
          className="bg-[#155E95] text-white px-4 py-2 rounded hover:bg-[#0d4a7a] transition"
        >
          Add New Allocation
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-medium mb-4">
            {editingAllocation ? 'Edit Teacher Allocation' : 'Create New Teacher Allocation'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher
                </label>
                <select
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#155E95]"
                  required
                >
                  <option value="">Select a teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.department})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#155E95]"
                  required
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch
                </label>
                <select
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#155E95]"
                  required
                >
                  <option value="">Select a batch</option>
                  {batches.map(batch => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name} ({batch.year || 'N/A'} - {batch.division || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Division
                </label>
                <input
                  type="text"
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#155E95]"
                  placeholder="e.g., A, B, C"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#155E95]"
                  placeholder="e.g., 2023-2024"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAllocation(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#155E95] text-white rounded hover:bg-[#0d4a7a]"
              >
                {editingAllocation ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#155E95]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Division
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Year
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allocations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No teacher allocations found
                  </td>
                </tr>
              ) : (
                allocations.map((allocation) => (
                  <tr key={allocation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {allocation.teacher?.name || 'Unknown Teacher'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {allocation.subject?.name || 'Unknown Subject'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {allocation.batch?.name || 'Unknown Batch'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {allocation.division || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {allocation.academicYear || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(allocation)}
                        className="text-[#155E95] hover:text-[#0d4a7a] mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(allocation.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TeacherAllocation; 