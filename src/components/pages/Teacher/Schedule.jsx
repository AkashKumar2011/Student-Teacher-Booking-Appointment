import { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { FaCalendarAlt, FaTrash, FaPlus, FaArrowLeft, FaHome } from 'react-icons/fa';
import { format, addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function Schedule() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlot, setNewSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('teacherId', '==', currentUser.uid),
      where('status', '==', 'approved')
    );
    
    const unsubscribeAppointments = onSnapshot(appointmentsQuery, (snapshot) => {
      const slots = [];
      snapshot.forEach(doc => {
        slots.push(doc.data().timeSlot);
      });
      setBookedSlots(slots);
    });

    const slotsQuery = query(
      collection(db, 'schedules'),
      where('teacherId', '==', currentUser.uid)
    );
    
    const unsubscribeSlots = onSnapshot(slotsQuery, (snapshot) => {
      const slotsData = [];
      snapshot.forEach(doc => {
        slotsData.push({ id: doc.id, ...doc.data() });
      });
      setAvailableSlots(slotsData);
    });
    
    return () => {
      unsubscribeAppointments();
      unsubscribeSlots();
    };
  }, [currentUser]);

  const handleAddSlot = async () => {
    if (!newSlot || !date) {
      toast.error('Please select a date and time');
      return;
    }
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    const slotExists = availableSlots.some(
      slot => slot.date === formattedDate && slot.timeSlot === newSlot
    );
    
    if (slotExists) {
      toast.error('This time slot is already added');
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'schedules'), {
        teacherId: currentUser.uid,
        date: formattedDate,
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

  const handleDeleteSlot = async (slotId) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'schedules', slotId));
      toast.success('Time slot deleted successfully!');
    } catch (error) {
      toast.error('Error deleting time slot: ' + error.message);
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

  const getSlotsForSelectedDate = () => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return availableSlots.filter(slot => slot.date === formattedDate);
  };

  useEffect(() => {
    generateTimeSlots();
  }, []);

  const disabledDays = [
    { from: new Date(2000, 0, 1), to: addDays(new Date(), -1) }
  ];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl mt-12 mx-8 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="flex flex-col justify-between sm:flex-row  items-start gap-4">
          <h2 className="text-xl lg:text-3xl md:text-2xl font-bold text-white flex items-center gap-2">
            <FaCalendarAlt /> Schedule Availability
          </h2>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all"
          >
            <FaHome className='lg:text-2xl md:text-2xl sm:text-2xl' /> <span className="md:hidden  lg:inline" >Home</span>
          </button>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Select Date</h3>
          <div className="flex justify-center bg-white p-4 rounded-xl shadow-sm">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={disabledDays}
              modifiers={{
                hasSlots: availableSlots.map(slot => new Date(slot.date))
              }}
              modifiersStyles={{
                hasSlots: {
                  border: '2px solid #4f46e5',
                  borderRadius: '50%'
                }
              }}
            />
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Available Slots on {format(date, 'MMMM d, yyyy')}</h3>
            {getSlotsForSelectedDate().length === 0 ? (
              <p className="text-gray-500">No slots available for this date</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getSlotsForSelectedDate().map((slot) => (
                  <div key={slot.id} className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg flex justify-between items-center shadow">
                    <span className="font-medium">
                      {slot.timeSlot} {bookedSlots.includes(slot.timeSlot) && '(Booked)'}
                    </span>
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      disabled={loading || bookedSlots.includes(slot.timeSlot)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Add New Time Slot</h3>
          
          <div className="mb-6">
            <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-1">
              Select Time Slot
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setNewSlot(slot)}
                  disabled={bookedSlots.includes(slot)}
                  className={`py-2 px-3 rounded-md text-sm font-medium transition-all ${newSlot === slot ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white' : bookedSlots.includes(slot) ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 cursor-not-allowed' : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300'}`}
                >
                  {slot} {bookedSlots.includes(slot) && '(Booked)'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label htmlFor="selectedSlot" className="block text-sm font-medium text-gray-700 mb-1">
                  Selected Time Slot
                </label>
                <input
                  id="selectedSlot"
                  type="text"
                  value={newSlot || ''}
                  readOnly
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSlot}
                disabled={loading || !newSlot}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  'Adding...'
                ) : (
                  <>
                    <FaPlus className="mr-1" /> Add Slot
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Upcoming Booked Appointments</h3>
            {bookedSlots.length === 0 ? (
              <p className="text-gray-500">No upcoming booked appointments</p>
            ) : (
              <div className="space-y-2">
                {availableSlots
                  .filter(slot => bookedSlots.includes(slot.timeSlot) && new Date(slot.date) >= new Date())
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 5)
                  .map((slot, index) => (
                    <div key={index} className="bg-gradient-to-r from-red-50 to-pink-50 p-3 rounded-lg shadow">
                      <div className="font-medium text-red-800">
                        {format(new Date(slot.date), 'MMMM d, yyyy')} - {slot.timeSlot}
                      </div>
                      <div className="text-sm text-red-600">Booked by student</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}