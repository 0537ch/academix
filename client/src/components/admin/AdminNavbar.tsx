import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const adminName = user ? `${user.firstName} ${user.lastName}` : 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span className="text-blue-600 text-lg font-semibold">
              Admin Dashboard
            </span>
          </div>
          
          <div className="flex items-center">
            <div className="relative">
              <button
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md p-2"
                onClick={handleLogout}
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <img
                    alt={adminName}
                    className="w-full h-full rounded-full object-cover"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=0D8ABC&color=fff`}
                  />
                </div>
                <span className="text-sm font-medium">
                  {adminName}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
