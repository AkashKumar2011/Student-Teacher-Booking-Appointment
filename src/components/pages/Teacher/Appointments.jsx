import { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FaCheck, FaTimes, FaClock, FaArrowLeft, FaHome, FaCalendar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Appointments() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!currentUser) return;
    
    let q;
    if (filter === 'all') {
      q = query(collection(db, 'appointments'), where('teacherId', '==', currentUser.uid));
    } else {
      q = query(
        collection(db, 'appointments'),
        where('teacherId', '==', currentUser.uid),
        where('status', '==', filter)
      );
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appointmentsData = [];
      snapshot.forEach(doc => {
        appointmentsData.push({ id: doc.id, ...doc.data() });
      });
      setAppointments(appointmentsData);
    });

    return () => unsubscribe();
  }, [currentUser, filter]);

  const handleStatusChange = async (appointmentId, status) => {
    try {
      setLoading(true);
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, { 
        status,
        updatedAt: new Date()
      });
      toast.success(`Appointment ${status} successfully!`);
    } catch (error) {
      toast.error(`Error ${status} appointment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800',
      approved: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800',
      rejected: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
    };
    
    const statusIcons = {
      pending: <FaClock className="mr-1" />,
      approved: <FaCheck className="mr-1" />,
      rejected: <FaTimes className="mr-1" />
    };
    
    return (
      <span className={`px-3 py-1 inline-flex items-center text-sm font-semibold rounded-full ${statusClasses[status]}`}>
        {statusIcons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl mx-8 mt-12 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-indigo-700 to-blue-700">
        <div className="flex flex-row justify-between  gap-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FaCalendar className="mr-2 text-white" />
            Appointment Requests
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all"
            >
              <FaHome className='lg:text-2xl md:text-2xl sm:text-2xl' /> <span className="md:hidden sm:hidden lg:inline" >Home</span>
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'all' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            All ({appointments.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'pending' ? 'bg-white text-yellow-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            Pending ({appointments.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'approved' ? 'bg-white text-green-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            Approved ({appointments.filter(a => a.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'rejected' ? 'bg-white text-red-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            Rejected ({appointments.filter(a => a.status === 'rejected').length})
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No appointments found
                </td>
              </tr>
            ) : (
              appointments.map(appointment => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold">
                        {appointment.studentName.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{appointment.studentName}</div>
                        <div className="text-sm text-gray-500">{appointment.studentEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{appointment.date}</div>
                    <div className="text-sm text-gray-500">{appointment.timeSlot}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">{appointment.purpose}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(appointment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {appointment.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'approved')}
                          disabled={loading}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          <FaCheck className="mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'rejected')}
                          disabled={loading}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          <FaTimes className="mr-1" /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}