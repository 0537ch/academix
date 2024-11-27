import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Typography } from "@material-tailwind/react";

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: 'fas fa-tv' },
    { path: '/admin/students', name: 'Students', icon: 'fas fa-users' },
    { path: '/admin/courses', name: 'Courses', icon: 'fas fa-book' },
    { path: '/admin/teachers', name: 'Teachers', icon: 'fas fa-chalkboard-teacher' },
    { path: '/admin/settings', name: 'Settings', icon: 'fas fa-cog' },
  ];

  return (
    <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
      <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
        <Link to="/admin/dashboard" className="md:block text-left md:pb-2 text-black mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">
          Academic System
        </Link>
        
        <div className="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded">
          <ul className="md:flex-col md:min-w-full flex flex-col list-none">
            {navItems.map((item) => (
              <li key={item.path} className="items-center">
                <Link
                  to={item.path}
                  className={`text-xs uppercase py-3 font-bold block ${
                    location.pathname === item.path
                      ? 'text-blue-500 hover:text-blue-600'
                      : 'text-gray-700 hover:text-gray-500'
                  }`}
                >
                  <i className={`${item.icon} mr-2 text-sm ${
                    location.pathname === item.path ? 'opacity-75' : 'text-gray-300'
                  }`}></i>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminSidebar;
