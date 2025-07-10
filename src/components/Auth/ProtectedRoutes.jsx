// ProtectedRoutes.jsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


export function PrivateRoute({ children }) {
  const { currentUser, initialCheckComplete } = useAuth();
  if (!initialCheckComplete) return null;
  return currentUser ? children : <Navigate to="/login" replace />;
}

export function RoleRoute({ requiredRole, children }) {
  const { userData, initialCheckComplete } = useAuth();
  if (!initialCheckComplete) return null;
  return userData?.role === requiredRole
    ? children
    : <Navigate to="/unauthorized" replace />;
}

export const AdminRoute = ({ children }) =>
  <RoleRoute requiredRole="admin">{children}</RoleRoute>;

export const TeacherRoute = ({ children }) =>
  <RoleRoute requiredRole="teacher">{children}</RoleRoute>;




const StudentRoute = () => {
  const { currentUser, userData } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;
  if (userData?.role !== 'student') return <Navigate to="/unauthorized" />;

  return <Outlet />; // Renders nested routes inside /student
};

export default StudentRoute;
