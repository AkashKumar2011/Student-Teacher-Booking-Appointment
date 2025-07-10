import { useState } from 'react';
import { FaHome, FaCalendarAlt, FaUserGraduate, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Appointments from './Appointments';
import Messages from './Messages';
import Schedule from './Schedule';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const stats = [
    { title: 'Upcoming Appointments', value: 5, icon: <FaCalendarAlt className="text-2xl" />, tab: 'appointments' },
    { title: 'Pending Requests', value: 3, icon: <FaCalendarAlt className="text-2xl" />, tab: 'appointments' },
    { title: 'Total Students', value: 42, icon: <FaUserGraduate className="text-2xl" /> },
    { title: 'Unread Messages', value: 2, icon: <FaEnvelope className="text-2xl" />, tab: 'messages' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'appointments':
        return <Appointments />;
      case 'messages':
        return <Messages />;
      case 'schedule':
        return <Schedule />;
      default:
        return (
          <>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-8 gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-indigo-100 to-purple-100 p-4 rounded-xl shadow-lg flex items-center cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  onClick={() => stat.tab && setActiveTab(stat.tab)}
                >
                  <div className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white mr-4">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 px-8 pb-9 gap-6">
              <div 
                className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => setActiveTab('schedule')}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-purple-600" /> Manage Schedule
                </h2>
                <p className="text-gray-600">Set your available time slots for student appointments</p>
              </div>
              <div 
                className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => setActiveTab('messages')}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaEnvelope className="text-blue-600" /> View Messages
                </h2>
                <p className="text-gray-600">Check and respond to student inquiries</p>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 mt-9 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          {activeTab === 'dashboard' ? (
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaHome className="text-indigo-600" /> Teacher Dashboard
            </h1>
          ) : (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-lg shadow hover:shadow-md transition-all"
              >
                <FaArrowLeft /> Back to Dashboard
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 capitalize">
                {activeTab}
              </h1>
            </div>
          )}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow hover:shadow-md transition-all hover:opacity-90"
          >
            <FaHome /> Go to Home
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}