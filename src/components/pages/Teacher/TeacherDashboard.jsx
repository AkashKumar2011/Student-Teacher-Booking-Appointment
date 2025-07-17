// src/components/teacher/TeacherDashboard.jsx
import React, { useState } from 'react';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaEnvelope, FaListAlt, FaUserTie, FaSignOutAlt } from 'react-icons/fa';
import ScheduleAppointment from './ScheduleAppointment';
import AppointmentList from './AppointmentList';
import MessageList from './MessageList';
import AvailabilityList from './AvailabilityList';
import { useAuth } from '../../../context/AuthContext';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('schedule');
  const { currentUser, logout } = useAuth();
  
  const tabs = [
    { id: 'schedule', name: 'Set Availability', icon: <FaCalendarAlt /> },
    { id: 'appointments', name: 'Appointments', icon: <FaListAlt /> },
    { id: 'messages', name: 'Messages', icon: <FaEnvelope /> },
    { id: 'availability', name: 'My Schedule', icon: <FaCalendarAlt /> },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'schedule': return <ScheduleAppointment />;
      case 'appointments': return <AppointmentList />;
      case 'messages': return <MessageList />;
      case 'availability': return <AvailabilityList />;
      default: return <ScheduleAppointment />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl shadow-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-purple-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mr-4">
              <FaUserTie className="text-purple-700 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Teacher Dashboard</h1>
              <p className="text-purple-100">
                {currentUser?.displayName || currentUser?.email || 'Teacher'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                : 'bg-white text-indigo-700 hover:bg-indigo-50'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {renderContent()}
      </div>
    </div>
  );
}