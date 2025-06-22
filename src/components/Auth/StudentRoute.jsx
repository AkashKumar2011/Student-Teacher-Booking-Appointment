
// src/components/Auth/StudentRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function StudentRoute({ children }) {
  const { currentUser } = useAuth();
  
  if (!currentUser || currentUser.role !== 'student') {
    return <Navigate to="/" replace />;
  }
  
  return children;
}