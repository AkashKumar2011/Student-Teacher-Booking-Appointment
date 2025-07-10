import { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHome, FiSearch, FiUser, FiBook, FiCalendar, FiMail } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

export default function SearchTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'teachers'), where('isActive', '==', true));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const teachersData = [];
          snapshot.forEach(doc => {
            teachersData.push({ id: doc.id, ...doc.data() });
          });
          setTeachers(teachersData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (err) {
        setError('Failed to load teachers. Please try again later.');
        setLoading(false);
        console.error('Error fetching teachers:', err);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(teacher => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      (teacher.name?.toLowerCase().includes(term)) ||
      (teacher.department?.toLowerCase().includes(term)) ||
      (teacher.subjects?.some(subj => subj.toLowerCase().includes(term)))
    );
    
    const matchesDepartment = !departmentFilter || 
      teacher.department?.toLowerCase() === departmentFilter.toLowerCase();
    
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(
    teachers.map(teacher => teacher.department).filter(Boolean)
  )].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-600">Loading available teachers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 mt-9 p-4 md:p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-gradient-to-r from-red-100 to-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-red-600 text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate(currentUser ? '/dashboard' : '/')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              {currentUser ? 'Go to Dashboard' : 'Return Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 mt-9 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 rounded-xl shadow-lg mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <FiUser className="text-white text-2xl mr-3" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Find a Teacher</h1>
              <p className="text-blue-100 text-sm">Search and book appointments with available teachers</p>
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
              onClick={() => navigate(currentUser ? '/student' : '/')}
              className="p-2 text-white hover:bg-indigo-700 rounded-full transition-colors"
              title="Go to dashboard"
            >
              <FiHome className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, department or subject..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Teachers List */}
        {filteredTeachers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="text-indigo-600 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No teachers found</h3>
            <p className="text-gray-500 mb-4">
              {teachers.length === 0 
                ? "There are currently no active teachers in the system" 
                : "No teachers match your search criteria"}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setDepartmentFilter('');
              }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map(teacher => (
              <div key={teacher.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-indigo-600 text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {teacher.name}
                      </h3>
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Available
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center text-sm">
                      <FiBook className="text-indigo-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">
                        <span className="font-medium text-gray-700">Department:</span> {teacher.department}
                      </span>
                    </div>
                    
                    <div className="flex items-start text-sm">
                      <FiBook className="text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-700">Subjects:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {teacher.subjects?.map(subject => (
                            <span key={subject} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <FiMail className="text-indigo-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 truncate">
                        <span className="font-medium text-gray-700">Email:</span> {teacher.email}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => navigate(`/student/book-appointment/${teacher.id}`)}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center shadow-sm"
                    >
                      <FiCalendar className="mr-2" /> Book Appointment
                    </button>
                    <button
                      onClick={() => navigate(`/student/send-message/${teacher.id}`)}
                      className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center"
                    >
                      <FiMail className="mr-2" /> Message
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
}