import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function AdminDashboard() {
  const { userData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('add-teacher');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-indigo-700 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {userData?.name || 'Admin'}</span>
            <button 
              onClick={logout}
              className="bg-white text-indigo-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md p-4">
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  to="add-teacher"
                  className={`block p-2 rounded-md ${activeTab === 'add-teacher' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('add-teacher')}
                >
                  Add Teacher
                </Link>
              </li>
              <li>
                <Link
                  to="manage-teachers"
                  className={`block p-2 rounded-md ${activeTab === 'manage-teachers' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('manage-teachers')}
                >
                  Manage Teachers
                </Link>
              </li>
              <li>
                <Link
                  to="approve-students"
                  className={`block p-2 rounded-md ${activeTab === 'approve-students' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('approve-students')}
                >
                  Approve Students
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}