import { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { FiArrowLeft, FiHome, FiClock, FiCalendar, FiMessageSquare, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiUser } from 'react-icons/fi';

export default function MyAppointments() {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    
    const q = query(
      collection(db, 'appointments'),
      where('studentId', '==', currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appointmentsData = [];
      snapshot.forEach(doc => {
        appointmentsData.push({ id: doc.id, ...doc.data() });
      });
      setAppointments(appointmentsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    });

    return () => unsubscribe();
  }, [currentUser]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800',
      approved: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800',
      rejected: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800',
      cancelled: 'bg-gradient-to-r from-gray-100 to-blue-100 text-gray-800'
    };
    
    const statusIcons = {
      pending: <FiClock className="mr-1" />,
      approved: <FiCheck className="mr-1" />,
      rejected: <FiX className="mr-1" />,
      cancelled: <FiX className="mr-1" />
    };
    
    return (
      <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
        {statusIcons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      setLoading(true);
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, { 
        status: 'cancelled',
        cancelledAt: new Date()
      });
      toast.success('Appointment cancelled successfully!');
    } catch (error) {
      toast.error('Error cancelling appointment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 mt-9 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with navigation */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 rounded-xl shadow-lg mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <FiUser className="text-white text-2xl mr-3" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white"> My Appointments</h1>
              <p className="text-blue-100 text-sm"> A simple and secure platform for managing students, teachers, and appointments with ease. </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-white hover:bg-indigo-700 rounded-full transition-colors"
              title="Go back"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate(currentUser ? '/student' : '/')}
              className="p-2 text-white hover:bg-indigo-700 rounded-full transition-colors"
              title="Go to dashboard"
            >
              <FiHome className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {appointments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments yet</h3>
              <p className="text-gray-500 mb-4">You haven't booked any appointments with teachers</p>
              <button
                onClick={() => navigate('/student/search-teachers')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
              >
                Find a Teacher
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Teacher</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map(appointment => (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full flex items-center justify-center">
                            <FiUser className="text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{appointment.teacherName}</div>
                            <div className="text-sm text-gray-500">{appointment.teacherDepartment}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiClock className="mr-1 text-indigo-500" />
                          {appointment.timeSlot}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate flex items-start">
                          <FiMessageSquare className="mr-2 mt-0.5 flex-shrink-0 text-indigo-500" />
                          {appointment.purpose}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => navigate('/student/messages', { state: { teacherId: appointment.teacherId } })}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                            disabled={loading}
                          >
                            Message
                          </button>
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="text-red-600 hover:text-red-900 transition-colors flex items-center"
                              disabled={loading}
                            >
                              <FiTrash2 className="mr-1" /> Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}