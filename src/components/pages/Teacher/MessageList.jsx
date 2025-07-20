// src/components/teacher/MessageList.jsx
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  orderBy,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useAuth } from '../../../context/AuthContext';
import { 
  FaEnvelope, 
  FaUserGraduate, 
  FaSpinner, 
  FaInfoCircle, 
  FaEye, 
  FaReply, 
  FaTrash,
  FaExternalLinkAlt
} from 'react-icons/fa';

export default function MessageList() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('unread');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [indexUrl, setIndexUrl] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIndexUrl(null);
        
        let q;
        if (filter === 'all') {
          q = query(
            collection(db, 'messages'),
            where('teacherId', '==', currentUser.uid),
            // orderBy('createdAt', 'desc')
          );
        } else if (filter === 'read') {
          q = query(
            collection(db, 'messages'),
            where('teacherId', '==', currentUser.uid),
            where('read', '==', true),
            // orderBy('createdAt', 'desc')
          );
        } else {
          q = query(
            collection(db, 'messages'),
            where('teacherId', '==', currentUser.uid),
            where('read', '==', false),
            // orderBy('createdAt', 'desc')
          );
        }
        
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
        
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching messages:', error);
        
        // Check if it's an index error
        if (error.code === 'failed-precondition' && error.message.includes('index')) {
          // Extract index URL from error message
          const urlMatch = error.message.match(/https:\/\/[^\s]+/);
          if (urlMatch) {
            setIndexUrl(urlMatch[0]);
            setError({
              header: 'Firestore Index Required',
              message: 'To run this query, you need to create a Firestore index. This is a one-time setup.',
            });
          } else {
            setError({
              header: 'Firestore Query Error',
              message: error.message || 'Failed to fetch messages due to query constraints.',
            });
          }
        } else {
          setError({
            header: 'Error Loading Messages',
            message: error.message || 'Failed to load messages. Please try again later.',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchMessages();
    }
  }, [currentUser, filter]);

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

  const markAsRead = async (messageId) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        read: true
      });
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? {...msg, read: true} : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
      setError({
        header: 'Error Updating Message',
        message: error.message || 'Failed to mark message as read'
      });
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedMessage) return;
    
    setIsSending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSelectedMessage(null);
      setReplyContent('');
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Error sending reply:', error);
      setError({
        header: 'Failed to Send Reply',
        message: error.message || 'Could not send your reply'
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await deleteDoc(doc(db, 'messages', messageId));
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      if (selectedMessage?.id === messageId) setSelectedMessage(null);
    } catch (error) {
      console.error('Error deleting message:', error);
      setError({
        header: 'Failed to Delete Message',
        message: error.message || 'Could not delete the message'
      });
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-purple-800 flex items-center">
            <FaEnvelope className="mr-2" /> Student Messages
          </h2>
          <button
            onClick={() => currentUser && fetchMessages()}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Refresh Messages
          </button>
        </div>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'unread', 'read'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f === 'all' ? 'All' : f === 'unread' ? 'Unread' : 'Read'}
            </button>
          ))}
        </div>
        
        {/* Error display */}
        {error && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
            <div className="flex justify-between">
              <h3 className="font-bold text-yellow-800 text-lg">{error.header}</h3>
              <button 
                onClick={() => setError(null)}
                className="text-yellow-600 hover:text-yellow-800 text-xl"
                title="Close error"
              >
                &times;
              </button>
            </div>
            <p className="text-yellow-700 mt-2">{error.message}</p>
            
            {indexUrl && (
              <div className="mt-4">
                <div className="bg-yellow-100 p-3 rounded-lg mb-3">
                  <h4 className="font-bold mb-2">How to fix:</h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      <a 
                        href={indexUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                      >
                        Click here to create the required index <FaExternalLinkAlt className="ml-1 text-xs" />
                      </a>
                    </li>
                    <li>Sign in to Firebase Console if prompted</li>
                    <li>Click "Create Index" button on the page that opens</li>
                    <li>Wait 2-5 minutes for index to build</li>
                    <li>Return to this page and click "Refresh Messages"</li>
                  </ol>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <a 
                    href={indexUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors font-medium"
                  >
                    <FaExternalLinkAlt className="mr-2" /> Create Firestore Index
                  </a>
                  
                  <button
                    onClick={() => {
                      setError(null);
                      setIndexUrl(null);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Refresh Messages
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <FaSpinner className="animate-spin text-purple-600 text-4xl mb-3" />
            <p className="text-gray-600">Loading messages...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && messages.length === 0 && (
          <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl shadow-inner">
            <FaInfoCircle className="text-purple-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You have no messages from students." 
                : `You have no ${filter} messages.`}
            </p>
          </div>
        )}

        {/* Messages list */}
        {!isLoading && !error && messages.length > 0 && (
          <div className="space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 transition-all ${
                  message.read 
                    ? 'border-l-purple-500' 
                    : 'border-l-blue-500'
                }`}
              >
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setSelectedMessage(selectedMessage?.id === message.id ? null : message);
                    if (!message.read) markAsRead(message.id);
                  }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center">
                      <div className="bg-purple-100 rounded-full p-2 mr-3">
                        <FaUserGraduate className="text-purple-600 text-lg" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{message.studentName}</h3>
                        <p className="text-sm text-gray-500">{message.studentEmail}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center ml-auto sm:ml-0">
                      <span className={`text-xs px-2 py-1 rounded-full mr-2 ${
                        message.read 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {message.read ? 'Read' : 'Unread'}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete message"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-gray-700 font-medium">{message.subject}</p>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {message.content}
                    </p>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 flex justify-between">
                    <span>{formatDate(message.createdAt)}</span>
                    <span className="flex items-center text-purple-600">
                      <FaEye className="mr-1" /> 
                      {selectedMessage?.id === message.id ? 'Hide' : 'View'}
                    </span>
                  </div>
                </div>
                
                {selectedMessage?.id === message.id && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="mb-4 p-3 bg-white rounded-lg">
                      <p className="text-gray-700">{message.content}</p>
                    </div>
                    
                    <form onSubmit={handleReply}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reply to {message.studentName}
                      </label>
                      <textarea
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3 text-sm"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Type your reply here..."
                        required
                        rows={3}
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          onClick={() => setSelectedMessage(null)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 flex items-center shadow-md"
                          disabled={isSending}
                        >
                          <FaReply className="mr-2" />
                          {isSending ? 'Sending...' : 'Send Reply'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}