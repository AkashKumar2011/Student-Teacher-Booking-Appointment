// src/pages/AdminDashboard.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/UI/Sidebar';

export default function AdminDashboard() {
  return (
    <div className="flex">
      <Sidebar className="hidden md:flex md:flex-shrink-0" />
      <div className="flex-1 overflow-hidden">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}