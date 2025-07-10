// src/components/Auth/StudentRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StudentRoute = () => {
  const { currentUser, userData } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;
  if (userData?.role !== 'student') return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default StudentRoute;
