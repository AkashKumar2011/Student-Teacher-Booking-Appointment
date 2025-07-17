// src/pages/student/RecentActivity.jsx
import React from 'react';
import { FaCalendarAlt, FaEnvelope, FaClock, FaCheckCircle } from 'react-icons/fa';

const RecentActivity = () => {
  const activities = [
    {
      icon: <FaCalendarAlt className="text-blue-500" />,
      title: "Appointment Booked",
      description: "With Dr. Sarah Johnson for tomorrow",
      time: "10 minutes ago"
    },
    {
      icon: <FaEnvelope className="text-green-500" />,
      title: "Message Sent",
      description: "To Prof. Alex Brown about project",
      time: "45 minutes ago"
    },
    {
      icon: <FaClock className="text-amber-500" />,
      title: "Appointment Pending",
      description: "Waiting for Dr. Lee's approval",
      time: "2 hours ago"
    },
    {
      icon: <FaCheckCircle className="text-emerald-500" />,
      title: "Appointment Confirmed",
      description: "With Dr. Smith approved",
      time: "5 hours ago"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="mt-1 mr-3">
              {activity.icon}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">{activity.title}</div>
              <div className="text-gray-600 text-sm">{activity.description}</div>
              <div className="text-gray-400 text-xs mt-1">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;