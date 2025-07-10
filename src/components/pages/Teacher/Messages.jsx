import { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaEnvelopeOpen, FaReply, FaArrowLeft, FaHome } from 'react-icons/fa';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { FaMessage } from 'react-icons/fa6';

export default function Messages() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('unread');

  useEffect(() => {
    if (!currentUser) return;
    
    let q;
    if (filter === 'all') {
      q = query(collection(db, 'messages'), where('receiverId', '==', currentUser.uid));
    } else {
      q = query(
        collection(db, 'messages'),
        where('receiverId', '==', currentUser.uid),
        where('read', '==', false)
      );
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = [];
      snapshot.forEach(doc => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    });

    return () => unsubscribe();
  }, [currentUser, filter]);

  const markAsRead = async (messageId) => {
    try {
      setLoading(true);
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, { read: true, readAt: new Date() });
      toast.success('Message marked as read');
      setSelectedMessage(null);
    } catch (error) {
      toast.error('Error marking message: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = () => {
    toast.success('Reply functionality will be implemented');
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl mt-12 mx-8 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="flex flex-row justify-between items-start gap-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FaMessage className="mr-2 text-White" />
            Messages
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all"
            >
              <FaHome className='lg:text-2xl md:text-2xl sm:text-2xl' /> <span className="md:hidden sm:hidden lg:inline" >Home</span>
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'unread' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            Unread ({messages.filter(m => !m.read).length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'all' ? 'bg-white text-indigo-600' : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            All Messages ({messages.length})
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-full">
        {/* Message list */}
        <div className={`${selectedMessage ? 'hidden md:block md:w-1/3' : 'w-full'} border-r border-gray-200`}>
          {messages.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No messages found
            </div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${!message.read ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : ''} ${selectedMessage?.id === message.id ? 'bg-indigo-50' : ''}`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{message.senderName}</h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(message.createdAt?.seconds * 1000), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    {!message.read && (
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                  <p className="mt-2 text-gray-700 line-clamp-2">{message.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message detail */}
        {selectedMessage ? (
          <div className="md:w-2/3">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="md:hidden flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <FaArrowLeft /> Back to list
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => markAsRead(selectedMessage.id)}
                    disabled={loading || selectedMessage.read}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {selectedMessage.read ? <FaEnvelopeOpen className="mr-1" /> : <FaEnvelope className="mr-1" />}
                    {selectedMessage.read ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                  <button
                    onClick={handleReply}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FaReply className="mr-1" /> Reply
                  </button>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedMessage.subject || 'No Subject'}</h3>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span>From: {selectedMessage.senderName} &lt;{selectedMessage.senderEmail}&gt;</span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  <span>Date: {format(new Date(selectedMessage.createdAt?.seconds * 1000), 'MMM d, yyyy h:mm a')}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{selectedMessage.content}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex md:w-2/3 items-center justify-center bg-gray-50">
            <div className="text-center p-6">
              <FaEnvelopeOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Select a message</h3>
              <p className="mt-1 text-gray-500">Choose a message from the list to view its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}