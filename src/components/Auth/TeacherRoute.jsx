// src/components/Auth/TeacherRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TeacherRoute = () => {
  const { currentUser, userData } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;
  if (userData?.role !== 'teacher') return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default TeacherRoute;
