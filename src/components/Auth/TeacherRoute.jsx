
// src/components/Auth/TeacherRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function TeacherRoute({ children }) {
  const { currentUser } = useAuth();
  
  if (!currentUser || currentUser.role !== 'teacher') {
    return <Navigate to="/" replace />;
  }
  
  return children;
}