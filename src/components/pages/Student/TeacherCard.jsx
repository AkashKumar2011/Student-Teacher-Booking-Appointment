// src/components/student/TeacherCard.jsx
import React, { useState } from 'react';
import { FaCalendarAlt, FaEnvelope, FaChalkboardTeacher, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import BookAppointment from './BookAppointment';
import SendMessage from './SendMessage';

export default function TeacherCard({ teacher, onViewDetails }) {
  const [showBookModal, setShowBookModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const statusColor = teacher.status === 'active' 
    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800' 
    : 'bg-gradient-to-r from-red-100 to-rose-100 text-rose-800';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100 transition-all hover:shadow-lg">
      <div className="p-4 sm:p-5">
        <div className="flex items-center mb-4 cursor-pointer" > {/* onClick={() => onViewDetails(teacher)}> */}
          <div className="bg-gradient-to-br from-indigo-200 to-blue-300 rounded-xl w-14 h-14 flex-shrink-0 flex items-center justify-center mr-4">
            {teacher.avatar ? (
              <img 
                src={teacher.avatar} 
                alt={teacher.fullName} 
                className="w-12 h-12 rounded-xl object-cover"
              />
            ) : (
              <FaChalkboardTeacher className="text-indigo-700 text-2xl" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="truncate">
                <h3 className="text-xlg sm:text-xl font-bold text-gray-800 truncate">{teacher.teacherName}</h3>
                <p className={`text-xs px-2 py-1 rounded-full inline-block ${statusColor}`}>
                  {teacher.status}
                </p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(!showDetails);
                }}
                className="text-gray-500 hover:text-indigo-600 flex-shrink-0 ml-2"
              >
                {showDetails ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
          </div>
        </div>
        
        {showDetails && (
          <div className="mb-4 border-t border-gray-100 pt-4">
            <p className="text-gray-600 my-1 text-sm truncate"><span className="font-medium">Teacher ID :</span> {teacher.teacherId || 'N/A'}</p>
            <p className="text-gray-600 my-1 text-sm truncate"><span className="font-medium">Email ID :</span> {teacher.email || 'N/A'}</p>
            <p className="text-gray-600 my-1 text-sm truncate"><span className="font-medium">Department :</span> {teacher.department}</p>
            <p className="text-gray-600 my-1 text-sm truncate"><span className="font-medium">Subjects :</span> {teacher.subjects?.join(", ") || 'N/A'}</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowBookModal(true);
            }}
            className="flex items-center justify-center py-2 px-3 sm:px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all text-sm sm:text-base"
          >
            <FaCalendarAlt className="mr-1 sm:mr-2" /> Book
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMessageModal(true);
            }}
            className="flex items-center justify-center py-2 px-3 sm:px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all text-sm sm:text-base"
          >
            <FaEnvelope className="mr-1 sm:mr-2" /> Message
          </button>
        </div>
      </div>
      
      {showBookModal && (
        <BookAppointment 
          teacher={teacher} 
          onClose={() => setShowBookModal(false)} 
        />
      )}
      
      {showMessageModal && (
        <SendMessage 
          teacher={teacher} 
          onClose={() => setShowMessageModal(false)} 
        />
      )}
    </div>
  );
}