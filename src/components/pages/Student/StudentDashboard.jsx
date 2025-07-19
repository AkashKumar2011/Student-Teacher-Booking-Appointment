// src/pages/student/StudentDashboard.jsx
import React, { useState } from 'react';
import { 
  FaSearch, 
  FaCalendarAlt, 
  FaEnvelope, 
  FaUser, 
  FaSignOutAlt, 
  FaHome,
  FaArrowLeft,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SearchTeacher from './SearchTeacher';
import MyAppointments from './MyAppointments';
import MessageList from './MessageList';
import MyProfile from './MyProfile';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('find-teachers');
  const [view, setView] = useState('list');
  const [detailItem, setDetailItem] = useState(null);
  const [previousTab, setPreviousTab] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const changeTab = (tab) => {
    setPreviousTab(activeTab);
    setActiveTab(tab);
    setView('list');
    setDetailItem(null);
    setShowMobileMenu(false);
  };


  const viewDetails = (item, type) => {
    setDetailItem({...item, type});
    setView('detail');
  };

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'find-teachers':
        return <SearchTeacher onViewDetails={(teacher) => viewDetails(teacher, 'teacher')} />;
      case 'my-appointments':
        return <MyAppointments />;
      case 'messages':
        return <MessageList />;
      case 'profile':
        return <MyProfile />;
      default:
        return <SearchTeacher onViewDetails={(teacher) => viewDetails(teacher, 'teacher')} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 mt-12 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-l from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
        <div className="container mx-auto px-5 pl-15 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="bg-white rounded-full p-1 mr-3">
                <div className="bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center">
                  {currentUser?.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="Profile" 
                      className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-indigo-800 font-bold">
                      {currentUser?.displayName?.charAt(0) || 'S'}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold">
                  {view === 'detail' ? 
                    detailItem?.type === 'teacher' ? 'Teacher Profile' : 
                    'Student Dashboard'
                  : 'Student Dashboard'}
                </h1>
                <p className="text-indigo-200 text-xs md:text-sm hidden md:block">
                  {view !== 'detail' && `Welcome, ${currentUser?.displayName || currentUser?.email}`}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            
            <button 
              className="md:hidden p-2 rounded-full bg-white/20"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <FaTimes /> : <FaBars />}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-gradient-to-b from-purple-700 to-indigo-800 text-white shadow-lg z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => changeTab('find-teachers')}
                className={`px-4 py-3 flex items-center justify-center gap-2 transition-colors text-sm rounded-lg ${
                  activeTab === 'find-teachers' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <FaSearch /> Find
              </button>
              <button
                onClick={() => changeTab('my-appointments')}
                className={`px-4 py-3 flex items-center justify-center gap-2 transition-colors text-sm rounded-lg ${
                  activeTab === 'appointments' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <FaCalendarAlt /> Appts
              </button>
              <button
                onClick={() => changeTab('messages')}
                className={`px-4 py-3 flex items-center justify-center gap-2 transition-colors text-sm rounded-lg ${
                  activeTab === 'messages' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <FaEnvelope /> Messages
              </button>
              <button
                onClick={() => changeTab('profile')}
                className={`px-4 py-3 flex items-center justify-center gap-2 transition-colors text-sm rounded-lg ${
                  activeTab === 'profile' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <FaUser /> Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation - Only show when in list view */}
      {view === 'list' && (
        <nav className="bg-white shadow-md sticky top-16 z-30 hidden md:block">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-1 sm:gap-0">
              <button
                onClick={() => changeTab('find-teachers')}
                className={`px-4 py-3 flex items-center gap-2 transition-colors text-sm sm:text-base ${
                  activeTab === 'find-teachers' 
                    ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-b-4 border-indigo-600 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaSearch /> Find Teachers
              </button>
              <button
                onClick={() => changeTab('my-appointments')}
                className={`px-4 py-3 flex items-center gap-2 transition-colors text-sm sm:text-base ${
                  activeTab === 'my-appointments' 
                    ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-b-4 border-indigo-600 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaCalendarAlt /> My Appointments
              </button>
              <button
                onClick={() => changeTab('messages')}
                className={`px-4 py-3 flex items-center gap-2 transition-colors text-sm sm:text-base ${
                  activeTab === 'messages' 
                    ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-b-4 border-indigo-600 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaEnvelope /> My Messages
              </button>
              <button
                onClick={() => changeTab('profile')}
                className={`px-4 py-3 flex items-center gap-2 transition-colors text-sm sm:text-base ${
                  activeTab === 'profile' 
                    ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-b-4 border-indigo-600 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaUser /> My Profile
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-180px)]">
        {view === 'list' ? (
          renderActiveTab()
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6">
              {detailItem?.type === 'teacher' ? 'Teacher Details' : 'Detail View'}
            </h2>
            {/* Detail view content would go here */}
            <button
              onClick={() => setView('list')}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Back to List
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;