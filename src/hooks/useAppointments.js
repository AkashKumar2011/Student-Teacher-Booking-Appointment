// src/hooks/useAppointments.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export function useAppointments(userId, role) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    let q;
    if (role === 'teacher') {
      q = query(
        collection(db, 'appointments'),
        where('teacherId', '==', userId)
      );
    } else if (role === 'student') {
      q = query(
        collection(db, 'appointments'),
        where('studentId', '==', userId)
      );
    } else {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appointmentsData = [];
      snapshot.forEach(doc => {
        appointmentsData.push({ id: doc.id, ...doc.data() });
      });
      setAppointments(appointmentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, role]);

  return { appointments, loading };
}