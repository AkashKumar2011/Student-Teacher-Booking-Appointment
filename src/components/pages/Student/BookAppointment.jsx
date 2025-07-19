// src/components/student/BookAppointment.jsx
import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useAuth } from '../../../context/AuthContext';
import { FaTimes, FaCalendarAlt, FaClock, FaComment } from 'react-icons/fa';

export default function BookAppointment({ teacher, onClose }) {
  const { currentUser } = useAuth();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!date || !time) {
      setError('Please select both date and time');
      return;
    }
    
    if (!purpose.trim()) {
      setError('Please enter appointment purpose');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const appointmentDateTime = new Date(`${date}T${time}`);
      
      if (isNaN(appointmentDateTime.getTime())) {
        setError('Invalid date/time selection');
        return;
      }
      
      await addDoc(collection(db, 'appointments'), {
        studentId: currentUser.uid,
        studentName: currentUser.displayName || 'Unknown Student',
        studentEmail: currentUser.email || 'No email',
        teacherId: teacher.id,
        teacherName: teacher.teacherName || 'Unknown Teacher',
        teacherDepartment: teacher.department || 'No department',
        dateTime: Timestamp.fromDate(appointmentDateTime),
        purpose: purpose.trim(),
        status: 'pending',
        createdAt: Timestamp.now()
      });
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError(`Failed to book appointment: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">
              Book Appointment with {teacher.teacherName || 'Teacher'}
            </h3>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        
        <div className="p-5">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {success ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Appointment Requested!</h4>
              <p className="text-gray-600">
                Your appointment request has been sent to {teacher.teacherName}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2  items-center">
                  <FaCalendarAlt className="mr-2 text-indigo-600" /> Date
                </label>
                <input
                  type="date"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2  items-center">
                  <FaClock className="mr-2 text-indigo-600" /> Time
                </label>
                <input
                  type="time"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2  items-center">
                  <FaComment className="mr-2 text-indigo-600" /> Purpose
                </label>
                <textarea
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="What is the purpose of this appointment?"
                  required
                  rows={4}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-70"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Request Appointment'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}