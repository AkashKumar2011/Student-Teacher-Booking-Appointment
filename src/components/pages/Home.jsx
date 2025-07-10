import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaCalendarAlt, FaChalkboardTeacher, FaBook, FaGraduationCap, FaUniversity, FaUsers, FaAward, FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-900 to-indigo-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                  <span className="block">Welcome to</span>
                  <span className="block text-indigo-200">Akash University</span>
                </h1>
                <p className="mt-3 text-base text-indigo-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Empowering students through education, innovation, and personalized learning experiences.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {currentUser ? (
                    <div className="rounded-md shadow">
                      <Link
                        to="/dashboard"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
                      >
                        Go to Dashboard
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-md shadow">
                        <Link
                          to="/signup"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 md:py-4 md:text-lg md:px-10"
                        >
                          Get started
                        </Link>
                      </div>
                      <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                        <Link
                          to="/login"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                        >
                          Login
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80"
            alt="University campus"
          />
        </div>
      </div>

      {/* Main content with scrollable area */}
      <div className="relative">
        {/* Booking System Highlight */}
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Featured Service</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Student-Teacher Booking System
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Streamline your academic consultations with our easy-to-use appointment system
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-indigo-50 rounded-lg p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <FaCalendarAlt className="h-6 w-6" />
                  </div>
                  <div className="mt-5">
                    <h3 className="text-lg font-medium text-gray-900">Easy Scheduling</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Book appointments with your professors in just a few clicks, available 24/7 from any device.
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <FaChalkboardTeacher className="h-6 w-6" />
                  </div>
                  <div className="mt-5">
                    <h3 className="text-lg font-medium text-gray-900">Teacher Availability</h3>
                    <p className="mt-2 text-base text-gray-500">
                      View real-time availability of all faculty members and find the perfect time for your consultation.
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <FaBook className="h-6 w-6" />
                  </div>
                  <div className="mt-5">
                    <h3 className="text-lg font-medium text-gray-900">Purpose Specification</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Clearly state the purpose of your meeting so teachers can prepare to give you the best assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* University Overview */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">About Our University</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Excellence in Education Since 1995
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  className="h-48 w-full object-cover"
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80"
                  alt="Students studying"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
                  <p className="mt-2 text-gray-600">
                    To provide transformative educational experiences that prepare students for meaningful careers and responsible citizenship in a global society.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  className="h-48 w-full object-cover"
                  src="https://images.unsplash.com/photo-1541178735493-479c1a27ed24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1351&q=80"
                  alt="University campus"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">Our Campus</h3>
                  <p className="mt-2 text-gray-600">
                    A beautiful 120-acre campus with state-of-the-art facilities, green spaces, and modern learning environments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-indigo-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Trusted by thousands of students and educators
              </h2>
            </div>
            <div className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-4 sm:gap-8">
              <div className="flex flex-col items-center p-4">
                <p className="text-4xl font-extrabold text-white">15,000+</p>
                <p className="mt-2 text-base font-medium text-indigo-200">Students</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <p className="text-4xl font-extrabold text-white">800+</p>
                <p className="mt-2 text-base font-medium text-indigo-200">Faculty</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <p className="text-4xl font-extrabold text-white">75+</p>
                <p className="mt-2 text-base font-medium text-indigo-200">Programs</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <p className="text-4xl font-extrabold text-white">25+</p>
                <p className="mt-2 text-base font-medium text-indigo-200">Years</p>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Programs */}
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Education</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Our Academic Programs
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: 'Undergraduate',
                  icon: FaGraduationCap,
                  description: 'Bachelor degrees in various disciplines with flexible study options.'
                },
                {
                  name: 'Graduate',
                  icon: FaUniversity,
                  description: 'Master and PhD programs with research opportunities.'
                },
                {
                  name: 'Professional',
                  icon: FaUsers,
                  description: 'Certificates and diplomas for career advancement.'
                },
                {
                  name: 'Online',
                  icon: FaAward,
                  description: 'Flexible online programs for remote learners.'
                }
              ].map((program) => (
                <div key={program.name} className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                    <program.icon className="h-6 w-6" />
                  </div>
                  <div className="mt-5">
                    <h3 className="text-lg font-medium text-gray-900">{program.name}</h3>
                    <p className="mt-2 text-base text-gray-500">
                      {program.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Departments Section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Academics</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Our Departments & Subjects
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'Computer Science',
                  subjects: ['Programming', 'Data Structures', 'Algorithms', 'AI', 'Web Development']
                },
                {
                  name: 'Engineering',
                  subjects: ['Mechanical', 'Electrical', 'Civil', 'Chemical', 'Biomedical']
                },
                {
                  name: 'Business',
                  subjects: ['Accounting', 'Finance', 'Marketing', 'Management', 'Economics']
                },
                {
                  name: 'Arts & Sciences',
                  subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Psychology']
                },
                {
                  name: 'Medicine',
                  subjects: ['Anatomy', 'Physiology', 'Pharmacology', 'Pathology', 'Surgery']
                },
                {
                  name: 'Law',
                  subjects: ['Constitutional Law', 'Criminal Law', 'Corporate Law', 'International Law', 'Human Rights']
                }
              ].map((department) => (
                <div key={department.name} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                  </div>
                  <div className="px-6 py-4">
                    <ul className="space-y-2">
                      {department.subjects.map((subject, index) => (
                        <li key={index} className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-indigo-500 mr-2"></span>
                          <span className="text-gray-700">{subject}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-indigo-700">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to begin your journey?</span>
              <span className="block text-indigo-200">Start using our booking system today.</span>
            </h2>
            <div className="mt-8 flex justify-center">
              {currentUser ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600"
                >
                  Get started
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}