import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="md:ml-64">
        <AdminNavbar />
        <main className="px-4 md:px-10 mx-auto py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
