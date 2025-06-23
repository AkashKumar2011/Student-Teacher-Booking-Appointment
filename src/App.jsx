// src/components/App.js
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './components/pages/Home';
import About from './components/pages/About';
import ContactUs from './components/pages/ContactUs';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoute';
import TeacherRoute from './components/Auth/TeacherRoute';
import StudentRoute from './components/Auth/StudentRoute';

// Admin Components
import AdminDashboard from './components/pages/Admin/AdminDashboard';
import AddTeacher from './components/pages/Admin/AddTeacher';
import ManageTeachers from './components/pages/Admin/ManageTeachers';
import ApproveStudents from './components/pages/Admin/ApproveStudents';

// Teacher Components/pages
import TeacherDashboard from './components/pages/Teacher/TeacherDashboard';
import Schedule from './components/pages/Teacher/Schedule';
import Appointments from './components/pages/Teacher/Appointments';
import Messages from './components/pages/Teacher/Messages';

// Student Components/pages
import StudentDashboard from './components/pages/Student/StudentDashboard';
import SearchTeacher from './components/pages/Student/SearchTeacher';
import BookAppointment from './components/pages/Student/BookAppointment';
import MyAppointments from './components/pages/Student/MyAppointments';

function App() {
  return (
    <>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
              <Route index element={<AddTeacher />} />
              <Route path="add-teacher" element={<AddTeacher />} />
              <Route path="manage-teachers" element={<ManageTeachers />} />
              <Route path="approve-students" element={<ApproveStudents />} />
            </Route>
            
            {/* Teacher Routes */}
            <Route path="/teacher" element={<TeacherRoute><TeacherDashboard /></TeacherRoute>}>
              <Route index element={<Schedule />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="messages" element={<Messages />} />
            </Route>
            
            {/* Student Routes */}
            <Route path="/student" element={<StudentRoute><StudentDashboard /></StudentRoute>}>
              <Route index element={<SearchTeacher />} />
              <Route path="search-teacher" element={<SearchTeacher />} />
              <Route path="book-appointment" element={<BookAppointment />} />
              <Route path="my-appointments" element={<MyAppointments />} />
            </Route>
            
            {/* Fallback route */}
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          </Routes>
        </Layout>
      </AuthProvider>
    </>
  );
}

export default App;