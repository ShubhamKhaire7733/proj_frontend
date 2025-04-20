const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function fetchAssignments(studentId) {
  const response = await fetch(`${API_URL}/assignments/student/${studentId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch assignments');
  }
  
  return response.json();
}

export async function fetchStudentStats(studentId) {
  const response = await fetch(`${API_URL}/students/${studentId}/stats`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch student stats');
  }
  
  return response.json();
}

export async function submitAssignment(assignmentId, data) {
  const response = await fetch(`${API_URL}/assignments/${assignmentId}/submit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit assignment');
  }
  
  return response.json();
}