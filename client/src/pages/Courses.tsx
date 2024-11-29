import React, { useState, useEffect } from 'react';
import { PlusIcon, UserGroupIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import api from '../config/api';
import { toast } from 'react-toastify';

interface Course {
  _id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  teacher: {
    firstName: string;
    lastName: string;
  };
  students: Array<{
    firstName: string;
    lastName: string;
  }>;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
    room: string;
  };
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      console.log('Fetching courses...');
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view courses');
        setLoading(false);
        toast.error('Authentication required');
        return;
      }

      const response = await api.get('/courses');
      console.log('Courses response:', response.data);
      setCourses(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching courses:', error.response || error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch courses';
      if (error.response?.status === 401) {
        setError('Please log in to view courses');
        toast.error('Authentication required');
      } else {
        setError(errorMessage);
        toast.error(errorMessage);
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        {error.includes('log in') && (
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <motion.div
            key={course._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
          >
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{course.code}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {course.credits} Credits
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-600">{course.description}</p>
            </div>
            
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center space-x-4">
                <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {course.teacher ? `${course.teacher.firstName} ${course.teacher.lastName}` : 'No Teacher Assigned'}
                </span>
              </div>
              <div className="mt-2 flex items-center space-x-4">
                <UserGroupIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {course.students.length} Students
                </span>
              </div>
              <div className="mt-2 flex items-center space-x-4">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {course.schedule.day} {course.schedule.startTime}-{course.schedule.endTime}
                </span>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
