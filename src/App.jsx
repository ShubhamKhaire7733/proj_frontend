import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { getCurrentUser } from './lib/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import StudentDashboard from './components/student/StudentDashboard';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import AdminPanel from './pages/AdminPanel';
import BatchAttendance from './pages/dashboard/BatchAttendance';
import SE from './pages/dashboard/SE';
import TE from './pages/dashboard/TE';
import BE from './pages/dashboard/BE';
import AuthTest from './components/AuthTest';
import BatchDetails from './components/teacher/BatchDetails';
import AssessmentDetails from './components/student/AssessmentDetails';

function PrivateRoute({ children, allowedRoles }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth-test" element={<AuthTest />} />
              <Route path="/student" element={
                <PrivateRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </PrivateRoute>
              } />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/assessments" element={<AssessmentDetails />} />
              <Route path="/teacher" element={
                <PrivateRoute allowedRoles={['teacher']}>
                  <TeacherDashboard />
                </PrivateRoute>
              } />
              <Route path="/teacher/batch/:batchId" element={
                <PrivateRoute allowedRoles={['teacher']}>
                  <BatchDetails />
                </PrivateRoute>
              } />
              <Route path="/teacher/year/SE" element={
                <PrivateRoute allowedRoles={['teacher']}>
                  <SE />
                </PrivateRoute>
              } />
              <Route path="/teacher/year/TE" element={
                <PrivateRoute allowedRoles={['teacher']}>
                  <TE />
                </PrivateRoute>
              } />
              <Route path="/teacher/year/BE" element={
                <PrivateRoute allowedRoles={['teacher']}>
                  <BE />
                </PrivateRoute>
              } />
              <Route path="/teacher/batch/:batchId/attendance" element={
                <PrivateRoute allowedRoles={['teacher']}>
                  <BatchAttendance />
                </PrivateRoute>
              } />
              <Route path="/admin" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminPanel />
                </PrivateRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;