import React, { useState, useEffect } from 'react';
import { getCurrentUser, getToken } from '../lib/auth';
import { getCurrentTeacher } from '../services/teacherService';

const AuthTest = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get current user from token
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Get raw token
    const authToken = getToken();
    setToken(authToken);
  }, []);

  const testTeacherAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCurrentTeacher();
      setTeacher(data);
    } catch (err) {
      console.error('Error fetching teacher profile:', err);
      setError(err.message || 'Failed to fetch teacher profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">Current User</h2>
        {user ? (
          <pre className="bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        ) : (
          <p className="text-red-500">No user found. Please log in.</p>
        )}
      </div>
      
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">Auth Token</h2>
        {token ? (
          <div>
            <p className="text-green-500 mb-2">Token found</p>
            <p className="text-xs break-all bg-gray-100 p-2 rounded">
              {token.substring(0, 20)}...{token.substring(token.length - 20)}
            </p>
          </div>
        ) : (
          <p className="text-red-500">No token found. Please log in.</p>
        )}
      </div>
      
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">API Test</h2>
        <button 
          onClick={testTeacherAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Loading...' : 'Test Teacher API'}
        </button>
        
        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {teacher && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Teacher Profile</h3>
            <pre className="bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(teacher, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthTest; 