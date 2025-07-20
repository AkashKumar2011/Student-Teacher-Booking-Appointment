// src/components/teacher/ScheduleAppointment.jsx
import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useAuth } from '../../../context/AuthContext';
import { FaCalendarAlt, FaClock, FaPlus, FaInfoCircle } from 'react-icons/fa';

export default function   () {
  const { currentUser } = useAuth();
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateTime = () => {
    if (!date || !startTime || !endTime) {
      setError('Please fill all fields');
      return false;
    }
    
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    
    if (start >= end) {
      setError('End time must be after start time');
      return false;
    }
    
    if (start < new Date()) {
      setError('Cannot set availability in the past');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateTime()) return;
    
    setIsSubmitting(true);
    
    try {
      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${endTime}`);
      
      await addDoc(collection(db, 'availabilities'), {
        teacherId: currentUser.uid,
        teacherName: currentUser.displayName || currentUser.email || 'Teacher',
        startTime: Timestamp.fromDate(startDateTime),
        endTime: Timestamp.fromDate(endDateTime),
        createdAt: Timestamp.now(),
        booked: false
      });
      
      setSuccess(true);
      // Reset form
      setDate('');
      setStartTime('');
      setEndTime('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error setting availability:', error);
      setError(`Failed to set availability: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-purple-800">Set Your Availability</h2>
        
        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> Availability slot added successfully!
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 flex items-center">
                <FaCalendarAlt className="mr-2 text-purple-600" /> Date
              </label>
              <input
                type="date"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 flex items-center">
                <FaClock className="mr-2 text-purple-600" /> Start Time
              </label>
              <input
                type="time"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 flex items-center">
                <FaClock className="mr-2 text-purple-600" /> End Time
              </label>
              <input
                type="time"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all disabled:opacity-70"
              disabled={isSubmitting}
            >
              <FaPlus className="mr-2" />
              {isSubmitting ? 'Adding...' : 'Add Availability Slot'}
            </button>
          </div>
        </form>
        
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
            <FaInfoCircle className="mr-2" /> How it works
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <div className="bg-purple-500 rounded-full p-1 mt-1 mr-3 flex-shrink-0">
                <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center">
                  <span className="text-purple-500 text-xs font-bold">1</span>
                </div>
              </div>
              <span>Set your available time slots using the form above</span>
            </li>
            <li className="flex items-start">
              <div className="bg-purple-500 rounded-full p-1 mt-1 mr-3 flex-shrink-0">
                <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center">
                  <span className="text-purple-500 text-xs font-bold">2</span>
                </div>
              </div>
              <span>Students can see and book appointments during these slots</span>
            </li>
            <li className="flex items-start">
              <div className="bg-purple-500 rounded-full p-1 mt-1 mr-3 flex-shrink-0">
                <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center">
                  <span className="text-purple-500 text-xs font-bold">3</span>
                </div>
              </div>
              <span>You'll receive notifications for new bookings</span>
            </li>
            <li className="flex items-start">
              <div className="bg-purple-500 rounded-full p-1 mt-1 mr-3 flex-shrink-0">
                <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center">
                  <span className="text-purple-500 text-xs font-bold">4</span>
                </div>
              </div>
              <span>Manage appointments from the "Appointments" tab</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}