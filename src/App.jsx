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

// Student Pages
import AppointmentList from './components/pages/student/AppointmentList';
import BookAppointment from './components/pages/student/BookAppointment';
import MessageList from './components/pages/student/MessageList';
import MyAppointments from './components/pages/student/MyAppointments';
import SearchTeacher from './components/pages/student/SearchTeacher';
import MyProfile from './components/pages/student/MyProfile';
import StudentDashboard from './components/pages/student/StudentDashboard';

// Teacher Pages
import TeacherDashboard from './components/pages/teacher/TeacherDashboard';
import ScheduleAppointment from './components/pages/teacher/ScheduleAppointment';
import ManageAppointmentList from './components/pages/teacher/ManageAppointmentList';
import ViewAllMessages from './components/pages/teacher/ViewAllMessages';
import AvailabilityList from './components/pages/teacher/AvailabilityList';
import TeacherProfile from './components/pages/teacher/TeacherProfile';

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
              <Route path="AddTeacher" element={<AddTeacher />} />
              <Route path="ManageTeacher" element={<ManageTeachers />} />
              <Route path="ApproveStudents" element={<ApproveStudents />} />
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
              <Route path="ViewAllMessages" element={<ViewAllMessages/>} />
              <Route path="ScheduleAppointment" element={<ScheduleAppointment />} />
              <Route path="ManageAppointmentList" element={<ManageAppointmentList />} />
              <Route path="availabilityList" element={<AvailabilityList />} />
              <Route path="TeacherProfile" element={<TeacherProfile />} />
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
              <Route path="SearchTeacher" element={<SearchTeacher />} />
              <Route path="BookAppointment" element={<BookAppointment />} />
              <Route path="AppointmentList" element={<AppointmentList />} />
              <Route path="MyAppointments" element={<MyAppointments />} />
              <Route path="MessageList" element={<MessageList />} />
              <Route path="MyProfile" element={<MyProfile />} />
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