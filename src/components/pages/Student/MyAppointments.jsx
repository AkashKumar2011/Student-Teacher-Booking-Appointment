// src/components/student/MyAppointments.jsx
import { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc,
  orderBy,
  terminate
} from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { 
  FaArrowLeft, 
  FaHome,
  FaCalendar,
  FaClock,
  FaUser,
  FaCheck, 
  FaTimes, 
  FaTrash,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaSync,
  FaInbox,
  FaBook,
  FaPen
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import SendMessage from './SendMessage';

export default function MyAppointments() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);


  // Updated useEffect hook with safe sorting
useEffect(() => {
  if (!currentUser) return;
  
  setLoading(true);
  const q = query(
    collection(db, 'appointments'),
    where('studentId', '==', currentUser.uid),
    // orderBy('date', 'desc')
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const appointmentsData = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const formattedDate = data.date instanceof Date 
        ? data.date.toISOString().split('T')[0]
        : data.date;
      
      appointmentsData.push({ 
        id: doc.id, 
        ...data,
        date: formattedDate
      });
    });
    
    // Safe client-side sorting
    appointmentsData.sort((a, b) => {
      // Primary sort by date (descending)
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      
      // Secondary sort by timeSlot (descending) with fallback
      const timeA = a.timeSlot || "00:00-00:00";
      const timeB = b.timeSlot || "00:00-00:00";
      
      return timeB.split('-')[0].localeCompare(timeA.split('-')[0]);
    });
    
    setAppointments(appointmentsData);
    setLoading(false);
    setIsRefreshing(false);
  }, (error) => {
    console.error("Firestore error:", error);
    toast.error('Error loading appointments: ' + error.message);
    setLoading(false);
    setIsRefreshing(false);
  });

  return () => unsubscribe();
}, [currentUser]);


  // Set initial filter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status && ['pending', 'approved', 'rejected', 'cancelled', 'upcoming'].includes(status)) {
      setStatusFilter(status === 'upcoming' ? 'approved' : status);
    }
  }, [location]);

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      setLoading(true);
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, { 
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      });
      toast.success('Appointment cancelled successfully!');
    } catch (error) {
      toast.error('Error cancelling appointment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-gradient-to-r from-amber-100 to-orange-100 text-orange-800',
      approved: 'bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800',
      rejected: 'bg-gradient-to-r from-red-100 to-rose-100 text-rose-800',
      cancelled: 'bg-gradient-to-r from-gray-100 to-slate-100 text-slate-800'
    };
    
    const statusIcons = {
      pending: <FaClock className="mr-1" />,
      approved: <FaCheck className="mr-1" />,
      rejected: <FaTimes className="mr-1" />,
      cancelled: <FaTimes className="mr-1" />
    };
    
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full flex items-center ${statusClasses[status]}`}>
        {statusIcons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };


  const isUpcoming = (appointment) => {
    if (appointment.status !== 'approved') return false;
    const now = new Date();
    try {
      const [startTime] = appointment.timeSlot.split('-');
      const apptDate = new Date(`${appointment.dateTime}T${startTime}`);
      return apptDate > now;
    } catch {
      return false;
    }
  };

  // Filter appointments based on search term and status
  const filteredAppointments = appointments.filter(appointment => {
    // Apply status filter
    if (statusFilter !== 'all' && appointment.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        appointment.teacherName?.toLowerCase().includes(term) ||
        appointment.teacherDepartment?.toLowerCase().includes(term) ||
        appointment.purpose?.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 rounded-2xl shadow-lg mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="bg-white/20 p-3 rounded-xl mr-4">
              <FaCalendar className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">My Appointments</h1>
              <p className="text-blue-100 text-sm">Manage your scheduled appointments with teachers</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors"
              title="Go back"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/student')}
              className="p-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors"
              title="Go to dashboard"
            >
              <FaHome className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by teacher, department or purpose..."
                className="pl-10 w-full px-4 py-3 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center"
              >
                <FaFilter className="mr-2" />
                Filters {showFilters ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
              </button>
              
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className={`px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center ${
                  isRefreshing ? 'opacity-75' : 'hover:from-green-600 hover:to-emerald-700'
                } transition-colors`}
              >
                {isRefreshing ? (
                  <FaSync className="animate-spin mr-2" />
                ) : (
                  <FaSync className="mr-2" />
                )}
                Refresh
              </button>
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-indigo-100 grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-3 rounded-xl text-sm ${
                  statusFilter === 'all' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Appointments
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-3 rounded-xl text-sm flex items-center justify-center ${
                  statusFilter === 'pending' 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
              >
                <FaClock className="mr-2" /> Pending
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-4 py-3 rounded-xl text-sm flex items-center justify-center ${
                  statusFilter === 'approved' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                <FaCheck className="mr-2" /> Approved
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-4 py-3 rounded-xl text-sm flex items-center justify-center ${
                  statusFilter === 'rejected' 
                    ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                <FaTimes className="mr-2" /> Rejected
              </button>
            </div>
          )}
        </div>
        
        {/* Appointments List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendar className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments found</h3>
              <p className="text-gray-500 mb-4">
                {appointments.length === 0 
                  ? "You haven't booked any appointments yet" 
                  : "No appointments match your search criteria"}
              </p>
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md mr-3"
              >
                Clear Filters
              </button>
              <button
                onClick={() => navigate('/student/find-teachers')}
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all"
              >
                Find a Teacher
              </button>
            </div>
          ) : (
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Teacher</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map(appointment => (
                    <tr 
                      key={appointment.id} 
                      className={`hover:bg-indigo-50 transition-colors ${isUpcoming(appointment) ? 'bg-blue-50' : ''}`}
                      id={`appt-${appointment.id}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{appointment.teacherName}</div>
                            <div className="text-sm text-gray-500">{appointment.teacherDepartment}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm  text-gray-600 flex items-center">
                          <FaCalendar className="mr-1 text-indigo-500" />            
                          {appointment.dateTime.toDate().toLocaleDateString()}

                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FaClock className="mr-1 text-indigo-500" />                       
                          {appointment.dateTime.toDate().toLocaleTimeString()}
                        </div>
                        {isUpcoming(appointment) && (
                          <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Upcoming
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate flex items-start">
                          <FaPen className="mr-2 mt-0.5 flex-shrink-0 text-indigo-500" />
                          {appointment.purpose}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => navigate(`/student/messages?teacherId=${appointment.teacherId}`)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                            disabled={loading}
                          >
                            Message
                          </button>
                          {(appointment.status === 'pending' || (appointment.status === 'approved' && isUpcoming(appointment))) && (
                            <button
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="text-red-600 hover:text-red-900 transition-colors flex items-center"
                              disabled={loading}
                            >
                              <FaTrash className="mr-1" /> Cancel
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
          
          {/* Mobile View */}
          {!loading && filteredAppointments.length > 0 && (
            <div className="md:hidden p-4">
              {filteredAppointments.map(appointment => (
                <div 
                  key={appointment.id} 
                  className="bg-white rounded-2xl shadow-md p-5 mb-4 border border-indigo-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full w-12 h-12 flex items-center justify-center mr-3">
                      <FaUser className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{appointment.teacherName}</h3>
                      <p className="text-sm text-gray-500">{appointment.teacherDepartment}</p>
                    </div>
                    <div className="ml-auto">
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <FaCalendar className="mr-2 text-indigo-500" />
                      {appointment.dateTime.toDate().toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaClock className="mr-2 text-indigo-500" />
                      {appointment.dateTime.toDate().toLocaleTimeString()}
                    </div>
                    {isUpcoming(appointment) && (
                      <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Upcoming
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-gray-600">{appointment.purpose}</p>
                  </div>
                  
                  <div className="flex space-x-3">
                    {/* <button
                      onClick={() => navigate(`/student/messages?teacherId=${appointment.teacherId}`)}
                      className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                    >
                      Message
                    </button> */}
                    
{/*                     
                      <SendMessage 
                        // teacherId={appointment.teacherId}
                        appointment={appointment}
                        onClose={() => setShowBookModal(false)}
                      >message</SendMessage> */}
                    <button
                      onClick={() => navigate('/student/send-message', { 
                        state: { 
                          teacher: {
                            id: appointment.teacherId,
                            name: appointment.teacherName
                          }
                        } 
                      })}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors"
                      disabled={loading}
                    >
                      Message
                    </button>

                    {(appointment.status === 'pending' || (appointment.status === 'approved' && isUpcoming(appointment))) && (
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="flex-1 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 transition-all flex items-center justify-center"
                      >
                        <FaTrash className="mr-1" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl shadow p-4">
            <div className="text-sm">Total Appointments</div>
            <div className="text-2xl font-bold">{appointments.length}</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl shadow p-4">
            <div className="text-sm">Pending</div>
            <div className="text-2xl font-bold">
              {appointments.filter(a => a.status === 'pending').length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl shadow p-4">
            <div className="text-sm">Approved</div>
            <div className="text-2xl font-bold">
              {appointments.filter(a => a.status === 'approved').length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-xl shadow p-4">
            <div className="text-sm">Rejected/Cancelled</div>
            <div className="text-2xl font-bold">
              {appointments.filter(a => a.status === 'rejected' || a.status === 'cancelled').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}