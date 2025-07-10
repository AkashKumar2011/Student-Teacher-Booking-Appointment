// src/components/Student/StudentDashboard.jsx
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiCalendar, 
  FiUser, 
  FiMessageSquare, 
  FiBook,
  FiClock,
  FiCheck,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    upcoming: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    if (!currentUser?.uid) return;
    
    const q = query(
      collection(db, 'appointments'),
      where('studentId', '==', currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date();
      let upcoming = 0;
      let pending = 0;
      let approved = 0;
      let rejected = 0;
      
      snapshot.forEach(doc => {
        const appt = doc.data();
        const apptDate = new Date(`${appt.date}T${appt.timeSlot.split('-')[0]}`);
        
        if (appt.status === 'pending') pending++;
        if (appt.status === 'approved') approved++;
        if (appt.status === 'rejected') rejected++;
        if (appt.status === 'approved' && apptDate > now) upcoming++;
      });
      
      setStats({ upcoming, pending, approved, rejected });
    });
    
    return () => unsubscribe();
  }, [currentUser]);

  const dashboardCards = [
    {
      title: "Upcoming Appointments",
      value: stats.upcoming,
      icon: <FiCalendar className="text-3xl text-indigo-100" />,
      bg: "bg-gradient-to-br from-indigo-600 to-purple-600",
      action: () => navigate('/student/my-appointments')
    },
    {
      title: "Pending Requests",
      value: stats.pending,
      icon: <FiClock className="text-3xl text-amber-100" />,
      bg: "bg-gradient-to-br from-amber-500 to-orange-500",
      action: () => navigate('/student/my-appointments')
    },
    {
      title: "Approved Appointments",
      value: stats.approved,
      icon: <FiCheck className="text-3xl text-green-100" />,
      bg: "bg-gradient-to-br from-green-500 to-emerald-500",
      action: () => navigate('/student/my-appointments?status=approved')
    },
    {
      title: "Rejected Requests",
      value: stats.rejected,
      icon: <FiX className="text-3xl text-red-100" />,
      bg: "bg-gradient-to-br from-red-500 to-pink-500",
      action: () => navigate('/student/my-appointments?status=rejected')
    }
  ];

  const quickActions = [
    {
      title: "Find Teachers",
      icon: <FiUser className="mr-3 text-indigo-600" />,
      action: () => navigate('/student/search-teachers'),
      bg: "bg-gradient-to-r from-indigo-100 to-blue-100 hover:from-indigo-200 hover:to-blue-200"
    },
    {
      title: "My Appointments",
      icon: <FiCalendar className="mr-3 text-purple-600" />,
      action: () => navigate('/student/my-appointments'),
      bg: "bg-gradient-to-r from-purple-100 to-fuchsia-100 hover:from-purple-200 hover:to-fuchsia-200"
    },
    {
      title: "Book Appointments",
      icon: <FiCalendar className="mr-3 text-blue-500" />,
      action: () => navigate('/student/book-appointment'),
      bg: "bg-gradient-to-r from-orange-100 to-fuchsia-100 hover:from-purple-200 hover:to-fuchsia-200"
    },
    {
      title: "Messages",
      icon: <FiMessageSquare className="mr-3 text-green-600" />,
      action: () => navigate('/student/message-system'),
      bg: "bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 mt-9 to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FiHome className="mr-3 text-indigo-600" />
              Student Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {currentUser?.firstName || currentUser?.email}</p>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          {dashboardCards.map((card, index) => (
            <div 
              key={index} 
              onClick={card.action}
              className={`${card.bg} text-white rounded-xl shadow-lg p-4 md:p-6 flex items-center cursor-pointer hover:shadow-xl transition-all`}
            >
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm shadow-sm mr-4">
                {card.icon}
              </div>
              <div>
                <p className="text-sm md:text-base font-medium text-white/90">{card.title}</p>
                <p className="text-xl md:text-2xl font-bold">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-white/20 backdrop-blur-sm">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <FiClock className="mr-2 text-indigo-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`${action.bg} text-gray-800 py-3 px-4 rounded-lg transition-all flex items-center justify-center text-sm md:text-base font-medium shadow-sm hover:shadow-md`}
              >
                {action.icon}
                {action.title}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-white/20 backdrop-blur-sm">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <FiBook className="mr-2 text-indigo-600" />
            Getting Started
          </h2>
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-full mr-3 shadow-sm">
                  <FiUser className="text-indigo-600 text-sm" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Find and book appointments with your teachers</p>
                  <button
                    onClick={() => navigate('/student/search-teachers')}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Browse Teachers →
                  </button>
                </div>
              </div>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-2 rounded-full mr-3 shadow-sm">
                  <FiMessageSquare className="text-blue-600 text-sm" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Communicate with your teachers via messages</p>
                  <button
                    onClick={() => navigate('/student/message-system')}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Messages →
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-2 rounded-full mr-3 shadow-sm">
                  <FiCalendar className="text-green-600 text-sm" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Manage your upcoming appointments</p>
                  <button
                    onClick={() => navigate('/student/my-appointments')}
                    className="mt-2 text-sm text-green-600 hover:text-green-800"
                  >
                    View Appointments →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}