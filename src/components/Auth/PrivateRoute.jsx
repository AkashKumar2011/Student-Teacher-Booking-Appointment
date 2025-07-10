// src/components/Auth/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = () => {
  const { currentUser, initialCheckComplete } = useAuth();

  if (!initialCheckComplete) return null;

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
