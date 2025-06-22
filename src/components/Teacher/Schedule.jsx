// src/components/Teacher/Schedule.jsx
import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function Schedule() {
  const { currentUser } = useAuth();
  const [date, setDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlot, setNewSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    
    const q = query(
      collection(db, 'appointments'),
      where('teacherId', '==', currentUser.uid),
      where('status', '==', 'approved')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const slots = [];
      snapshot.forEach(doc => {
        slots.push(doc.data().timeSlot);
      });
      setBookedSlots(slots);
    });
    
    return () => unsubscribe();
  }, [currentUser]);

  const handleAddSlot = async () => {
    if (!newSlot || !date) {
      toast.error('Please select a date and time');
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'schedules'), {
        teacherId: currentUser.uid,
        date: date.toISOString().split('T')[0],
        timeSlot: newSlot,
        createdAt: new Date()
      });
      toast.success('Time slot added successfully!');
      setNewSlot('');
    } catch (error) {
      toast.error('Error adding time slot: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00 - ${hour + 1}:00`);
    }
    setTimeSlots(slots);
  };

  useEffect(() => {
    generateTimeSlots();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule Availability</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Select Date</h3>
          <DayPicker
            mode="single"
            selected={date}
            onSelect={setDate}
            className="border rounded-lg p-4"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Available Time Slots</h3>
          
          <div className="mb-4">
            <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-1">
              Add New Time Slot
            </label>
            <div className="flex gap-2">
              <select
                id="timeSlot"
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                className="flex-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot} disabled={bookedSlots.includes(slot)}>
                    {slot} {bookedSlots.includes(slot) ? '(Booked)' : ''}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddSlot}
                disabled={loading || !newSlot}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="text-md font-medium text-gray-700 mb-2">Your Available Slots</h4>
            <div className="space-y-2">
              {timeSlots.map((slot, index) => (
                <div key={index} className={`p-2 rounded ${bookedSlots.includes(slot) ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                  {slot} {bookedSlots.includes(slot) ? '(Booked)' : ''}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}