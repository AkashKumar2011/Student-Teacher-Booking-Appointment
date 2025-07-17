import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { useAuth } from '../../../context/AuthContext';

export default function ViewMessages() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const messagesRef = ref(db, `messages/${currentUser.uid}`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loaded = [];
      for (let key in data) {
        loaded.push({ id: key, ...data[key] });
      }
      setMessages(loaded);
    });

    return () => unsubscribe();
  }, [currentUser.uid]);

  const handleDelete = async (id) => {
    const db = getDatabase();
    const messageRef = ref(db, `messages/${currentUser.uid}/${id}`);
    try {
      await remove(messageRef);
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Student Messages</h2>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white text-black p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <p><span className="font-bold">From:</span> {msg.studentEmail}</p>
                <p><span className="font-bold">Subject:</span> {msg.subject}</p>
                <p><span className="font-bold">Message:</span> {msg.content}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
