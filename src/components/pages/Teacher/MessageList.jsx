// src/components/teacher/MessageList.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useAuth } from '../../../context/AuthContext';
import { FaEnvelope, FaUserGraduate, FaSpinner, FaInfoCircle, FaEye, FaReply, FaTrash } from 'react-icons/fa';

export default function MessageList() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('unread'); // 'all', 'read', 'unread'
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        let q;
        if (filter === 'all') {
          q = query(
            collection(db, 'messages'),
            where('teacherId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
          );
        } else if (filter === 'read') {
          q = query(
            collection(db, 'messages'),
            where('teacherId', '==', currentUser.uid),
            where('read', '==', true),
            orderBy('createdAt', 'desc')
          );
        } else { // unread
          q = query(
            collection(db, 'messages'),
            where('teacherId', '==', currentUser.uid),
            where('read', '==', false),
            orderBy('createdAt', 'desc')
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
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [currentUser.uid, filter]);

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
      
      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? {...msg, read: true} : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedMessage) return;
    
    setIsSending(true);
    
    try {
      // In a real app, you would send this reply to the student
      // For now, we'll just log it
      console.log(`Replying to ${selectedMessage.studentName}: ${replyContent}`);
      
      // Add reply to Firestore or your backend
      await addDoc(collection(db, 'replies'), {
        messageId: selectedMessage.id,
        teacherId: currentUser.uid,
        teacherName: currentUser.displayName || currentUser.email || 'Teacher',
        studentId: selectedMessage.studentId,
        content: replyContent.trim(),
        createdAt: Timestamp.now()
      });
      
      // Close reply form and reset
      setSelectedMessage(null);
      setIsReplying(false);
      setReplyContent('');
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-purple-800">Student Messages</h2>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          }`}
        >
          All Messages
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'unread'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'read'
              ? 'bg-green-600 text-white'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          Read
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-purple-600 text-4xl" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl">
          <FaInfoCircle className="text-purple-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {filter === 'all' 
              ? "You have no messages from students." 
              : `You have no ${filter} messages.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${
                message.read 
                  ? 'border-l-purple-500' 
                  : 'border-l-blue-500'
              } transition-all hover:shadow-lg cursor-pointer`}
              onClick={() => {
                setSelectedMessage(selectedMessage?.id === message.id ? null : message);
                if (!message.read) markAsRead(message.id);
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex items-center mb-3 md:mb-0">
                  <div className="bg-purple-100 rounded-lg p-2 mr-4">
                    <FaUserGraduate className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {message.studentName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    message.read 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    <FaEye className={message.read ? "" : "text-blue-600"} />
                  </div>
                  <span className="ml-2 text-sm">
                    {message.read ? 'Read' : 'Unread'}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{message.message}</p>
              </div>
              
              {selectedMessage?.id === message.id && (
                <div className="mt-4">
                  <button
                    onClick={() => setIsReplying(true)}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
                  >
                    <FaReply className="mr-2" /> Reply
                  </button>
                </div>
              )}
              
              {isReplying && selectedMessage?.id === message.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <form onSubmit={handleReply}>
                    <textarea
                      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your reply here..."
                      required
                      rows={3}
                    />
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        onClick={() => setIsReplying(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-70 flex items-center"
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
  );
}