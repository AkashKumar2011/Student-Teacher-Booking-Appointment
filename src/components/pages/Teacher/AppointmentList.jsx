// src/components/teacher/AppointmentList.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useAuth } from '../../../context/AuthContext';
import { FaCalendarAlt, FaClock, FaUserGraduate, FaSpinner, FaInfoCircle, FaCheck, FaTimes, FaEllipsisV } from 'react-icons/fa';

export default function AppointmentList() {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'pending', 'approved', 'canceled'
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const q = query(
          collection(db, 'appointments'),
          where('teacherId', '==', currentUser.uid),
          where('status', '==', filter)
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
        
        // Sort by date
        appointmentsData.sort((a, b) => a.dateTime - b.dateTime);
        
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [currentUser.uid, filter]);

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
    setActionLoading(true);
    
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: status
      });
      
      // Update local state
      setAppointments(prev => prev.map(app => 
        app.id === appointmentId ? {...app, status} : app
      ));
      
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-purple-800">Appointment Requests</h2>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'pending'
              ? 'bg-purple-600 text-white'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'approved'
              ? 'bg-green-600 text-white'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('canceled')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'canceled'
              ? 'bg-red-600 text-white'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          Canceled
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-purple-600 text-4xl" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl">
          <FaInfoCircle className="text-purple-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No appointments found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {filter === 'pending' 
              ? "You have no pending appointment requests." 
              : `You have no ${filter} appointments.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(appointment => (
            <div 
              key={appointment.id} 
              className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex items-center mb-3 md:mb-0">
                  <div className="bg-purple-100 rounded-lg p-2 mr-4">
                    <FaCalendarAlt className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {formatDate(appointment.dateTime)}
                    </h3>
                    <p className="text-gray-600 flex items-center">
                      <FaClock className="mr-2 text-purple-500" />
                      {formatTime(appointment.dateTime)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-lg p-2 mr-4">
                    <FaUserGraduate className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {appointment.studentName}
                    </h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      appointment.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : appointment.status === 'canceled' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-purple-100 text-purple-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-700 mb-1">Purpose:</p>
                <p className="text-gray-600">{appointment.purpose}</p>
              </div>
              
              {filter === 'pending' && (
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => handleAction(appointment.id, 'approved')}
                    className="flex-1 flex items-center justify-center py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-70"
                    disabled={actionLoading}
                  >
                    <FaCheck className="mr-2" /> Approve
                  </button>
                  
                  <button
                    onClick={() => handleAction(appointment.id, 'canceled')}
                    className="flex-1 flex items-center justify-center py-2 px-4 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:from-red-600 hover:to-orange-700 transition-all disabled:opacity-70"
                    disabled={actionLoading}
                  >
                    <FaTimes className="mr-2" /> Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}