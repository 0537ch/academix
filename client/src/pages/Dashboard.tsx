import React from 'react';
import {
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { name: 'Total Students', stat: '256', icon: UserGroupIcon },
  { name: 'Active Courses', stat: '12', icon: BookOpenIcon },
  { name: 'Upcoming Events', stat: '4', icon: CalendarIcon },
  { name: 'Average Grade', stat: '3.8', icon: AcademicCapIcon },
];

const recentActivity = [
  { id: 1, user: 'John Doe', action: 'submitted assignment', course: 'Mathematics 101', time: '2 hours ago' },
  { id: 2, user: 'Jane Smith', action: 'enrolled in', course: 'Physics 202', time: '4 hours ago' },
  { id: 3, user: 'Mike Johnson', action: 'completed quiz', course: 'Chemistry 301', time: '1 day ago' },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <button className="btn-primary">
          New Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                  <dd className="text-lg font-semibold text-gray-900">{item.stat}</dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivity.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== recentActivity.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <UserGroupIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium text-gray-900">{activity.user}</span>{' '}
                            {activity.action}{' '}
                            <span className="font-medium text-gray-900">{activity.course}</span>
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time dateTime={activity.time}>{activity.time}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full btn-primary">
              Create New Course
            </button>
            <button className="w-full btn-secondary">
              View All Courses
            </button>
            <button className="w-full btn-secondary">
              Manage Students
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
