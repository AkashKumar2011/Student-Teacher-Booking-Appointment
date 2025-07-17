// src/components/student/SearchTeacher.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import TeacherCard from './TeacherCard';
import { FaSearch, FaSpinner, FaFilter } from 'react-icons/fa';

export default function SearchTeacher({ onViewDetails }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setIsLoading(true);
        const q = query(collection(db, 'teachers'));
        const querySnapshot = await getDocs(q);
        
        const teachersData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          teachersData.push({
            id: doc.id,
            teacherName: data.fullName || 'Unknown Teacher',
            department: data.department || 'No department',
            subjects: data.subjects || [],
            email: data.email || '',
            avatar: data.avatar || '',  
            status: data.status || 'active',
            teacherId: data.teacherId,
          });
        });
        
        setTeachers(teachersData);
        setFilteredTeachers(teachersData);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeachers();
  }, []);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    const results = teachers.filter(teacher => {
      const teacherName = teacher.teacherName?.toLowerCase() || '';
      const department = teacher.department?.toLowerCase() || '';
      const subjects = teacher.subjects?.join(", ")?.toLowerCase() || '';
      const teacherId = teacher.teacherId?.toLowerCase() || '';
      
      // Apply search term
      const matchesSearch = (
        teacherName.includes(lowerSearchTerm) ||
        department.includes(lowerSearchTerm) ||
        subjects.includes(lowerSearchTerm)
      );
      
      // Apply department filter
      const matchesDepartment = departmentFilter ? 
        teacher.department?.toLowerCase() === departmentFilter.toLowerCase() : 
        true;
      
      // Apply subject filter
      const matchesSubject = subjectFilter ? 
        teacher.subjects?.some(subj => subj.toLowerCase().includes(subjectFilter.toLowerCase())) : 
        true;
      
      return matchesSearch && matchesDepartment && matchesSubject;
    });
    
    setFilteredTeachers(results);
  }, [searchTerm, teachers, departmentFilter, subjectFilter]);

  // Extract unique departments and subjects for filters
  const departments = [...new Set(teachers.map(t => t.department))].filter(Boolean);
  const allSubjects = teachers.flatMap(t => t.subjects || []);
  const subjects = [...new Set(allSubjects)].filter(Boolean).sort();

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-indigo-800">Find a Teacher</h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, department or subject..."
            className="w-full p-4 pl-10 rounded-xl border border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 text-white px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 transition-all min-w-[120px]"
        >
          <FaFilter /> Filters
        </button>
      </div>
      
      {showFilters && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex flex-col items-center py-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
          <FaSpinner className="animate-spin text-indigo-600 text-4xl mb-4" />
          <p className="text-gray-600">Loading teachers...</p>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
          <div className="text-gray-500 text-lg mb-4">No teachers found</div>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchTerm || departmentFilter || subjectFilter 
              ? 'Try different search terms or filters' 
              : 'No teachers available at the moment'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map(teacher => (
            <TeacherCard key={teacher.id} teacher={teacher} onViewDetails={() => onViewDetails(teacher, 'teacher')} />
          ))}
        </div>
      )}
    </div>
  );
}