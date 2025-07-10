import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUniversity, FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { currentUser, logout, userData, initialCheckComplete } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

const handleLogout = async () => {
  try {
    await logout();
    navigate('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};


  // Prevent rendering until Firebase auth check completes
  if (!initialCheckComplete) {
    return null;
  }

  return (
    <nav className={`fixed w-full z-50 ${scrolled ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg' : 'bg-gradient-to-r from-indigo-500 to-purple-600'} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Links */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <FaUniversity className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white hidden md:block">Akash University</span>
            </Link>

            <div className="hidden md:ml-10 md:flex md:space-x-2">
              <Link to="/" className="text-white px-1 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                Home
              </Link>
              <Link to="/about" className="text-white px-1 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                About
              </Link>
              <Link to="/contact" className="text-white px-1 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                Contact
              </Link>
            </div>
          </div>

          {/* Right side - User controls */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <button className="py-1 rounded-full text-white hover:bg-indigo-700 focus:outline-none">
                  <FaSearch className="h-5 w-5" />
                </button>
                <button className="py-1 rounded-full text-white hover:bg-indigo-700 focus:outline-none">
                  <FaBell className="h-5 w-5" />
                </button>

                <div className="flex items-center">
                  <FaUserCircle className="h-8 w-8 text-white" />
                  <span className="ml-2 text-md font-bold text-white">
                    {userData?.firstName || currentUser.email.split('@')[0]}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="ml-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-700 focus:outline-none"
            >
              <span className="sr-only">Open menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-indigo-600 to-purple-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-1 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-1 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-1 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>

          <div className="pt-4 pb-3 border-t border-indigo-700">
            {currentUser ? (
              <>
                <div className="flex items-center px-5">
                  <FaUserCircle className="h-10 w-10 text-white" />
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {userData?.firstName || currentUser.email}
                    </div>
                    <div className="text-sm font-medium text-indigo-200">
                      {userData?.role === 'admin' ? 'Administrator' :
                       userData?.role === 'teacher' ? 'Faculty' : 'Student'}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-700 hover:bg-indigo-800"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-700 hover:bg-indigo-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-700 hover:bg-indigo-800 mt-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
