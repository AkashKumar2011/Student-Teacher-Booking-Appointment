import { Routes, Route, Navigate , Outlet} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/UI/Toast';
import Layout from './components/Layout';

// Public Pages
import Home from './components/pages/Home';
import About from './components/pages/About';
import ContactUs from './components/pages/ContactUs';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import AdminRegister from './components/Auth/AdminRegister';
import NotFound from './components/pages/NotFound'; // New 404 page
import Unauthorized from './components/pages/Unauthorized'; // New unauthorized page

// Admin Pages
import AdminDashboard from './components/pages/Admin/AdminDashboard';
import AddTeacher from './components/pages/Admin/AddTeacher';
import ManageTeachers from './components/pages/Admin/ManageTeachers';
import ApproveStudents from './components/pages/Admin/ApproveStudents';

// Teacher Pages
import TeacherDashboard from './components/pages/Teacher/TeacherDashboard';
import ScheduleAppointment from './components/pages/teacher/ScheduleAppointment';
import ViewMessages from './components/pages/teacher/ViewMessages';
// import ViewAllAppointments from './components/pages/teacher/ViewAllAppointments';
// import viewMessages from './components/pages/teacher/viewMessages';

// Student Pages
import StudentDashboard from './components/pages/Student/StudentDashboard';
import SearchTeacher from './components/pages/Student/SearchTeacher';
import BookAppointment from './components/pages/Student/BookAppointment';
import MyAppointments from './components/pages/Student/MyAppointments';
import SendMessage from './components/pages/student/SendMessage';

// public pages & login/register imports...
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoute';
import TeacherRoute from './components/Auth/TeacherRoute';
import StudentRoute from './components/Auth/StudentRoute';



function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path="/admin-register" element={<AdminRegister />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminRoute>
                    <Outlet />
                  </AdminRoute>
                </PrivateRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="add-teacher" element={<AddTeacher />} />
              <Route path="manage-teachers" element={<ManageTeachers />} />
              <Route path="approve-students" element={<ApproveStudents />} />
            </Route>

            {/* Teacher */}
              <Route
                path="/teacher"
                element={
                  <PrivateRoute>
                    <TeacherRoute>
                      <Outlet />  
                    </TeacherRoute>
                  </PrivateRoute>
                }
              >
              <Route index element={<TeacherDashboard />} />
              <Route path="messages" element={<ViewMessages />} />
              <Route path="schedule" element={<ScheduleAppointment />} />
              {/* <Route path="appointments" element={<ScheduleAppointment />} /> */}
              {/* <Route path="view-appointments" element={<ViewAllAppointments />} /> */}
            </Route>

            {/* Student */}
            <Route
              path="/student"
              element={
                <PrivateRoute>
                  <StudentRoute>
                    <Outlet />
                  </StudentRoute>
                </PrivateRoute>
              }
            >
              <Route index element={<StudentDashboard />} />
              <Route path="search-teachers" element={<SearchTeacher />} />
              <Route path="book-appointment" element={<BookAppointment />} />
              <Route path="my-appointments" element={<MyAppointments />} />
              <Route path="send-message" element={<SendMessage />} />
            </Route>



            {/* 404 */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </ToastProvider>
  );
}
export default App;