import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaHome, FaUserGraduate, FaChalkboardTeacher, FaBook, FaCalendarAlt, 
  FaEnvelope, FaCog, FaSignOutAlt, FaUniversity, FaUsers, FaClipboardList, 
  FaInfoCircle, FaPhone, FaFileAlt, FaSearch, FaUserPlus, FaCheckCircle,
  FaGraduationCap, FaBookOpen, FaSchool, FaAddressCard, FaTimes 
} from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function Sidebar({ isOpen, onClose }) {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    appointments: false,
    management: false,
    academics: false,
    admissions: false
  });
  
  // Close sidebar when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onClose]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      onClose();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Navigation links based on user role
  const studentLinks = [
    { to: '/student/', text: 'Dashboard', icon: FaHome },
    { to: '/student/SearchTeacher', text: 'Find Teachers', icon: FaSearch },
    { to: '/student/MyAppointments', text: 'My Appointments', icon: FaCalendarAlt },
    { to: '/student/MessageList', text: 'Messages', icon: FaEnvelope },
    { to: '/student/MyProfile', text: 'My Profile', icon: FaAddressCard }
  ];

  const teacherLinks = [
    { to: '/teacher/', text: 'Dashboard', icon: FaHome },
    { to: '/teacher/ScheduleAppointment', text: 'My Schedule', icon: FaCalendarAlt },
    { to: '/teacher/AppointmentList', text: 'Appointments', icon: FaCheckCircle },
    // { to: '/teacher/students', text: '', icon: FaUserGraduate },
    { to: '/teacher/ViewAllMessages', text: 'Messages', icon: FaEnvelope },
    { to: '/teacher/TeacherProfile', text: 'Profile', icon: FaAddressCard }
  ];

  const adminLinks = [
    { to: '/admin/', text: 'Dashboard', icon: FaHome },
    { to: '/admin/AddTeacher', text: 'Add New Teacher', icon: FaChalkboardTeacher },
    { to: '/admin/ApproveStudents', text: 'Approve Students', icon: FaUserGraduate },
    { to: '/admin/ManageTeacher', text: 'Manage Teachers', icon: FaClipboardList },
    { to: '/admin/settings', text: 'System Settings', icon: FaCog }
  ];

  const getRoleLinks = () => {
    if (!userData) return [];
    switch(userData.role) {
      case 'admin': return adminLinks;
      case 'teacher': return teacherLinks;
      default: return studentLinks;
    }
  };

  // Role-specific expandable sections
  const renderRoleSections = () => {
    if (!userData) return null;
    
    if (userData.role === 'teacher') {
      return (
        <div className="mt-1">
          <button
            onClick={() => toggleSection('appointments')}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors ${
              expandedSections.appointments 
                ? 'bg-indigo-800 text-white' 
                : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
            }`}
          >
            <FaCalendarAlt className="mr-3 flex-shrink-0 h-5 w-5 text-indigo-300" />
            <span className="flex-1 text-left">Appointments</span>
            <svg
              className={`ml-3 h-4 w-4 transform transition-transform ${
                expandedSections.appointments ? 'rotate-90' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          {/* {expandedSections.appointments && (
            <div className="ml-8 mt-1 space-y-1">
              <NavLink
                to="/teacher/appointments/upcoming"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700 hover:text-white"
                onClick={onClose}
              >
                Upcoming
              </NavLink>
              <NavLink
                to="/teacher/appointments/pending"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700 hover:text-white"
                onClick={onClose}
              >
                Pending Approval
              </NavLink>
              <NavLink
                to="/teacher/appointments/history"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700 hover:text-white"
                onClick={onClose}
              >
                History
              </NavLink>
            </div>
          )} */}
        </div>
      );
    }

    if (userData.role === 'admin') {
      return (
        <div className="mt-1">
          <button
            onClick={() => toggleSection('management')}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors ${
              expandedSections.management 
                ? 'bg-indigo-800 text-white' 
                : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
            }`}
          >
            <FaUsers className="mr-3 flex-shrink-0 h-5 w-5 text-indigo-300" />
            <span className="flex-1 text-left">Management</span>
            <svg
              className={`ml-3 h-4 w-4 transform transition-transform ${
                expandedSections.management ? 'rotate-90' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          {/* {expandedSections.management && (
            <div className="ml-8 mt-1 space-y-1">
              <NavLink
                to="/admin/management/add-teacher"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700 hover:text-white"
                onClick={onClose}
              >
                <FaUserPlus className="mr-2 h-4 w-4" />
                Add Teacher
              </NavLink>
              <NavLink
                to="/admin/management/approve-students"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700 hover:text-white"
                onClick={onClose}
              >
                <FaCheckCircle className="mr-2 h-4 w-4" />
                Approve Students
              </NavLink>
            </div>
          )} */}
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed z-99 top-0 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar container */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-55 transform transition-transform duration-300 ease-in-out bg-gradient-to-b from-indigo-600 to-purple-700 shadow-xl md:translate-x-0 md:static md:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="flex justify-between items-center p-4 md:hidden">
            <button onClick={onClose} className="text-white flex items-center justify-center gap-x-2 text-2xl  font-bold">
               <FaUniversity h-5 w-5 />  University
            </button>
            <button 
              onClick={onClose}
              className="pt-2 rounded-full text-white hover:bg-indigo-700 focus:outline-none"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-2 border-t border-white">
            <nav className="space-y-2">
              {/* Main links based on role */}
              {getRoleLinks().map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => 
                    `group flex items-center px-3 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-800 text-white shadow-md' 
                        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                    }`
                  }
                  onClick={onClose}
                >
                  <link.icon className="mr-3 flex-shrink-0 h-5 w-5 text-indigo-300" />
                  <span className="text-sm font-medium">{link.text}</span>
                </NavLink>
              ))}

              {/* Role-specific sections */}
              {renderRoleSections()}

              {/* Additional links */}
              <div className="mt-4 pt-2 border-t border-white">
                <NavLink
                  to="/about"
                  className={({ isActive }) => 
                    `group flex items-center px-3 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-800 text-white shadow-md' 
                        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                    }`
                  }
                  onClick={onClose}
                >
                  <FaInfoCircle className="mr-3 flex-shrink-0 h-5 w-5 text-indigo-300" />
                  <span className="text-sm font-medium">About</span>
                </NavLink>
                <NavLink
                  to="/contact"
                  className={({ isActive }) => 
                    `group flex items-center px-3 py-3 rounded-lg transition-colors mt-1 ${
                      isActive 
                        ? 'bg-indigo-800 text-white shadow-md' 
                        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                    }`
                  }
                  onClick={onClose}
                >
                  <FaPhone className="mr-3 flex-shrink-0 h-5 w-5 text-indigo-300" />
                  <span className="text-sm font-medium">Contact</span>
                </NavLink>
              </div>

              {/* Settings and Logout */}
              {userData && (
                <div className="mt-4 py-2 border-y border-white">
                  <NavLink
                    to="/settings"
                    className={({ isActive }) => 
                      `group flex items-center px-3 py-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-indigo-800 text-white shadow-md' 
                          : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                      }`
                    }
                    onClick={onClose}
                  >
                    <FaCog className="mr-3 flex-shrink-0 h-5 w-5 text-indigo-300" />
                    <span className="text-sm font-medium">Settings</span>
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="group flex items-center w-full px-3 py-3 rounded-lg text-indigo-100 hover:bg-indigo-700 hover:text-white transition-colors"
                  >
                    <FaSignOutAlt className="mr-3 flex-shrink-0 h-5 w-5 text-indigo-300" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              )}
            </nav>
          </div>

          {/* User profile */}
          {userData && (
            <div className="px-4 py-4 border-t border-indigo-700 bg-indigo-800/30 rounded-lg m-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center text-white">
                    {userData.role === 'teacher' ? (
                      <FaChalkboardTeacher className="h-5 w-5" />
                    ) : userData.role === 'admin' ? (
                      <FaUniversity className="h-5 w-5" />
                    ) : (
                      <FaUserGraduate className="h-5 w-5" />
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-white truncate max-w-[150px]">
                    {userData.displayName || userData.email.split('@')[0]}
                  </div>
                  <div className="text-xs font-medium text-indigo-200">
                    {userData.role === 'admin' ? 'Administrator' : 
                    userData.role === 'teacher' ? 'Faculty' : 'Student'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}