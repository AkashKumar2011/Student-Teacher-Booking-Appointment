import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiHome, 
  FiCheck, 
  FiX, 
  FiUser,
  FiMail,
  FiAward,
  FiBook,
  FiSearch,
  FiRefreshCw,
} from 'react-icons/fi';

const ApproveStudents = () => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingStudents = async () => {
      try {
        const q = query(collection(db, 'users'), where('status', '==', 'pending'));
        const querySnapshot = await getDocs(q);
        const students = [];
        querySnapshot.forEach((doc) => {
          students.push({ id: doc.id, ...doc.data() });
        });
        setPendingStudents(students);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching students: ' + error.message);
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchPendingStudents();
  }, []);

  const handleApprove = async (studentId) => {
    try {
      await updateDoc(doc(db, 'users', studentId), {
        status: 'approved'
      });
      setPendingStudents(pendingStudents.filter(student => student.id !== studentId));
      toast.success('Student approved successfully!');
    } catch (error) {
      toast.error('Error approving student: ' + error.message);
      console.error('Error approving student:', error);
    }
  };

  const handleReject = async (studentId) => {
    try {
      await updateDoc(doc(db, 'users', studentId), {
        status: 'rejected'
      });
      setPendingStudents(pendingStudents.filter(student => student.id !== studentId));
      toast.success('Student rejected successfully!');
    } catch (error) {
      toast.error('Error rejecting student: ' + error.message);
      console.error('Error rejecting student:', error);
    }
  };

  const filteredStudents = pendingStudents.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (student.name || '').toLowerCase().includes(searchLower) ||
      (student.email || '').toLowerCase().includes(searchLower) ||
      (student.studentId || '').toLowerCase().includes(searchLower) ||
      (student.department || '').toLowerCase().includes(searchLower)
    );
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 mt-9">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-l from-blue-500 to-indigo-500 text-white  hover:from-blue-600 hover:to-indigo-600 transition-colors px-6 py-4 rounded-xl shadow-lg mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <FiUser className="text-white text-2xl mr-3" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white flex items-center">
                Approve Students
              </h1>
              <p className="text-blue-100 text-sm">Review and approve pending student registrations</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-white hover:bg-indigo-700 rounded-full transition-colors"
              title="Go back"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="p-2 text-white hover:bg-indigo-700 rounded-full transition-colors"
              title="Go to dashboard"
            >
              <FiHome className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Refresh */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students by name, ID or department..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg flex items-center whitespace-nowrap shadow-md"
          >
            <FiRefreshCw className="mr-2" /> Refresh
          </button>
        </div>

        {/* Students List */}
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500">No pending student registrations found</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 text-indigo-600 hover:text-indigo-800 flex items-center justify-center mx-auto"
            >
              <FiRefreshCw className="mr-2" /> Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredStudents.map((student) => (
              <div 
                key={student.id} 
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-indigo-600 text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {student.name}
                      </h3>
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Pending Approval
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center text-sm">
                      <FiAward className="text-indigo-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">
                        <span className="font-medium text-gray-700">Student ID:</span> {student.studentId}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <FiMail className="text-indigo-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 truncate">
                        <span className="font-medium text-gray-700">Email:</span> {student.email}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <FiBook className="text-indigo-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">
                        <span className="font-medium text-gray-700">Department:</span> {student.department}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => handleApprove(student.id)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors flex items-center shadow-sm"
                    >
                      <FiCheck className="mr-2" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(student.id)}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-colors flex items-center shadow-sm"
                    >
                      <FiX className="mr-2" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveStudents;