// src/components/Admin/ManageTeachers.jsx
import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    department: '',
    subject: '',
    phone: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'teachers'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teachersData = [];
      snapshot.forEach(doc => {
        teachersData.push({ id: doc.id, ...doc.data() });
      });
      setTeachers(teachersData);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher.id);
    setEditFormData({
      name: teacher.name,
      department: teacher.department,
      subject: teacher.subject,
      phone: teacher.phone
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    if (!editingTeacher) return;
    
    try {
      setLoading(true);
      const teacherRef = doc(db, 'teachers', editingTeacher);
      await updateDoc(teacherRef, editFormData);
      toast.success('Teacher updated successfully!');
      setEditingTeacher(null);
    } catch (error) {
      toast.error('Error updating teacher: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (teacherId) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'teachers', teacherId));
      toast.success('Teacher deleted successfully!');
    } catch (error) {
      toast.error('Error deleting teacher: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Teachers</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.map(teacher => (
              <tr key={teacher.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingTeacher === teacher.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingTeacher === teacher.id ? (
                    <input
                      type="text"
                      name="department"
                      value={editFormData.department}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  ) : (
                    <div className="text-sm text-gray-500">{teacher.department}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingTeacher === teacher.id ? (
                    <input
                      type="text"
                      name="subject"
                      value={editFormData.subject}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  ) : (
                    <div className="text-sm text-gray-500">{teacher.subject}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingTeacher === teacher.id ? (
                    <input
                      type="text"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  ) : (
                    <div className="text-sm text-gray-500">{teacher.phone}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingTeacher === teacher.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTeacher(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}