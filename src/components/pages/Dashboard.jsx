// src/pages/Dashboard.jsx
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    
    // Redirect based on user role
    if (currentUser.role === 'admin') {
      navigate('/admin');
    } else if (currentUser.role === 'teacher') {
      navigate('/teacher');
    } else {
      navigate('/student');
    }
  }, [currentUser, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
}