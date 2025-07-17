import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiHome, 
  FiEdit2, 
  FiTrash2, 
  FiPlus, 
  FiSearch, 
  FiRefreshCw, 
  FiEye, 
  FiEyeOff,
  FiSave,
  FiX,
  FiUser,
  FiBook,
  FiPhone,
  FiMail,
  FiLock,
  FiAward,
  FiBriefcase
} from 'react-icons/fi';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    mobileNo: '',
    teacherId: '',
    department: '',
    subjects: [],
    status: 'active'
  });
  const [showPassword, setShowPassword] = useState({});
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const navigate = useNavigate();

  const departments = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History'
  ];

  const allSubjects = {
    'Computer Science': ['Data Structures', 'Algorithms', 'Database Systems', 'Web Development'],
    'Mathematics': ['Calculus', 'Linear Algebra', 'Discrete Mathematics', 'Statistics'],
    'Physics': ['Classical Mechanics', 'Quantum Physics', 'Thermodynamics', 'Electromagnetism'],
    'Chemistry': ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry'],
    'Biology': ['Genetics', 'Microbiology', 'Biochemistry', 'Ecology'],
    'English': ['Literature', 'Creative Writing', 'Linguistics', 'Technical Writing'],
    'History': ['World History', 'European History', 'American History', 'Ancient Civilizations']
  };

  // Update available subjects when department changes
  useEffect(() => {
    if (editFormData.department) {
      setAvailableSubjects(allSubjects[editFormData.department] || []);
      setSelectedSubject('');
    } else {
      setAvailableSubjects([]);
    }
  }, [editFormData.department]);

  // Fetch teachers from Firestore
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'teachers'));
      const teachersList = [];
      querySnapshot.forEach((doc) => {
        teachersList.push({ id: doc.id, ...doc.data() });
      });
      setTeachers(teachersList);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching teachers: ' + error.message);
      console.error('Error fetching teachers:', error);
      setLoading(false);
    }
  };

  // Fetch teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Handle teacher deletion
  const handleDelete = async (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await deleteDoc(doc(db, 'teachers', teacherId));
        setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
        toast.success('Teacher deleted successfully!');
      } catch (error) {
        toast.error('Error deleting teacher: ' + error.message);
        console.error('Error deleting teacher:', error);
      }
    }
  };

  // Start editing a teacher
  const startEditing = (teacher) => {
    setEditingTeacher(teacher.id);
    setEditFormData({
      fullName: teacher.fullName || teacher.name || '',
      email: teacher.email,
      mobileNo: teacher.mobileNo || teacher.phone || '',
      teacherId: teacher.teacherId || '',
      department: teacher.department || '',
      subjects: teacher.subjects || [teacher.subject] || [],
      status: teacher.status || 'active'
    });
  };

  // Handle changes in the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle subject selection
  const handleSubjectSelect = (e) => {
    setSelectedSubject(e.target.value);
  };

  
  const addSubject = () => {
    if (selectedSubject && !editFormData.subjects.includes(selectedSubject)) {
      setEditFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, selectedSubject]
      }));
      setSelectedSubject('');
    }
  };

  // Remove a subject from the list
  const removeSubject = (subjectToRemove) => {
    setEditFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(subject => subject !== subjectToRemove)
    }));
  };

  
  const cancelEditing = () => {
    setEditingTeacher(null);
  };

// Handle updating a teacher's data
 const handleUpdate = async (teacherId) => {
  try {
    const updateData = {
      ...editFormData,
      updatedAt: new Date()
    };
    
    // CHANGE THIS LINE - Update the correct collection ('teachers' instead of 'users')
    await updateDoc(doc(db, 'teachers', teacherId), updateData);
    toast.success('Teacher updated successfully!');
    setEditingTeacher(null);
    fetchTeachers();
  } catch (error) {
    toast.error('Error updating teacher: ' + error.message);
    console.error('Error updating teacher:', error);
  }
};


  const togglePasswordVisibility = (teacherId) => {
    setShowPassword(prev => ({
      ...prev,
      [teacherId]: !prev[teacherId]
    }));
  };

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(teacher => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (teacher.fullName || teacher.name || '').toLowerCase().includes(searchLower) ||
      (teacher.department || '').toLowerCase().includes(searchLower) ||
      (teacher.subject || (teacher.subjects || []).join(', ')).toLowerCase().includes(searchLower) ||
      (teacher.email || '').toLowerCase().includes(searchLower) ||
      (teacher.teacherId || '').toLowerCase().includes(searchLower) ||
      (teacher.mobileNo || teacher.phone || '').toLowerCase().includes(searchLower)
    );
  });

  // If loading, show a spinner
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 mt-9 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 rounded-xl shadow-lg mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <FiAward className="text-white text-2xl mr-3" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white flex items-center">
                Manage Teachers
              </h1>
              <p className="text-blue-100 text-sm">View and manage all teachers in the system</p>
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

        {/* Search and Add */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search teachers by name, department or subject..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            to="/admin/add-teacher"
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors flex items-center whitespace-nowrap shadow-md"
          >
            <FiPlus className="mr-2" /> Add New Teacher
          </Link>
        </div>

        {/* Teachers List */}
        {filteredTeachers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500">No teachers found matching your search</p>
            <button
              onClick={() => {
                setSearchTerm('');
                fetchTeachers();
              }}
              className="mt-4 px-4 py-2 text-indigo-600 hover:text-indigo-800 flex items-center justify-center mx-auto"
            >
              <FiRefreshCw className="mr-2" /> Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <div 
                key={teacher.id} 
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {editingTeacher === teacher.id ? (
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <FiUser className="text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Editing Teacher</h3>
                      </div>
                      
                      <div>
                        <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FiUser className="mr-2" /> Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={editFormData.fullName}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FiAward className="mr-2" /> Teacher ID
                        </label>
                        <input
                          type="text"
                          name="teacherId"
                          value={editFormData.teacherId}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
                          disabled
                        />
                      </div>
                      
                      <div>
                        <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FiBriefcase className="mr-2" /> Department
                        </label>
                        <select
                          name="department"
                          value={editFormData.department}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select Department</option>
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FiBook className="mr-2" /> Subjects
                        </label>
                        <div className="flex gap-2 mb-2">
                          <select
                            value={selectedSubject}
                            onChange={handleSubjectSelect}
                            disabled={!editFormData.department}
                            className={`flex-1 px-3 py-2 border ${!editFormData.department ? 'bg-gray-100' : 'bg-white'} border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                          >
                            <option value="">Select Subject</option>
                            {availableSubjects.map(subject => (
                              <option key={subject} value={subject}>{subject}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={addSubject}
                            disabled={!selectedSubject}
                            className={`px-3 py-2 rounded-lg flex items-center ${!selectedSubject ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
                          >
                            <FiPlus />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {editFormData.subjects.map(subject => (
                            <div key={subject} className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                              <span>{subject}</span>
                              <button
                                type="button"
                                onClick={() => removeSubject(subject)}
                                className="ml-2 text-indigo-600 hover:text-indigo-900"
                              >
                                <FiX className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FiMail className="mr-2" /> Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editFormData.email}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
                          disabled
                        />
                      </div>
                      
                      <div>
                        <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FiPhone className="mr-2" /> Mobile
                        </label>
                        <input
                          type="tel"
                          name="mobileNo"
                          value={editFormData.mobileNo}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <FiUser className="mr-2" /> Status
                        </label>
                        <select
                          name="status"
                          value={editFormData.status}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          onClick={cancelEditing}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                        >
                          <FiX className="mr-2" /> Cancel
                        </button>
                        <button
                          onClick={() => handleUpdate(teacher.id)}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center shadow-md"
                        >
                          <FiSave className="mr-2" /> Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-indigo-600 text-xl" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold text-gray-900 truncate">
                          {teacher.fullName || teacher.name}
                        </h3>
                        <div className="flex items-center">
                          <span className={`px-2 py-0.5 text-xs font-mediam rounded-full ${
                            teacher.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                          }`}>
                            {teacher.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center text-sm">
                        <FiAward className="text-indigo-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">
                          <span className="font-medium text-gray-700">ID:</span> {teacher.teacherId}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <FiMail className="text-indigo-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600 truncate">
                          <span className="font-medium text-gray-700">Email:</span> {teacher.email}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <FiPhone className="text-indigo-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">
                          <span className="font-medium text-gray-700">Mobile:</span> {teacher.mobileNo || teacher.phone}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <FiLock className="text-indigo-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600 flex items-center">
                          <span className="font-medium text-gray-700 mr-1">Password:</span>
                          <span className="font-mono">
                            {showPassword[teacher.id] ? teacher.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(teacher.id)}
                            className="ml-2 text-gray-500 hover:text-indigo-600"
                          >
                            {showPassword[teacher.id] ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                          </button>
                        </span>
                      </div>

                      <div className="flex items-center text-sm">
                        <FiBriefcase  className="text-indigo-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">
                          <span className="font-medium text-gray-700">Department :</span> {teacher.department}
                        </span>
                      </div>
                      
                      <div className="flex items-start text-sm">
                        <FiBook className="text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-700">Subjects :</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {(teacher.subjects || [teacher.subject]).filter(s => s).map(subject => (
                              <span key={subject} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        onClick={() => startEditing(teacher)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors flex items-center shadow-sm"
                      >
                        <FiEdit2 className="mr-2" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-colors flex items-center shadow-sm"
                      >
                        <FiTrash2 className="mr-2" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTeachers;