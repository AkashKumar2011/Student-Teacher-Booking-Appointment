// src/components/Auth/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
  const { currentUser, userData } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;
  if (userData?.role !== 'admin') return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default AdminRoute;
