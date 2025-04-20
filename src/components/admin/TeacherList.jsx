import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getAllTeachers, getTeacherById, updateTeacher, deleteTeacher } from '../../services/adminService';
import { toast } from 'react-toastify';

const TeacherList = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    subjects: '',
    isActive: true
  });

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      toast.error('Access denied: Admin privileges required');
      navigate('/login');
      return;
    }

    loadTeachers();
  }, [navigate]);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching teachers...');
      const data = await getAllTeachers();
      console.log('Teachers fetched successfully:', data);
      setTeachers(data);
    } catch (error) {
      console.error('Error loading teachers:', error);
      if (error.response?.status === 403) {
        toast.error('Access denied: Admin privileges required');
        navigate('/login');
      } else {
        setError('Failed to load teachers. Please try again later.');
        toast.error('Failed to load teachers');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (teacher = null) => {
    if (teacher) {
      setSelectedTeacher(teacher);
      setFormData({
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        subjects: teacher.subjects,
        isActive: teacher.isActive
      });
    } else {
      setSelectedTeacher(null);
      setFormData({
        name: '',
        email: '',
        department: '',
        subjects: '',
        isActive: true
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTeacher(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTeacher) {
        await updateTeacher(selectedTeacher.id, formData);
        toast.success('Teacher updated successfully');
      }
      handleClose();
      loadTeachers();
    } catch (error) {
      console.error('Error saving teacher:', error);
      if (error.response?.status === 403) {
        toast.error('Access denied: Admin privileges required');
        navigate('/login');
      } else {
        toast.error('Failed to save teacher');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await deleteTeacher(id);
        toast.success('Teacher deleted successfully');
        loadTeachers();
      } catch (error) {
        console.error('Error deleting teacher:', error);
        if (error.response?.status === 403) {
          toast.error('Access denied: Admin privileges required');
          navigate('/login');
        } else {
          toast.error('Failed to delete teacher');
        }
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Teachers</h2>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpen()}
        >
          Add Teacher
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : error ? (
        <Alert severity="error" className="mb-4">
          {error}
          <Button 
            color="inherit" 
            size="small" 
            onClick={loadTeachers}
            className="ml-2"
          >
            Retry
          </Button>
        </Alert>
      ) : teachers.length === 0 ? (
        <Alert severity="info" className="mb-4">
          No teachers found. Add a new teacher to get started.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Subjects</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.department}</TableCell>
                  <TableCell>{teacher.subjects}</TableCell>
                  <TableCell>{teacher.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(teacher)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(teacher.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedTeacher ? 'Edit Teacher' : 'Add Teacher'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Subjects"
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              margin="normal"
              helperText="Enter subjects separated by commas"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {selectedTeacher ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TeacherList; 