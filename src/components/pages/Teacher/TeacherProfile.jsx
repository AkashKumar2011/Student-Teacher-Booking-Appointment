// src/components/teacher/TeacherProfile.jsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useAuth } from '../../../context/AuthContext';
import { FaUser, FaEnvelope, FaBook, FaBuilding, FaSave, FaEdit } from 'react-icons/fa';

export default function TeacherProfile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      
      try {
        const docRef = doc(db, 'teachers', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setFormData(data);
        } else {
          console.log('No profile found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const docRef = doc(db, 'teachers', currentUser.uid);
      await updateDoc(docRef, formData);
      setProfile(formData);
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-purple-800 flex items-center">
          <FaUser className="mr-2" /> Teacher Profile
        </h2>
        
        {success && (
          <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg">
            Profile updated successfully!
          </div>
        )}
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject || ''}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Office Location</label>
                <input
                  type="text"
                  name="office"
                  value={formData.office || ''}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                placeholder="Tell students about yourself..."
              ></textarea>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700"
              >
                <FaSave className="mr-2" /> Save Profile
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-start">
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 flex items-center justify-center mr-6 mb-4 md:mb-0">
                <FaUser className="text-purple-500 text-4xl" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{profile?.name || 'Teacher'}</h2>
                    <p className="text-purple-600 flex items-center">
                      <FaEnvelope className="mr-2" /> {currentUser?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-3 py-1 bg-white text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <FaBook className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Department</h3>
                      <p className="font-medium">{profile?.department || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <FaBook className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Subject</h3>
                      <p className="font-medium">{profile?.subject || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <FaBuilding className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Office</h3>
                      <p className="font-medium">{profile?.office || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <FaEnvelope className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Phone</h3>
                      <p className="font-medium">{profile?.phone || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                
                {profile?.bio && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">About Me</h3>
                    <p className="text-gray-600">{profile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}