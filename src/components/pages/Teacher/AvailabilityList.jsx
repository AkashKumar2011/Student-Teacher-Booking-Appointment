// src/components/teacher/AvailabilityList.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useAuth } from '../../../context/AuthContext';
import { FaCalendarAlt, FaClock, FaTrash, FaSpinner, FaInfoCircle, FaPlus } from 'react-icons/fa';

export default function AvailabilityList() {
  const { currentUser } = useAuth();
  const [availabilities, setAvailabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const q = query(
          collection(db, 'availabilities'),
          where('teacherId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const availabilitiesData = [];
        
        querySnapshot.forEach(doc => {
          const data = doc.data();
          availabilitiesData.push({
            id: doc.id,
            ...data,
            startTime: data.startTime.toDate(),
            endTime: data.endTime.toDate(),
            createdAt: data.createdAt.toDate(),
          });
        });
        
        // Sort by start time
        availabilitiesData.sort((a, b) => a.startTime - b.startTime);
        setAvailabilities(availabilitiesData);
      } catch (error) {
        console.error('Error fetching availabilities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailabilities();
  }, [currentUser.uid]);

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

  const handleDelete = async (availabilityId) => {
    if (!window.confirm('Are you sure you want to delete this availability?')) return;
    
    setIsDeleting(availabilityId);
    
    try {
      await deleteDoc(doc(db, 'availabilities', availabilityId));
      setAvailabilities(prev => prev.filter(a => a.id !== availabilityId));
    } catch (error) {
      console.error('Error deleting availability:', error);
      alert('Failed to delete availability');
    } finally {
      setIsDeleting(null);
    }
  };

  // Calculate statistics
  const availableSlots = availabilities.filter(a => !a.booked).length;
  const bookedSlots = availabilities.filter(a => a.booked).length;
  const bookingRate = availabilities.length > 0 
    ? Math.round(bookedSlots / availabilities.length * 100) 
    : 0;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-purple-800">My Availability</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl p-4 shadow">
            <div className="text-3xl font-bold mb-1">{availabilities.length}</div>
            <div className="text-sm opacity-80">Total Slots</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 shadow">
            <div className="text-3xl font-bold mb-1">{availableSlots}</div>
            <div className="text-sm opacity-80">Available</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl p-4 shadow">
            <div className="text-3xl font-bold mb-1">{bookedSlots}</div>
            <div className="text-sm opacity-80">Booked</div>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-4 shadow">
            <div className="text-3xl font-bold mb-1">{bookingRate}%</div>
            <div className="text-sm opacity-80">Booking Rate</div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-purple-600 text-4xl" />
          </div>
        ) : availabilities.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl">
            <FaInfoCircle className="text-purple-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No availability slots</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              You haven't set any availability slots yet. Add slots to allow students to book appointments.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availabilities.map(availability => (
                <div 
                  key={availability.id} 
                  className={`border rounded-xl p-4 transition-all hover:shadow-md ${
                    availability.booked 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-purple-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-800">
                      {formatDate(availability.startTime)}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      availability.booked 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {availability.booked ? 'Booked' : 'Available'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <FaClock className="mr-2 text-purple-500 text-sm" />
                    <span>
                      {formatTime(availability.startTime)} - {formatTime(availability.endTime)}
                    </span>
                  </div>
                  
                  {availability.booked && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-700 font-medium">
                        Booked by: {availability.studentName || 'Student'}
                      </p>
                      {availability.purpose && (
                        <p className="text-xs text-gray-500 mt-1">
                          Purpose: {availability.purpose}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {!availability.booked && (
                    <button
                      onClick={() => handleDelete(availability.id)}
                      className="mt-3 w-full flex items-center justify-center py-1 px-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:from-red-600 hover:to-orange-700 transition-all disabled:opacity-70 text-sm"
                      disabled={isDeleting === availability.id}
                    >
                      {isDeleting === availability.id ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        <FaTrash className="mr-1" />
                      )}
                      Delete Slot
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}