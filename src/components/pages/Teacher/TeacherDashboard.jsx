// src/components/teacher/TeacherDashboard.jsx
import React, { useState } from 'react';
import { FaCalendarAlt, FaCheckCircle, FaEnvelope, FaListAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import ScheduleAppointment from './ScheduleAppointment';
import ManageAppointmentList from './ManageAppointmentList';
import ViewAllMessages from './ViewAllMessages';
import AvailabilityList from './AvailabilityList';
import TeacherProfile from './TeacherProfile';
import { useAuth } from '../../../context/AuthContext';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('schedule');
  const { currentUser, logout } = useAuth();
  
  const tabs = [
    { id: 'schedule', name: 'Set Availability', icon: <FaCalendarAlt /> },
    { id: 'appointments', name: 'Appointments', icon: <FaListAlt /> },
    { id: 'messages', name: 'Messages', icon: <FaEnvelope /> },
    { id: 'availability', name: 'My Schedule', icon: <FaCalendarAlt /> },
    { id: 'profile', name: 'Profile', icon: <FaUser /> },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'schedule': return <ScheduleAppointment />;
      case 'appointments': return <ManageAppointmentList />;
      case 'messages': return <ViewAllMessages />;
      case 'availability': return <AvailabilityList />;
      case 'profile': return <TeacherProfile />;
      default: return <ScheduleAppointment />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 mt-12 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg">
        <div className="max-w-full mx-auto px-8 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-white p-2 rounded-full mr-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12 flex items-center justify-center">
                  <FaUser className="text-purple-700 text-xl" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Teacher Dashboard</h1>
                <p className="text-purple-200">
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
      </div>

      {/* Navigation Tabs - Responsive */}
      <div className="max-w-full mx-auto px-8 sm:px-6 py-4">
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {renderContent()}
        </div>
      </div>

    </div>
  );
}