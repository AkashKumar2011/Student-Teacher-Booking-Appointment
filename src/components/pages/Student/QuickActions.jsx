// src/pages/student/QuickActions.jsx
import React from 'react';
import { FaCalendarPlus, FaEnvelope, FaUserPlus, FaFileAlt } from 'react-icons/fa';

const QuickActions = ({ navigate }) => {
  const actions = [
    {
      icon: <FaCalendarPlus className="text-2xl text-blue-500" />,
      title: "Book Appointment",
      description: "Schedule with your teacher",
      action: () => navigate('search')
    },
    {
      icon: <FaEnvelope className="text-2xl text-green-500" />,
      title: "Send Message",
      description: "Contact your teacher directly",
      action: () => navigate('messages')
    },
    {
      icon: <FaUserPlus className="text-2xl text-purple-500" />,
      title: "Find Teachers",
      description: "Discover new instructors",
      action: () => navigate('search')
    },
    {
      icon: <FaFileAlt className="text-2xl text-amber-500" />,
      title: "View Appointments",
      description: "Check your schedule",
      action: () => navigate('appointments')
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button 
            key={index}
            onClick={action.action}
            className="flex flex-col items-center text-center p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-md transition-all"
          >
            <div className="mb-3">{action.icon}</div>
            <div className="font-bold text-gray-800">{action.title}</div>
            <div className="text-sm text-gray-600 mt-1">{action.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;