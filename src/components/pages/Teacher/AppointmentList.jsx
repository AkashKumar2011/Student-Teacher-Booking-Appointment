// src/components/teacher/AppointmentList.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useAuth } from '../../../context/AuthContext';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaSpinner, 
  FaInfoCircle, 
  FaCheck, 
  FaTimes,
  FaFilter,
  FaUser,
  FaUserCircle
  
} from 'react-icons/fa';
import { FaU } from 'react-icons/fa6';

export default function AppointmentList() {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [actionLoading, setActionLoading] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const q = query(
          collection(db, 'appointments'),
          where('teacherId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const appointmentsData = [];
        
        querySnapshot.forEach(doc => {
          const data = doc.data();
          appointmentsData.push({
            id: doc.id,
            ...data,
            dateTime: data.dateTime.toDate(),
            createdAt: data.createdAt.toDate(),
          });
        });
        
        appointmentsData.sort((a, b) => b.dateTime - a.dateTime);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [currentUser.uid]);

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(app => app.status === filter);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const handleAction = async (appointmentId, status) => {
    setActionLoading(appointmentId);
    
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: status
      });
      
      setAppointments(prev => prev.map(app => 
        app.id === appointmentId ? {...app, status} : app
      ));
    } catch (error) {
      console.error('Error updating appointment:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const StatusBadge = ({ status }) => (
    <span className={`text-xs px-2 py-1 rounded-full ${
      status === 'approved' 
        ? 'bg-green-100 text-green-800' 
        : status === 'canceled' 
          ? 'bg-red-100 text-red-800' 
          : 'bg-purple-100 text-purple-800'
    }`}>
      {status}
    </span>
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with filter controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-800">Appointment Requests</h2>
          
          {/* Mobile filter dropdown */}
          <div className="relative md:hidden">
            <button 
              className="flex items-center px-4 py-2 border border-gray-500 text-white rounded-xl bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800 transition-all"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <FaFilter className="mr-2" /> Filter
            </button>
            
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                <button
                  onClick={() => { setFilter('all'); setShowFilterMenu(false); }}
                  className={`block w-full text-left px-4 py-2 ${
                    filter === 'all' ? 'bg-purple-200 text-purple-800' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Appointments
                </button>
                <button
                  onClick={() => { setFilter('pending'); setShowFilterMenu(false); }}
                  className={`block w-full text-left px-4 py-2 ${
                    filter === 'pending' ? 'bg-purple-200 text-purple-800' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => { setFilter('approved'); setShowFilterMenu(false); }}
                  className={`block w-full text-left px-4 py-2 ${
                    filter === 'approved' ? 'bg-green-200 text-green-800' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => { setFilter('canceled'); setShowFilterMenu(false); }}
                  className={`block w-full text-left px-4 py-2 ${
                    filter === 'canceled' ? 'bg-red-200 text-red-800' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Canceled
                </button>
              </div>
            )}
          </div>
          
          {/* Desktop filter buttons */}
          <div className="hidden md:flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base rounded-lg transition-all ${
                filter === 'pending'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                  : 'bg-purple-200 text-purple-700 hover:bg-purple-300'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base rounded-lg transition-all ${
                filter === 'approved'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  : 'bg-green-200 text-green-700 hover:bg-green-300'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('canceled')}
              className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base rounded-lg transition-all ${
                filter === 'canceled'
                  ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white'
                  : 'bg-red-200 text-red-700 hover:bg-red-300'
              }`}
            >
              Canceled
            </button>
          </div>
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-purple-600 text-4xl" />
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && filteredAppointments.length === 0 && (
          <div className="text-center py-12 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-2xl">
            <FaInfoCircle className="text-purple-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No appointments found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {filter === 'all' 
                ? "You have no appointments." 
                : `You have no ${filter} appointments.`}
            </p>
          </div>
        )}
        
       {/* Appointments grid - Responsive layout */}
        {!isLoading && filteredAppointments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.map(appointment => (
              <div 
                key={appointment.id} 
                className="bg-white flex flex-col rounded-xl shadow-lg p-4 sm:p-5 border-x-4 border-purple-500 hover:shadow-xl transition-shadow"
              >
                {/* Header with student info */}
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <FaUser className="text-white text-xl" />
                  </div>
                  
                  <div className="flex flex-col ml-3 flex-grow min-w-0">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {appointment.studentName}
                    </h3>
                    <p className="text-blue-600 text-sm truncate">
                      {appointment.studentEmail}
                    </p>
                  </div>
                  
                  <div className="ml-2">
                    <StatusBadge status={appointment.status} />
                  </div>
                </div>
                
                {/* Date/time section */}
                <div className="flex flex-col mb-4 pl-2">
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaCalendarAlt className="mr-2 text-purple-600 flex-shrink-0" />
                    <p className="text-sm sm:text-base text-gray-700 font-medium truncate">
                      {formatDate(appointment.dateTime)}
                    </p>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaClock className="mr-2 text-purple-600 flex-shrink-0" />
                    <p className="text-sm sm:text-base text-gray-700 font-medium">
                      {formatTime(appointment.dateTime)}
                    </p>
                  </div>
                </div>
                
                {/* Purpose section */}
                <div className="mb-4 bg-purple-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700 mb-1 text-sm sm:text-base">Purpose:</p>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {appointment.purpose || 'No purpose specified'}
                  </p>
                </div>
                
                {/* Message section */}
                {appointment.message && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-gray-700 mb-1 text-sm sm:text-base">Message:</p>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {appointment.message}
                    </p>
                  </div>
                )}
                
                {/* Action buttons - Responsive layout */}
                {appointment.status === 'pending' && (
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleAction(appointment.id, 'approved')}
                      className="flex-1 flex items-center justify-center py-2 px-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-70 text-sm"
                      disabled={actionLoading === appointment.id}
                    >
                      {actionLoading === appointment.id ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        <FaCheck className="mr-1" />
                      )}
                      Approve
                    </button>
                    
                    <button
                      onClick={() => handleAction(appointment.id, 'canceled')}
                      className="flex-1 flex items-center justify-center py-2 px-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:from-red-600 hover:to-orange-700 transition-all disabled:opacity-70 text-sm"
                      disabled={actionLoading === appointment.id}
                    >
                      {actionLoading === appointment.id ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        <FaTimes className="mr-1" />
                      )}
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}