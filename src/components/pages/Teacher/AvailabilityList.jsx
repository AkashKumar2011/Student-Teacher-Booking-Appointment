// src/components/teacher/AvailabilityList.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useAuth } from '../../../context/AuthContext';
import { FaCalendarAlt, FaClock, FaTrash, FaSpinner, FaInfoCircle, FaUserGraduate } from 'react-icons/fa';

export default function AvailabilityList() {
  const { currentUser } = useAuth();
  const [availabilities, setAvailabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const q = query(
          collection(db, 'availabilities'),
          where('teacherId', '==', currentUser.uid),
          where('booked', '==', false)
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
    
    setIsDeleting(true);
    
    try {
      await deleteDoc(doc(db, 'availabilities', availabilityId));
      setAvailabilities(prev => prev.filter(a => a.id !== availabilityId));
    } catch (error) {
      console.error('Error deleting availability:', error);
      alert('Failed to delete availability');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-purple-800">My Availability</h2>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-purple-600 text-4xl" />
        </div>
      ) : availabilities.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl">
          <FaInfoCircle className="text-purple-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No availability slots</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            You haven't set any availability slots yet. Go to "Set Availability" to add slots.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {availabilities.map(availability => (
            <div 
              key={availability.id} 
              className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center mb-3 md:mb-0">
                  <div className="bg-purple-100 rounded-lg p-2 mr-4">
                    <FaCalendarAlt className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {formatDate(availability.startTime)}
                    </h3>
                    <p className="text-gray-600 flex items-center">
                      <FaClock className="mr-2 text-purple-500" />
                      {formatTime(availability.startTime)} - {formatTime(availability.endTime)}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(availability.id)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:from-red-600 hover:to-orange-700 transition-all disabled:opacity-70"
                  disabled={isDeleting}
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Availability Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {availabilities.length}
            </div>
            <div className="text-gray-600">Available Slots</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {availabilities.filter(a => a.booked).length}
            </div>
            <div className="text-gray-600">Booked Slots</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {availabilities.length > 0 
                ? Math.round(availabilities.filter(a => a.booked).length / availabilities.length * 100) 
                : 0}%
            </div>
            <div className="text-gray-600">Booking Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}