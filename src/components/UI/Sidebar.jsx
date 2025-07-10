import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaUserGraduate, FaChalkboardTeacher, FaBook, FaCalendarAlt, 
         FaEnvelope, FaCog, FaSignOutAlt, FaUniversity, FaUsers, FaClipboardList, 
         FaInfoCircle, FaPhone, FaFileAlt, FaSearch, FaUserPlus, FaCheckCircle,
         FaGraduationCap, FaBookOpen, FaSchool, FaAddressCard } from 'react-icons/fa';
import { useState } from 'react';

export default function Sidebar({ isOpen, onClose, className = '' }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    appointments: false,
    management: false,
    academics: false,
    admissions: false
  });

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
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const studentLinks = [
    { to: '/student/dashboard', text: 'Dashboard', icon: FaHome },
    { to: '/student/teachers', text: 'Find Teachers', icon: FaSearch },
    { to: '/student/appointments', text: 'My Appointments', icon: FaCalendarAlt },
    { to: '/student/messages', text: 'Messages', icon: FaEnvelope }
  ];

  const teacherLinks = [
    { to: '/teacher/dashboard', text: 'Dashboard', icon: FaHome },
    { to: '/teacher/schedule', text: 'My Schedule', icon: FaCalendarAlt },
    { to: '/teacher/appointments', text: 'Appointments', icon: FaCheckCircle },
    { to: '/teacher/students', text: 'Students', icon: FaUserGraduate },
    { to: '/teacher/messages', text: 'Messages', icon: FaEnvelope }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', text: 'Dashboard', icon: FaHome },
    { to: '/admin/teachers', text: 'Manage Teachers', icon: FaChalkboardTeacher },
    { to: '/admin/students', text: 'Manage Students', icon: FaUserGraduate },
    { to: '/admin/appointments', text: 'Appointment Reports', icon: FaClipboardList }
  ];

  const getLinks = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return adminLinks;
    if (currentUser.role === 'teacher') return teacherLinks;
    return studentLinks;
  };

  return (
    <div className={`${className} ${isOpen ? 'fixed inset-0 z-40 md:relative md:flex md:flex-shrink-0' : 'hidden md:flex md:flex-shrink-0'}`}>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={onClose}
        ></div>
      )}
      
      <div className={`${isOpen ? 'fixed inset-y-0 left-0 w-64 z-50 mt-16' : 'relative w-64 mt-16'} flex flex-col bg-gradient-to-b from-indigo-600 to-purple-700 pt-5 pb-4 shadow-xl`}>
        {/* Navigation */}
        <div className="mt-5 flex-1 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {/* Main Links */}
            {getLinks().map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => 
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'}`
                }
                onClick={isOpen ? onClose : null}
              >
                <link.icon className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300" />
                {link.text}
              </NavLink>
            ))}

            {/* Appointments Section (for teachers) */}
            {currentUser?.role === 'teacher' && (
              <div className="mt-1">
                <button
                  onClick={() => toggleSection('appointments')}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700 hover:text-white w-full"
                >
                  <FaCalendarAlt className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300" />
                  <span className="flex-1 text-left">Appointments</span>
                  <svg
                    className={`ml-3 h-5 w-5 transform ${expandedSections.appointments ? 'rotate-90' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {expandedSections.appointments && (
                  <div className="ml-8 mt-1 space-y-1">
                    <NavLink
                      to="/teacher/appointments/upcoming"
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700 hover:text-white"
                      onClick={isOpen ? onClose : null}
                    >
                      Upcoming
                    </NavLink>
                    <NavLink
                      to="/teacher/appointments/pending"
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700 hover:text-white"
                      onClick={isOpen ? onClose : null}
                    >
                      Pending Approval
                    </NavLink>
                    <NavLink
                      to="/teacher/appointments/history"
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700 hover:text-white"
                      onClick={isOpen ? onClose : null}
                    >
                      History
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            {/* Management Section (for admin) */}
            {currentUser?.role === 'admin' && (
              <div className="mt-1">
                <button
                  onClick={() => toggleSection('management')}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700 hover:text-white w-full"
                >
                  <FaUsers className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300" />
                  <span className="flex-1 text-left">Management</span>
                  <svg
                    className={`ml-3 h-5 w-5 transform ${expandedSections.management ? 'rotate-90' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {expandedSections.management && (
                  <div className="ml-8 mt-1 space-y-1">
                    <NavLink
                      to="/admin/management/add-teacher"
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700 hover:text-white"
                      onClick={isOpen ? onClose : null}
                    >
                      <FaUserPlus className="mr-2 h-4 w-4" />
                      Add Teacher
                    </NavLink>
                    <NavLink
                      to="/admin/management/approve-students"
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700 hover:text-white"
                      onClick={isOpen ? onClose : null}
                    >
                      <FaCheckCircle className="mr-2 h-4 w-4" />
                      Approve Students
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            {/* About and Contact Links */}
            <div className="mt-4">
              <NavLink
                to="/about"
                className={({ isActive }) => 
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'}`
                }
                onClick={isOpen ? onClose : null}
              >
                <FaInfoCircle className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300" />
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) => 
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md mt-1 ${isActive ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'}`
                }
                onClick={isOpen ? onClose : null}
              >
                <FaPhone className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300" />
                Contact
              </NavLink>
            </div>

            {/* Settings and Logout */}
            {currentUser && (
              <>
                <div className="mt-4 border-t border-indigo-700"></div>
                <NavLink
                  to="/settings"
                  className={({ isActive }) => 
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md mt-2 ${isActive ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'}`
                  }
                  onClick={isOpen ? onClose : null}
                >
                  <FaCog className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300" />
                  Settings
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700 hover:text-white w-full"
                >
                  <FaSignOutAlt className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300" />
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>

        {/* User profile */}
        {currentUser && (
          <div className="mt-auto px-4 py-3 border-t border-indigo-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center text-white">
                  {currentUser.role === 'teacher' ? (
                    <FaChalkboardTeacher className="h-6 w-6" />
                  ) : currentUser.role === 'admin' ? (
                    <FaUniversity className="h-6 w-6" />
                  ) : (
                    <FaUserGraduate className="h-6 w-6" />
                  )}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-white">
                  {currentUser.displayName || currentUser.email.split('@')[0]}
                </div>
                <div className="text-xs font-medium text-indigo-200">
                  {currentUser.role === 'admin' ? 'Administrator' : 
                   currentUser.role === 'teacher' ? 'Faculty' : 'Student'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}