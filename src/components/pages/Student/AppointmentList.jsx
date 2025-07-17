// src/components/student/AppointmentList.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useAuth } from '../../../context/AuthContext';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUserTie, 
  FaSpinner, 
  FaInfoCircle,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

export default function AppointmentList() {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsRefreshing(true);
        let q;
        if (filter === 'all') {
          q = query(
            collection(db, 'appointments'),
            where('studentId', '==', currentUser.uid),
            orderBy('dateTime', 'desc')
          );
        } else {
          q = query(
            collection(db, 'appointments'),
            where('studentId', '==', currentUser.uid),
            where('status', '==', filter),
            orderBy('dateTime', 'desc')
          );
        }
        
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
        
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
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

  const getStatusClass = (status) => {
    switch(status) {
      case 'approved': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800';
      case 'pending': return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800';
      case 'canceled': return 'bg-gradient-to-r from-red-100 to-rose-100 text-rose-800';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-slate-800';
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      appt.teacherName?.toLowerCase().includes(term) ||
      appt.department?.toLowerCase().includes(term) ||
      appt.purpose?.toLowerCase().includes(term)
    );
  });

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-indigo-800">My Appointments</h2>
        
        <div className="flex gap-2">
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className={`px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center ${
              isRefreshing ? 'opacity-75' : 'hover:from-indigo-700 hover:to-purple-700'
            } transition-all`}
          >
            {isRefreshing ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : null}
            Refresh
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center hover:from-blue-700 hover:to-indigo-800 transition-all"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>
      </div>
      
      {/* Search & Filters */}
      <div className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl p-4 shadow-sm">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by teacher, department or purpose..."
            className="w-full p-4 pl-10 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-3 rounded-xl ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-3 rounded-xl ${
                filter === 'pending'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-white text-blue-700 hover:bg-blue-50'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-3 rounded-xl ${
                filter === 'approved'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                  : 'bg-white text-green-700 hover:bg-green-50'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('canceled')}
              className={`px-4 py-3 rounded-xl ${
                filter === 'canceled'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
                  : 'bg-white text-red-700 hover:bg-red-50'
              }`}
            >
              Canceled
            </button>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
          <FaInfoCircle className="text-indigo-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No appointments found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {filter === 'all' 
              ? "You haven't booked any appointments yet." 
              : `You have no ${filter} appointments.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAppointments.map(appointment => (
            <div 
              key={appointment.id} 
              className="bg-white rounded-2xl shadow-lg p-5 border border-indigo-100 overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 h-full w-2 bg-gradient-to-b from-indigo-500 to-purple-600"></div>
              
              <div className="ml-3 flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 rounded-lg p-3 mr-4">
                      <FaCalendarAlt className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {formatDate(appointment.dateTime)}
                      </h3>
                      <p className="text-gray-600 flex items-center">
                        <FaClock className="mr-2 text-indigo-500" />
                        {formatTime(appointment.dateTime)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-lg p-3 mr-4">
                    <FaUserTie className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {appointment.teacherName}
                    </h3>
                    <span className={`text-sm px-3 py-1 rounded-full ${getStatusClass(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <p className="font-medium text-gray-700 mb-1">Purpose:</p>
                <p className="text-gray-600">{appointment.purpose}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}