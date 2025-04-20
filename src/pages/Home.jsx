import { Link } from 'react-router-dom';
import { getCurrentUser } from '../lib/auth';
import { ArrowRight } from 'lucide-react';

function Home() {
  const user = getCurrentUser();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold text-[#155E95] mb-4">
          Welcome to Lab Management System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A comprehensive platform for managing laboratory resources and activities
        </p>
        
        {user ? (
          <Link
            to={`/${user.role}`}
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-[#155E95] rounded-md hover:bg-[#0f4a75] transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-[#155E95] rounded-md hover:bg-[#0f4a75] transition-colors"
            >
              Sign In
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-[#155E95] bg-white border-2 border-[#155E95] rounded-md hover:bg-gray-50 transition-colors"
            >
              Register
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;