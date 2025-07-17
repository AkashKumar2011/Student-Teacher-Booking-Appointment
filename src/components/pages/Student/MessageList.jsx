// src/components/student/MessageList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useAuth } from '../../../context/AuthContext';
import { 
  FaEnvelope, 
  FaUserTie, 
  FaSpinner, 
  FaInfoCircle, 
  FaEye, 
  FaEyeSlash,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaSync
} from 'react-icons/fa';

export default function MessageList() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const q = query(
        collection(db, 'messages'),
        where('studentId', '==', currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const messagesData = [];
      
      querySnapshot.forEach(doc => {
        const data = doc.data();
        messagesData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
        });
      });
      
      // Sort messages by createdAt descending (in-memory)
      messagesData.sort((a, b) => b.createdAt - a.createdAt);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currentUser.uid]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Apply both read status filter and search term (in-memory)
  const filteredMessages = messages
    .filter(msg => {
      if (filter === 'all') return true;
      if (filter === 'read') return msg.read;
      if (filter === 'unread') return !msg.read;
      return true;
    })
    .filter(msg => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        msg.teacherName?.toLowerCase().includes(term) ||
        msg.message?.toLowerCase().includes(term)
      );
    });

  const refreshData = () => {
    fetchMessages();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-indigo-800">My Messages</h2>
        
        <div className="flex gap-2">
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className={`px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center ${
              isRefreshing ? 'opacity-75' : 'hover:from-indigo-700 hover:to-purple-700'
            } transition-all`}
          >
            {isRefreshing ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : null}
            Refresh
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center hover:from-blue-700 hover:to-indigo-800 transition-all"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>
      </div>
      
      {/* Search & Filters */}
      <div className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl p-4 shadow-sm">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by teacher name or message content..."
            className="w-full p-4 pl-10 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-3 rounded-xl ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Messages
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-3 rounded-xl ${
                filter === 'unread'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-white text-blue-700 hover:bg-blue-50'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-3 rounded-xl ${
                filter === 'read'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                  : 'bg-white text-green-700 hover:bg-green-50'
              }`}
            >
              Read
            </button>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
          <FaInfoCircle className="text-indigo-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {filter === 'all' 
              ? "You haven't sent any messages yet." 
              : `You have no ${filter} messages.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map(message => (
            <div 
              key={message.id} 
              className={`bg-white rounded-2xl shadow-lg p-5 relative overflow-hidden border-l-4 ${
                message.read 
                  ? 'border-l-indigo-500' 
                  : 'border-l-blue-500'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex items-center mb-3 md:mb-0">
                  <div className="bg-indigo-100 rounded-lg p-3 mr-4">
                    <FaUserTie className="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      To: {message.teacherName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${
                    message.read 
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800' 
                      : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800'
                  }`}>
                    {message.read ? <FaEye /> : <FaEyeSlash />}
                  </div>
                  <span className="ml-2 text-sm">
                    {message.read ? 'Read' : 'Unread'}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <p className="text-gray-700">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}