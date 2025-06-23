// src/components/Teacher/Messages.jsx
import { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Messages() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    
    const q = query(
      collection(db, 'messages'),
      where('receiverId', '==', currentUser.uid),
      where('read', '==', false)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = [];
      snapshot.forEach(doc => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const markAsRead = async (messageId) => {
    try {
      setLoading(true);
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, { read: true });
      toast.success('Message marked as read');
    } catch (error) {
      toast.error('Error marking message: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Unread Messages</h2>
      
      {messages.length === 0 ? (
        <p className="text-gray-500">No unread messages</p>
      ) : (
        <div className="space-y-4">
          {messages.map(message => (
            <div key={message.id} className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{message.senderName}</h3>
                  <p className="text-sm text-gray-500">{new Date(message.createdAt?.seconds * 1000).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => markAsRead(message.id)}
                  disabled={loading}
                  className="text-sm text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                >
                  Mark as read
                </button>
              </div>
              <p className="mt-2 text-gray-700">{message.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}