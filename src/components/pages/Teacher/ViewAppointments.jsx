import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { useAuth } from '../../context/AuthContext';

export default function ViewAppointments() {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const appointmentRef = ref(db, `appointments/booked/${currentUser.uid}`);

    const unsubscribe = onValue(appointmentRef, (snapshot) => {
      const data = snapshot.val();
      const loaded = [];
      for (let key in data) {
        loaded.push({ id: key, ...data[key] });
      }
      setAppointments(loaded);
    });

    return () => unsubscribe();
  }, [currentUser.uid]);

  const handleStatusChange = async (id, status) => {
    const db = getDatabase();
    const appointmentRef = ref(db, `appointments/booked/${currentUser.uid}/${id}`);
    try {
      await update(appointmentRef, { status });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gradient-to-tr from-blue-700 to-indigo-600 text-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Booked Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white text-black p-4 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <p><strong>Student:</strong> {appt.studentEmail}</p>
                <p><strong>Date:</strong> {appt.date}</p>
                <p><strong>Time:</strong> {appt.timeSlot}</p>
                <p><strong>Message:</strong> {appt.message}</p>
                <p><strong>Status:</strong> {appt.status || 'Pending'}</p>
              </div>
              <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => handleStatusChange(appt.id, 'Approved')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(appt.id, 'Cancelled')}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
