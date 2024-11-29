import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../config/api';
import useAuth from '../hooks/useAuth';
import AddCourse from '../components/courses/AddCourse';

interface Course {
  _id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  teacher: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  students: {
    _id: string;
    firstName: string;
    lastName: string;
  }[];
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  };
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      console.log('Fetched courses:', response.data);
      setCourses(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to view courses');
        navigate('/login');
      } else {
        toast.error('Failed to load courses');
      }
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const response = await api.post(`/courses/${courseId}/enroll`);
      console.log('Enroll response:', response.data);
      console.log('Current user:', user);
      
      // Update the specific course in the courses state
      setCourses(prevCourses => {
        const updatedCourses = prevCourses.map(course => 
          course._id === courseId ? {
            ...course,
            students: [...course.students, { 
              _id: user?._id || '', 
              firstName: user?.firstName || '',
              lastName: user?.lastName || ''
            }]
          } : course
        );
        console.log('Updated courses:', updatedCourses);
        return updatedCourses;
      });
      
      toast.success('Successfully enrolled in course');
    } catch (error: any) {
      console.error('Error enrolling in course:', error);
      toast.error(error.response?.data?.message || 'Failed to enroll in course');
    }
  };

  const handleUnenroll = async (courseId: string) => {
    try {
      const response = await api.post(`/courses/${courseId}/unenroll`);
      console.log('Unenroll response:', response.data);
      console.log('Current user:', user);
      
      // Update the specific course in the courses state
      setCourses(prevCourses => {
        const updatedCourses = prevCourses.map(course => 
          course._id === courseId ? {
            ...course,
            students: course.students.filter(student => student._id !== user?._id)
          } : course
        );
        console.log('Updated courses:', updatedCourses);
        return updatedCourses;
      });
      
      toast.success('Successfully unenrolled from course');
    } catch (error: any) {
      console.error('Error unenrolling from course:', error);
      toast.error(error.response?.data?.message || 'Failed to unenroll from course');
    }
  };

  const isEnrolled = (course: Course) => {
    if (!user?._id || !course.students) return false;
    const enrolled = course.students.some(student => student._id === user._id);
    console.log(`Checking enrollment for course ${course.name}:`, {
      courseId: course._id,
      userId: user._id,
      students: course.students,
      enrolled
    });
    return enrolled;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Course
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{course.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{course.code}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {course.credits} Credits
              </span>
            </div>
            
            <p className="text-gray-700 mt-4">{course.description}</p>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Instructor:</span>{' '}
                {course.teacher ? `${course.teacher.firstName} ${course.teacher.lastName}` : 'Not assigned'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Schedule:</span>{' '}
                {`${course.schedule.day} ${course.schedule.startTime} - ${course.schedule.endTime}`}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Enrolled Students:</span>{' '}
                {course.students.length}
              </p>
            </div>

            {user?.role === 'student' && (
              <div className="mt-4">
                {isEnrolled(course) ? (
                  <button
                    onClick={() => handleUnenroll(course._id)}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Unenroll
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Enroll
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddCourse
          onCourseAdded={fetchCourses}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
