
import { FaHome, FaCalendarAlt, FaUserGraduate, FaEnvelope } from 'react-icons/fa';

export default function TeacherDashboard() {
  const stats = [
    { title: 'Upcoming Appointments', value: 5, icon: <FaCalendarAlt className="text-2xl" /> },
    { title: 'Pending Requests', value: 3, icon: <FaCalendarAlt className="text-2xl" /> },
    { title: 'Total Students', value: 42, icon: <FaUserGraduate className="text-2xl" /> },
    { title: 'Unread Messages', value: 2, icon: <FaEnvelope className="text-2xl" /> }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <FaHome /> Teacher Dashboard
      </h1>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}