import { useState, useEffect } from 'react';
import { db } from '../../../firebase/config'; // Adjust the import path as necessary
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export default function ApproveStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'students'),
      where('approved', '==', false)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentsData = [];
      snapshot.forEach(doc => {
        studentsData.push({ id: doc.id, ...doc.data() });
      });
      setStudents(studentsData);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (studentId) => {
    try {
      setLoading(true);
      const studentRef = doc(db, 'students', studentId);
      await updateDoc(studentRef, { 
        approved: true,
        approvedAt: new Date() 
      });
      toast.success('Student approved successfully!');
    } catch (error) {
      toast.error('Error approving student: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (studentId) => {
    if (!window.confirm('Are you sure you want to reject this student?')) return;
    
    try {
      setLoading(true);
      const studentRef = doc(db, 'students', studentId);
      await updateDoc(studentRef, { 
        approved: false,
        status: 'rejected' 
      });
      toast.success('Student rejected successfully!');
    } catch (error) {
      toast.error('Error rejecting student: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Approve Student Registrations</h2>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{student.studentId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{student.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleApprove(student.id)}
                        disabled={loading}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(student.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No pending student approvals
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}