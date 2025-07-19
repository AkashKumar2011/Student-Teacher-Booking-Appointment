// src/components/student/SendMessage.jsx
import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useAuth } from '../../../context/AuthContext';
import { FaTimes, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

export default function SendMessage({ teacher, onClose }) {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!message.trim()) {
      setError('Please enter your message');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'messages'), {
        studentId: currentUser.uid,
        studentName: currentUser.displayName || currentUser.email || 'Unknown Student',
        teacherId: teacher.id,
        teacherName: teacher.teacherName || 'Unknown Teacher',
        message: message.trim(),
        createdAt: Timestamp.now(),
        read: false
      });
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(`Failed to send message: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-l from-green-500 to-emerald-600 p-5 text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">
              Message {teacher.teacherName || 'Teacher'}
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
              <h4 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h4>
              <p className="text-gray-600">
                Your message has been sent to {teacher.teacherName}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2  items-center">
                  <FaEnvelope className="mr-2 text-emerald-600" /> Your Message
                </label>
                <textarea
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  required
                  rows={5}
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
                  className="flex-1 py-3 px-4 bg-gradient-to-l from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-70 flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  <FaPaperPlane className="mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}