import { FaHome } from 'react-icons/fa';

export default function StudentDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <FaHome /> Student Dashboard
      </h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Dashboard cards */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">Upcoming Appointments</h3>
          <p className="text-gray-600 mt-2">You have 3 upcoming meetings</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">Recent Messages</h3>
          <p className="text-gray-600 mt-2">2 unread messages</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">Course Progress</h3>
          <p className="text-gray-600 mt-2">75% of courses completed</p>
        </div>
      </div>
    </div>
  );
}