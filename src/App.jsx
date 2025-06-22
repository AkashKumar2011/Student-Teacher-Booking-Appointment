import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './components/pages/Home';
import About from './components/pages/About';
import ContactUs from './components/pages/ContactUs';
import Dashboard from './components/pages/Dashboard';
import AdminDashboard from './components/pages/AdminDashboard';
import TeacherDashboard from './components/pages/TeacherDashboard';
import StudentDashboard from './components/pages/StudentDashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoute';
import TeacherRoute from './components/Auth/TeacherRoute';
import StudentRoute from './components/Auth/StudentRoute';
import AddTeacher from './components/Admin/AddTeacher';
import ManageTeachers from './components/Admin/ManageTeachers';
import ApproveStudents from './components/Admin/ApproveStudents';
import Schedule from './components/Teacher/Schedule';
import Appointments from './components/Teacher/Appointments';
import Messages from './components/Teacher/Messages';
import SearchTeacher from './components/Student/SearchTeacher';
import BookAppointment from './components/Student/BookAppointment';
import MyAppointments from './components/Student/MyAppointments';

function App() {
  return (
    <>
      <AuthProvider>
        <AppProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Private Dashboard Route */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              
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
            </Routes>
          </Layout>
        </AppProvider>
      </AuthProvider>
    </>
  );
}

export default App;