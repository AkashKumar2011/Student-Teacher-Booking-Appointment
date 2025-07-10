import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-hot-toast';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out: ' + error.message);
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-indigo-700 to-indigo-800 text-white shadow-lg">
        <div className="p-4 border-b border-indigo-600">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        
        <nav className="p-4 space-y-2">
          <Link 
            to="/admin" 
            className="block px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/add-teacher" 
            className="block px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Add Teacher
          </Link>
          <Link 
            to="/admin/approve-students" 
            className="block px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Approve Students
          </Link>
          <Link 
            to="/admin/manage-teachers" 
            className="block px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Manage Teachers
          </Link>
          <Link 
            to="/admin/appointments" 
            className="block px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Appointments
          </Link>
          <Link 
            to="/admin/messages" 
            className="block px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Messages
          </Link>
        </nav>
        
        <div className="p-4 border-t border-indigo-600 absolute bottom-0 w-64">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;