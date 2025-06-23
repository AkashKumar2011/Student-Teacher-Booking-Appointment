// src/components/Student/BookAppointment.jsx
import { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function BookAppointment({ teacher }) {
  const { currentUser } = useAuth();
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (!teacher?.id) return;
    
    const q = query(
      collection(db, 'schedules'),
      where('teacherId', '==', teacher.id)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const slots = [];
      snapshot.forEach(doc => {
        slots.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setAvailableSlots(slots);
    });
    
    return () => unsubscribe();
  }, [teacher]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!date || !timeSlot || !purpose) {
      toast.error('Please fill all fields');
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        studentId: currentUser.uid,
        studentName: currentUser.displayName || currentUser.email,
        teacherId: teacher.id,
        teacherName: teacher.name,
        date,
        timeSlot,
        purpose,
        status: 'pending',
        createdAt: new Date()
      });
      toast.success('Appointment requested successfully!');
      setDate('');
      setTimeSlot('');
      setPurpose('');
    } catch (error) {
      toast.error('Error requesting appointment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Appointment with {teacher?.name}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">Time Slot</label>
          <select
            id="timeSlot"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a time slot</option>
            {availableSlots.map((slot, index) => (
              <option key={index} value={slot.timeSlot}>
                {slot.timeSlot}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Purpose</label>
          <textarea
            id="purpose"
            rows={3}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Briefly describe the purpose of your appointment"
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Request Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
}