import { useState, useEffect } from 'react';
import { getToken } from '../../lib/auth';

const BatchManagement = () => {
  const [batches, setBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    year: 'SE',
    division: '9',
    day: 'Monday',
    time: '',
    startDate: '',
    endDate: '',
    teacherId: '',
    rollNumberStart: '',
    rollNumberEnd: ''
  });
  const [editingBatch, setEditingBatch] = useState(null);

  useEffect(() => {
    fetchBatches();
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/teachers/all', {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setTeachers(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError('Failed to fetch teachers: ' + error.message);
    }
  };

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/batches', {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setBatches(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError('Failed to fetch batches: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Format the data
      const formattedData = {
        ...formData,
        time: formData.time + ':00', // Ensure time has seconds
        rollNumberStart: parseInt(formData.rollNumberStart),
        rollNumberEnd: parseInt(formData.rollNumberEnd),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      const url = editingBatch 
        ? `http://localhost:3000/api/batches/${editingBatch.id}`
        : 'http://localhost:3000/api/batches';
      
      const method = editingBatch ? 'PUT' : 'POST';

      console.log('Sending batch data:', formattedData); // Debug log

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(formattedData)
      });

      const data = await response.json();
      console.log('Server response:', data); // Debug log

      if (data.success) {
        if (editingBatch) {
          setBatches(prev => prev.map(batch => 
            batch.id === editingBatch.id ? data.data : batch
          ));
        } else {
          setBatches(prev => [...prev, data.data]);
        }
        setShowForm(false);
        setEditingBatch(null);
        setFormData({
          name: '',
          year: 'SE',
          division: '9',
          day: 'Monday',
          time: '',
          startDate: '',
          endDate: '',
          teacherId: '',
          rollNumberStart: '',
          rollNumberEnd: ''
        });
      } else {
        throw new Error(data.message || 'Failed to create batch');
      }
    } catch (error) {
      console.error('Error details:', error); // Debug log
      setError(`Failed to ${editingBatch ? 'update' : 'create'} batch: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (batch) => {
    setEditingBatch(batch);
    setFormData({
      name: batch.name,
      year: batch.year,
      division: batch.division,
      day: batch.day,
      time: batch.time,
      startDate: batch.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : '',
      endDate: batch.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : '',
      teacherId: batch.teacherId,
      rollNumberStart: batch.rollNumberStart || '',
      rollNumberEnd: batch.rollNumberEnd || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this batch?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/batches/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setBatches(prev => prev.filter(batch => batch.id !== id));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError('Failed to delete batch: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Batch Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingBatch(null);
              setFormData({
                name: '',
                year: 'SE',
                division: '9',
                day: 'Monday',
                time: '',
                startDate: '',
                endDate: '',
                teacherId: '',
                rollNumberStart: '',
                rollNumberEnd: ''
              });
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Add New Batch'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Batch Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Teacher</label>
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="SE">SE</option>
                <option value="TE">TE</option>
                <option value="BE">BE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Division</label>
              <select
                name="division"
                value={formData.division}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Roll Number Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="rollNumberStart"
                  value={formData.rollNumberStart}
                  onChange={handleInputChange}
                  required
                  min="23101"
                  max="45000"
                  placeholder="Start (23101-45000)"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="rollNumberEnd"
                  value={formData.rollNumberEnd}
                  onChange={handleInputChange}
                  required
                  min="23101"
                  max="45000"
                  placeholder="End (23101-45000)"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Day</label>
              <select
                name="day"
                value={formData.day}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? (editingBatch ? 'Updating...' : 'Creating...') : (editingBatch ? 'Update Batch' : 'Create Batch')}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Division</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Numbers</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {batches.map(batch => (
              <tr key={batch.id}>
                <td className="px-6 py-4 whitespace-nowrap">{batch.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {teachers.find(t => t.id === batch.teacherId)?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{batch.year}</td>
                <td className="px-6 py-4 whitespace-nowrap">{batch.division}</td>
                <td className="px-6 py-4 whitespace-nowrap">{batch.rollNumberStart} - {batch.rollNumberEnd}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {batch.day} at {batch.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(batch)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(batch.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BatchManagement; 