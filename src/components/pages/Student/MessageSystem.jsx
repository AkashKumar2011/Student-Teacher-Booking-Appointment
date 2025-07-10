// src/components/Student/MessageSystem.jsx
import { useState, useEffect, useRef } from 'react';
import { db } from '../../../firebase/config';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiHome, 
  FiSend, 
  FiMessageSquare,
  FiUser,
  FiClock
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function MessageSystem() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const messagesEndRef = useRef(null);

  const teacherId = location.state?.teacherId || new URLSearchParams(location.search).get('teacherId');

  useEffect(() => {
    if (!currentUser?.uid || !teacherId) {
      navigate('/student/search-teachers');
      return;
    }

    const fetchTeacherDetails = async () => {
      try {
        const q = query(
          collection(db, 'teachers'),
          where('id', '==', teacherId)
        );
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const teacherData = snapshot.docs[0].data();
            setSelectedTeacher({
              id: teacherData.id,
              name: teacherData.name,
              department: teacherData.department,
              subject: teacherData.subject
            });
          }
        });
        
        return unsubscribe;
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchMessages = async () => {
      try {
        const messagesQuery = query(
          collection(db, 'messages'),
          where('participants', 'array-contains', currentUser.uid),
          orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          const messagesData = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            if (data.participants.includes(teacherId)) {
              messagesData.push({
                id: doc.id,
                ...data,
                isCurrentUser: data.senderId === currentUser.uid,
                isRead: data.status === 'read'
              });
              
              // Mark as read if current user is the receiver
              if (data.receiverId === currentUser.uid && data.status !== 'read') {
                updateDoc(doc.ref, { status: 'read' });
              }
            }
          });
          setMessages(messagesData);
          setLoading(false);
        });

        return unsubscribe;
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const teacherUnsubscribe = fetchTeacherDetails();
    const messagesUnsubscribe = fetchMessages();

    return () => {
      if (teacherUnsubscribe) teacherUnsubscribe();
      if (messagesUnsubscribe) messagesUnsubscribe();
    };
  }, [currentUser, teacherId, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    try {
      await addDoc(collection(db, 'messages'), {
        content: newMessage,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email,
        receiverId: teacherId,
        receiverName: selectedTeacher.name,
        participants: [currentUser.uid, teacherId],
        createdAt: serverTimestamp(),
        status: 'unread'
      });
      setNewMessage('');
    } catch (err) {
      toast.error('Failed to send message: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FiMessageSquare className="mr-3 text-indigo-600" />
              Messages
            </h1>
            {selectedTeacher && (
              <div className="flex items-center mt-2">
                <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mr-2">
                  <FiUser className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-gray-600">
                    Conversation with <span className="font-medium">{selectedTeacher.name}</span>
                  </p>
                  {selectedTeacher.department && (
                    <p className="text-xs text-gray-500">
                      {selectedTeacher.department} • {selectedTeacher.subject}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-600 rounded-lg hover:from-indigo-200 hover:to-blue-200 transition-all shadow-sm"
              title="Go back"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/student')}
              className="p-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-600 rounded-lg hover:from-indigo-200 hover:to-blue-200 transition-all shadow-sm"
              title="Go to dashboard"
            >
              <FiHome className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Messages Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-white/20 backdrop-blur-sm">
          {/* Messages List */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                  <FiMessageSquare className="text-indigo-600 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No messages yet</h3>
                <p className="text-gray-500 mb-4">Start the conversation with {selectedTeacher?.name}</p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md rounded-lg p-3 ${message.isCurrentUser 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                      : 'bg-gradient-to-r from-gray-100 to-blue-50 text-gray-800'}`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className={`text-xs mt-1 flex items-center ${message.isCurrentUser ? 'text-indigo-100' : 'text-gray-500'}`}>
                      <FiClock className="mr-1" />
                      {message.createdAt?.toDate()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-r-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <FiSend className="mr-2" /> Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}