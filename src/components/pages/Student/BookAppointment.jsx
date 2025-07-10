import { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHome, FiCalendar, FiClock, FiMessageSquare, FiUser, FiBook } from 'react-icons/fi';

export default function BookAppointment() {
  const { currentUser } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Initialize teacher data from location state
  useEffect(() => {
    if (state?.teacher) {
      setTeacher(state.teacher);
    } else {
      // Redirect if no teacher data is provided
      navigate('/student/search-teachers');
    }
  }, [state, navigate]);

  // Fetch available time slots for the selected teacher
  useEffect(() => {
    if (!teacher?.id) return;

    const q = query(
      collection(db, 'teachers'),
      where('teacherId', '==', teacher.id)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const slots = [];
      snapshot.forEach(doc => {
        const slotData = doc.data();
        // Only show future time slots
        if (new Date(slotData.date) >= new Date()) {
          slots.push({
            id: doc.id,
            ...slotData
          });
        }
      });
      setAvailableSlots(slots);
    });
    
    return () => unsubscribe();
  }, [teacher]);

  const validateForm = () => {
    const errors = {};
    
    if (!date) errors.date = 'Please select a date';
    if (!timeSlot) errors.timeSlot = 'Please select a time slot';
    if (!purpose.trim()) errors.purpose = 'Please enter appointment purpose';
    if (purpose.length > 500) errors.purpose = 'Purpose should be less than 500 characters';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!teacher?.id) {
      toast.error('No teacher selected');
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        studentId: currentUser.uid,
        studentName: currentUser.displayName || currentUser.email,
        teacherId: teacher.id,
        teacherName: teacher.name,
        teacherDepartment: teacher.department,
        date,
        timeSlot,
        purpose,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      toast.success('Appointment requested successfully!');
      navigate('/student/my-appointments');
    } catch (error) {
      toast.error('Error requesting appointment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">No Teacher Selected</h2>
          <p className="text-gray-600 mb-6">Please select a teacher to book an appointment</p>
          <button
            onClick={() => navigate('/student/search-teachers')}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Browse Teachers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-600 rounded-lg hover:from-indigo-200 hover:to-blue-200 transition-all shadow-sm"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                <FiCalendar className="mr-3 text-indigo-600" />
                Book Appointment
              </h1>
              <p className="text-gray-600">Schedule a meeting with your teacher</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/student')}
            className="p-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-600 rounded-lg hover:from-indigo-200 hover:to-blue-200 transition-all shadow-sm"
          >
            <FiHome className="w-5 h-5" />
          </button>
        </div>
        
        {/* Teacher Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-md">
              <FiUser className="text-indigo-600 text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{teacher.name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-3 py-1 rounded-full text-xs flex items-center">
                  <FiBook className="mr-1" /> {teacher.department}
                </span>
                <span className="bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-800 px-3 py-1 rounded-full text-xs">
                  {teacher.subject}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Appointment Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700  items-center">
                <FiCalendar className="mr-2 text-indigo-500" /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className={`mt-1 block w-full px-4 py-2.5 border ${validationErrors.date ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
              />
              {validationErrors.date && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.date}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700  items-center">
                <FiClock className="mr-2 text-indigo-500" /> Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                required
                className={`mt-1 block w-full px-4 py-2.5 border ${validationErrors.timeSlot ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
              >
                <option value="">Select a time slot</option>
                {availableSlots.map((slot, index) => (
                  <option key={index} value={slot.timeSlot}>
                    {slot.timeSlot} ({new Date(slot.date).toLocaleDateString()})
                  </option>
                ))}
              </select>
              {validationErrors.timeSlot && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.timeSlot}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700  items-center">
                <FiMessageSquare className="mr-2 text-indigo-500" /> Purpose
              </label>
              <textarea
                rows={4}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
                className={`mt-1 block w-full px-4 py-2.5 border ${validationErrors.purpose ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                placeholder="Briefly describe the purpose of your appointment..."
              />
              <div className="flex justify-between items-center">
                {validationErrors.purpose && (
                  <p className="text-sm text-red-600">{validationErrors.purpose}</p>
                )}
                <span className={`text-xs ${purpose.length > 500 ? 'text-red-600' : 'text-gray-500'}`}>
                  {purpose.length}/500
                </span>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCalendar className="mr-2" /> Request Appointment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}