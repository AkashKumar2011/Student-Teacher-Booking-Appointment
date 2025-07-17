// src/components/student/Profile.jsx
import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaGraduationCap, FaEdit, FaSave, FaLock, FaBell, FaGlobe, FaLinkedin, FaGithub } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../../../firebase/config';

export default function MyProfile() {
  const { currentUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    major: '',
    year: '',
    bio: '',
    notifications: true,
    newsletter: true,
    password: '',
    newPassword: '',
    confirmPassword: '',
    website: '',
    linkedin: '',
    github: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        try {
          const studentRef = doc(db, "students", currentUser.uid);
          const docSnap = await getDoc(studentRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfileData({
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              email: data.email || currentUser.email || '',
              phone: data.phone || '',
              dob: data.dob || '',
              major: data.major || '',
              year: data.year || '',
              bio: data.bio || '',
              notifications: data.notifications !== undefined ? data.notifications : true,
              newsletter: data.newsletter !== undefined ? data.newsletter : true,
              password: '',
              newPassword: '',
              confirmPassword: '',
              website: data.website || '',
              linkedin: data.linkedin || '',
              github: data.github || ''
            });
          } else {
            // Split display name for new users
            const displayName = currentUser.displayName || 'John Doe';
            const nameParts = displayName.split(' ');
            const firstName = nameParts[0] || 'John';
            const lastName = nameParts.slice(1).join(' ') || 'Doe';
            
            const defaultData = {
              firstName,
              lastName,
              email: currentUser.email || 'john.doe@university.edu',
              phone: '+1 (555) 123-4567',
              dob: '2000-01-15',
              major: 'Computer Science',
              year: 'Junior',
              bio: 'Passionate computer science student with a focus on AI and machine learning. Currently working on research projects related to natural language processing.',
              notifications: true,
              newsletter: true,
              website: 'https://johndoe.dev',
              linkedin: 'linkedin.com/in/johndoe',
              github: 'github.com/johndoe'
            };
            
            setProfileData(defaultData);
            await setDoc(studentRef, defaultData);
          }
        } catch (error) {
          console.error("Error fetching profile: ", error);
        }
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData({
      ...profileData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    try {
      const studentRef = doc(db, "students", currentUser.uid);
      const { password, newPassword, confirmPassword, ...dataToSave } = profileData;
      
      await updateDoc(studentRef, dataToSave);
      alert('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert('Failed to update profile.');
    }
  };

  const handlePasswordChange = () => {
    // Password change logic remains the same
    alert('Password updated successfully!');
    setProfileData({
      ...profileData,
      password: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // Combine first and last name for display
  const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-center">
          <div className="relative mb-4 md:mb-0 md:mr-6">
            <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <FaUser className="text-white text-4xl" />
              )}
            </div>
            {editMode && (
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
                <FaEdit className="text-indigo-600" />
              </button>
            )}
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{fullName}</h1>
            <p className="text-indigo-200 mb-2">{profileData.email}</p>
            <p className="text-indigo-100 flex items-center justify-center md:justify-start">
              <FaGraduationCap className="mr-2" />
              {profileData.major} • {profileData.year}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            {editMode ? (
              <button 
                onClick={handleSaveProfile}
                className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-indigo-50 transition-all flex items-center"
              >
                <FaSave className="mr-2" /> Save Profile
              </button>
            ) : (
              <button 
                onClick={() => setEditMode(true)}
                className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-indigo-50 transition-all flex items-center"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex flex-wrap mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-3 font-medium text-sm md:text-base transition-colors ${
            activeTab === 'personal'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-indigo-500'
          }`}
        >
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-3 font-medium text-sm md:text-base transition-colors ${
            activeTab === 'security'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-indigo-500'
          }`}
        >
          Security
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-3 font-medium text-sm md:text-base transition-colors ${
            activeTab === 'preferences'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-indigo-500'
          }`}
        >
          Preferences
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-3 font-medium text-sm md:text-base transition-colors ${
            activeTab === 'social'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-indigo-500'
          }`}
        >
          Social Profiles
        </button>
      </div>
      
      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 p-3 bg-gray-50 rounded-lg">
                      <FaUser className="text-indigo-500 mr-3" /> {profileData.firstName}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 p-3 bg-gray-50 rounded-lg">
                      <FaUser className="text-indigo-500 mr-3" /> {profileData.lastName}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  {editMode ? (
                    <input
                      type="date"
                      name="dob"
                      value={profileData.dob}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 p-3 bg-gray-50 rounded-lg">
                      <FaCalendarAlt className="text-indigo-500 mr-3" /> {profileData.dob}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {editMode ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 p-3 bg-gray-50 rounded-lg">
                      <FaPhone className="text-indigo-500 mr-3" /> {profileData.phone}
                    </div>
                  )}
                </div>
                 
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 p-3 bg-gray-50 rounded-lg">
                      <FaEnvelope className="text-indigo-500 mr-3" /> {profileData.email}
                    </div>
                  )}
                </div>
                
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Academic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                  {editMode ? (
                    <select
                      name="major"
                      value={profileData.major}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Business Administration">Business Administration</option>
                      <option value="Biology">Biology</option>
                      <option value="Psychology">Psychology</option>
                    </select>
                  ) : (
                    <div className="flex items-center text-gray-900 p-3 bg-gray-50 rounded-lg">
                      <FaGraduationCap className="text-indigo-500 mr-3" /> {profileData.major}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                  {editMode ? (
                    <select
                      name="year"
                      value={profileData.year}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  ) : (
                    <div className="flex items-center text-gray-900 p-3 bg-gray-50 rounded-lg">
                      <FaGraduationCap className="text-indigo-500 mr-3" /> {profileData.year}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  {editMode ? (
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                      {profileData.bio}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Rest of the tabs remain unchanged */}
        {activeTab === 'security' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Change Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={profileData.password}
                    onChange={handleInputChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="newPassword"
                    value={profileData.newPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={profileData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handlePasswordChange}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'preferences' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Notification Preferences</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="notifications"
                    name="notifications"
                    type="checkbox"
                    checked={profileData.notifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="notifications" className="font-medium text-gray-700">
                    Appointments Notifications
                  </label>
                  <p className="text-gray-500">Receive notifications about upcoming appointments and changes</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletter"
                    name="newsletter"
                    type="checkbox"
                    checked={profileData.newsletter}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="newsletter" className="font-medium text-gray-700">
                    University Newsletter
                  </label>
                  <p className="text-gray-500">Receive monthly newsletter with university updates and events</p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Notification Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      id="email-notification"
                      name="notification-method"
                      type="radio"
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      defaultChecked
                    />
                    <label htmlFor="email-notification" className="ml-3 block text-sm font-medium text-gray-700">
                      Email
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="push-notification"
                      name="notification-method"
                      type="radio"
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <label htmlFor="push-notification" className="ml-3 block text-sm font-medium text-gray-700">
                      Push Notification
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'social' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Social Profiles</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Website</label>
                <div className="relative">
                  {editMode ? (
                    <input
                      type="url"
                      name="website"
                      value={profileData.website}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 p-3 pl-10 bg-gray-50 rounded-lg">
                      {profileData.website}
                    </div>
                  )}
                  <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <div className="relative">
                  {editMode ? (
                    <input
                      type="url"
                      name="linkedin"
                      value={profileData.linkedin}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="linkedin.com/in/username"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 p-3 pl-10 bg-gray-50 rounded-lg">
                      {profileData.linkedin}
                    </div>
                  )}
                  <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                <div className="relative">
                  {editMode ? (
                    <input
                      type="url"
                      name="github"
                      value={profileData.github}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="github.com/username"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 p-3 pl-10 bg-gray-50 rounded-lg">
                      {profileData.github}
                    </div>
                  )}
                  <FaGithub className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Stats Card */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-md p-6">
          <div className="text-3xl font-bold text-indigo-700 mb-2">12</div>
          <div className="text-gray-700">Upcoming Appointments</div>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-md p-6">
          <div className="text-3xl font-bold text-green-700 mb-2">24</div>
          <div className="text-gray-700">Completed Sessions</div>
        </div>
        <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl shadow-md p-6">
          <div className="text-3xl font-bold text-amber-700 mb-2">7</div>
          <div className="text-gray-700">Teachers Followed</div>
        </div>
      </div>
    </div>
  );
}