import React from 'react';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard: React.FC = () => {
  // Sample data for statistics cards
  const stats = [
    {
      title: "Total Students",
      value: "350",
      trend: "+10%",
      trendDirection: "up",
    },
    {
      title: "Total Courses",
      value: "45",
      trend: "+5%",
      trendDirection: "up",
    },
    {
      title: "Total Teachers",
      value: "28",
      trend: "0%",
      trendDirection: "neutral",
    },
    {
      title: "Active Classes",
      value: "32",
      trend: "-2%",
      trendDirection: "down",
    },
  ];

  // Sample data for the chart
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Student Enrollment",
        data: [300, 320, 315, 330, 345, 350],
        borderColor: "rgb(59, 130, 246)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Sample data for recent activities
  const recentActivities = [
    {
      action: "New student enrolled",
      details: "John Doe enrolled in Computer Science",
      time: "2 hours ago",
    },
    {
      action: "Course updated",
      details: "Web Development syllabus updated",
      time: "4 hours ago",
    },
    {
      action: "Assignment added",
      details: "New assignment added to Mathematics",
      time: "5 hours ago",
    },
  ];

  return (
    <div>
      <div className="px-4 md:px-10 mx-auto w-full mt-24">
        {/* Stats Cards */}
        <div className="flex flex-wrap">
          {stats.map((stat, index) => (
            <div key={index} className="w-full lg:w-6/12 xl:w-3/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg p-4">
                <div className="flex flex-wrap">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 className="text-gray-500 uppercase font-bold text-xs">
                      {stat.title}
                    </h5>
                    <span className="font-semibold text-xl text-gray-800">
                      {stat.value}
                    </span>
                    <span className={`ml-2 text-sm ${
                      stat.trendDirection === 'up' ? 'text-green-500' :
                      stat.trendDirection === 'down' ? 'text-red-500' :
                      'text-gray-500'
                    }`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="flex flex-wrap mt-4">
          {/* Student Enrollment Chart */}
          <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 shadow-lg">
              <div className="p-4 flex-auto">
                <div className="relative h-96">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="w-full xl:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 shadow-lg">
              <div className="p-4 border-b border-gray-200">
                <h6 className="text-gray-700 text-xl font-bold">Recent Activities</h6>
              </div>
              <div className="p-4">
                <div className="overflow-y-auto max-h-[400px]">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="border-b border-gray-200 py-3">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <h6 className="text-sm font-semibold">{activity.action}</h6>
                          <p className="text-sm text-gray-600">{activity.details}</p>
                        </div>
                        <span className="text-xs text-gray-400">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full bg-purple-500 text-white py-2 px-4 rounded text-sm hover:bg-purple-600 transition-colors">
                  View All Activities
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
