import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/config';
import { FiUsers, FiClock, FiCalendar, FiMail, FiPlus, FiCheckCircle, FiSettings, FiFileText } from 'react-icons/fi';
import { FaChalkboardTeacher } from 'react-icons/fa';

const AdminDashboard = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
  if (!user) navigate('/login');

  const stats = [
  { 
    title: "Total Teachers", 
    value: "24", 
    change: "+5%", 
    icon: <FaChalkboardTeacher className="text-3xl text-indigo-700" />,
    bgColor: "bg-gradient-to-br from-indigo-600 to-purple-700",
    textGradient: "bg-gradient-to-r from-indigo-200 to-purple-200",
    iconBg: "bg-gradient-to-br from-indigo-400 to-purple-500"
  },
  { 
    title: "Pending Approvals", 
    value: "12", 
    change: "+2", 
    icon: <FiClock className="text-3xl text-amber-700" />,
    bgColor: "bg-gradient-to-br from-amber-600 to-orange-700",
    textGradient: "bg-gradient-to-r from-amber-200 to-orange-200",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500"
  },
  { 
    title: "Today's Appointments", 
    value: "8", 
    change: "-1", 
    icon: <FiCalendar className="text-3xl text-blue-700" />,
    bgColor: "bg-gradient-to-br from-blue-600 to-cyan-700",
    textGradient: "bg-gradient-to-r from-blue-200 to-cyan-200",
    iconBg: "bg-gradient-to-br from-blue-400 to-cyan-500"
  },
  { 
    title: "Messages", 
    value: "5", 
    change: "+3", 
    icon: <FiMail className="text-3xl text-emerald-700" />,
    bgColor: "bg-gradient-to-br from-emerald-600 to-teal-700",
    textGradient: "bg-gradient-to-r from-emerald-200 to-teal-200",
    iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500"
  }
];

  const quickActions = [
    { 
      title: "Add Teacher", 
      path: "/admin/add-teacher", 
      icon: <FiPlus className="mr-2" />,
      color: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
    },
    { 
      title: "Approve Students", 
      path: "/admin/approve-students", 
      icon: <FiCheckCircle className="mr-2" />,
      color: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
    },
    { 
      title: "Manage Teachers", 
      path: "/admin/manage-teachers", 
      icon: <FiSettings className="mr-2" />,
      color: "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
    },
    { 
      title: "Generate Reports", 
      path: "/admin/reports", 
      icon: <FiFileText className="mr-2" />,
      color: "bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700"
    }
  ];

  const recentActivities = [
    { 
      action: "New teacher added: Dr. Sarah Johnson", 
      time: "10 minutes ago" 
    },
    { 
      action: "5 student applications approved", 
      time: "45 minutes ago" 
    },
    { 
      action: "System maintenance scheduled", 
      time: "2 hours ago" 
    },
    { 
      action: "New appointment booked with Dr. Smith", 
      time: "3 hours ago" 
    },
    { 
      action: "Password reset for teacher account", 
      time: "5 hours ago" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br mt-9 from-indigo-50 to-purple-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3 shadow-md">
                <FiUsers className="text-white" />
              </div>
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.displayName || 'Admin'}!</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 bg-opacity-80 backdrop-blur-sm">
            <p className="text-sm text-gray-600">Last login: Today at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`${stat.bgColor} rounded-xl shadow-lg p-4 md:p-6 flex items-center text-white`}
            >
              <div className="p-3 rounded-full bg-white bg-opacity-20 shadow-sm mr-4">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm md:text-base font-medium text-white text-opacity-90">{stat.title}</p>
                <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                <p className={`text-xs md:text-sm ${stat.change.startsWith('+') ? 'text-green-200' : 'text-red-200'}`}>
                  {stat.change} from yesterday
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-gray-100 bg-opacity-90 backdrop-blur-sm">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3 shadow-md">
              <FiSettings className="text-white" />
            </div>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <button 
                key={index}
                onClick={() => navigate(action.path)}
                className={`${action.color} text-white py-3 px-4 rounded-lg transition-all flex items-center justify-center text-sm md:text-base font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
              >
                {action.icon}
                {action.title}
              </button>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100 bg-opacity-90 backdrop-blur-sm">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3 shadow-md">
                <FiClock className="text-white" />
              </div>
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-full mr-3 shadow-sm">
                      <FiUsers className="text-indigo-600 text-sm" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100 bg-opacity-90 backdrop-blur-sm">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3 shadow-md">
                <FiCalendar className="text-white" />
              </div>
              Upcoming Events
            </h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
                <p className="font-medium text-blue-800">Staff Meeting</p>
                <p className="text-sm text-blue-600">Tomorrow, 10:00 AM</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 p-4 rounded-lg border-l-4 border-purple-500 shadow-sm">
                <p className="font-medium text-purple-800">Parent-Teacher Conference</p>
                <p className="text-sm text-purple-600">Friday, 2:00 PM</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500 shadow-sm">
                <p className="font-medium text-green-800">Training Workshop</p>
                <p className="text-sm text-green-600">Next Monday, 9:00 AM</p>
              </div>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border-l-4 border-amber-500 shadow-sm">
                <p className="font-medium text-amber-800">System Maintenance</p>
                <p className="text-sm text-amber-600">Next Wednesday, 11:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;