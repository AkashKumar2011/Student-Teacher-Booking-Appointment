import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../../firebase/config';
import { FiArrowLeft, FiHome, FiEye, FiEyeOff, FiPlus, FiX, FiSave, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext'; // Adjust the import path as needed


const AddTeacher = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNo: '',
    teacherKey:'',
    teacherId: '',
    department: '',
    subjects: [],
    password: '',
    role: 'teacher'
  });
  
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    mobileNo: '',
    teacherId: '',
    department: '',
    subjects: '',
    password: ''
  });
  
  const [departments, setDepartments] = useState([
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History'
  ]);
  
  const [allSubjects, setAllSubjects] = useState({
    'Computer Science': ['Data Structures', 'Algorithms', 'Database Systems', 'Web Development'],
    'Mathematics': ['Calculus', 'Linear Algebra', 'Discrete Mathematics', 'Statistics'],
    'Physics': ['Classical Mechanics', 'Quantum Physics', 'Thermodynamics', 'Electromagnetism'],
    'Chemistry': ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry'],
    'Biology': ['Genetics', 'Microbiology', 'Biochemistry', 'Ecology'],
    'English': ['Literature', 'Creative Writing', 'Linguistics', 'Technical Writing'],
    'History': ['World History', 'European History', 'American History', 'Ancient Civilizations']
  });
  
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { registerTeacher } = useAuth(); // Adjust the import path as needed

  useEffect(() => {
    if (formData.department) {
      setAvailableSubjects(allSubjects[formData.department] || []);
      setSelectedSubject('');
    } else {
      setAvailableSubjects([]);
    }
  }, [formData.department, allSubjects]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      fullName: '',
      email: '',
      mobileNo: '',
      teacherId: '',
      department: '',
      subjects: '',
      password: ''
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!formData.mobileNo) {
      newErrors.mobileNo = 'Mobile number is required';
      valid = false;
    } else if (!/^[0-9]{10,15}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Please enter a valid mobile number';
      valid = false;
    }

    if (!formData.teacherId) {
      newErrors.teacherId = 'Teacher ID is required';
      valid = false;
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
      valid = false;
    }

    if (formData.subjects.length === 0) {
      newErrors.subjects = 'At least one subject is required';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubjectSelect = (e) => {
    setSelectedSubject(e.target.value);
  };

  const addSubject = () => {
    if (selectedSubject && !formData.subjects.includes(selectedSubject)) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, selectedSubject]
      }));
      setSelectedSubject('');
      if (errors.subjects) {
        setErrors(prev => ({ ...prev, subjects: '' }));
      }
    }
  };

  const removeSubject = (subjectToRemove) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(subject => subject !== subjectToRemove)
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    toast.error('Please fix the errors in the form');
    return;
  }
    
  try {
    setIsSubmitting(true);

    // Call registerTeacher and await the result
    const result = await registerTeacher(
      formData.email,
      formData.password,  
      {
        fullName: formData.fullName,
        mobileNo: formData.mobileNo,
        teacherId: formData.teacherId,
        department: formData.department,
        subjects: formData.subjects,
        loginPassword: formData.password,
        role: formData.role
      }
    );

    if (result && result.success) {
      toast.success('Teacher added successfully');
      resetForm();
      navigate('/admin/manage-teachers');
    } else {
      toast.error('Failed to add teacher');
    }
  } catch (error) {
    console.error('Error adding teacher:', error);
    
    // Handle specific error cases
    if (error.message.includes('already registered')) {
      toast.error(error.message);
    } else {
      toast.error('Error adding teacher: ' + error.message);
    }
  } finally {
    setIsSubmitting(false);
  }
};

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      mobileNo: '',
      teacherId: '',
      department: '',
      subjects: [],
      password: '',
      role: 'teacher'
    });
    setErrors({
      fullName: '',
      email: '',
      mobileNo: '',
      teacherId: '',
      department: '',
      subjects: '',
      password: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 mt-9 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        {/* Header with navigation buttons */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg  px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Add New Teacher</h1>
            <p className="text-blue-100 text-sm">Fill in the details below to add a new teacher</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-white hover:bg-blue-700 rounded-full transition-colors"
              title="Go back"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="p-2 text-white hover:bg-blue-700 rounded-full transition-colors"
              title="Go to dashboard"
            >
              <FiHome className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                placeholder="John Doe"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                placeholder="john.doe@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            {/* Mobile Number */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.mobileNo ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                placeholder="1234567890"
              />
              {errors.mobileNo && <p className="text-red-500 text-sm mt-1">{errors.mobileNo}</p>}
            </div>
            
            {/* Teacher ID */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Teacher ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.teacherId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                placeholder="T-12345"
              />
              {errors.teacherId && <p className="text-red-500 text-sm mt-1">{errors.teacherId}</p>}
            </div>
            
            {/* Department */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>
            
            {/* Subject Selection */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Subjects <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedSubject}
                  onChange={handleSubjectSelect}
                  disabled={!formData.department}
                  className={`flex-1 px-4 py-2 border ${!formData.department ? 'bg-gray-100' : 'bg-white'} ${errors.subjects ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
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
                  className={`px-4 py-2 rounded-lg flex items-center ${!selectedSubject ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white transition-colors`}
                >
                  <FiPlus className="mr-1" /> Add
                </button>
              </div>
              {errors.subjects && <p className="text-red-500 text-sm mt-1">{errors.subjects}</p>}
              
              {/* Selected Subjects */}
              <div className="mt-2">
                {formData.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.subjects.map(subject => (
                      <div key={subject} className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                        <span>{subject}</span>
                        <button
                          type="button"
                          onClick={() => removeSubject(subject)}
                          className="ml-2 text-indigo-600 hover:text-indigo-900"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Password */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 p-1 text-gray-500 hover:text-indigo-600"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-between">
                {formData.password && (
                  <p className={`text-xs ${formData.password.length < 8 ? 'text-red-500' : 'text-green-500'}`}>
                    {formData.password.length < 8 ? 'Weak (min 8 characters)' : 'Strong password'}
                  </p>
                )}
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/admin/manage-teachers')}
              className="px-6 py-2 border border-gray-300 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors  flex items-center"
            >
              <FiArrowLeft className="mr-2" /> Back to Teachers
            </button>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-colors flex items-center"
              >
                <FiRefreshCw className="mr-2" /> Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2  bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors flex items-center ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" /> Save Teacher
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacher;