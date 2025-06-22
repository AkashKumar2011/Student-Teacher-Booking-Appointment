import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUniversity, FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <nav className={`fixed w-full z-50 ${scrolled ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg' : 'bg-gradient-to-r from-indigo-500 to-purple-600 md:bg-gradient-to-r md:from-indigo-500 md:to-purple-600'} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <FaUniversity className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white hidden md:block">Akash University</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-2">
              <Link 
                to="/" 
                className="border-white text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="border-transparent text-white hover:border-gray-300 hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About
              </Link>
              {/* {currentUser && (
                <Link 
                  to="/dashboard" 
                  className="border-transparent text-white hover:border-gray-300 hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              )} */}
              <Link 
                to="/contact" 
                className="border-transparent text-white hover:border-gray-300 hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Contacts
              </Link> 
            </div>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <button className="p-1 rounded-full text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                  <FaSearch className="h-6 w-6" />
                </button>
                <button className="p-1 rounded-full text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                  <FaBell className="h-6 w-6" />
                </button>
                <div className="relative ml-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0">
                      <FaUserCircle className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {currentUser.displayName || currentUser.email.split('@')[0]}
                    </span>           
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-gradient-to-b from-indigo-600 to-purple-700 shadow-lg`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block pl-3 pr-4 py-2 border-l-4 border-white text-base font-medium text-white bg-indigo-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          {currentUser && (
            <Link
              to="/dashboard"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          <Link
            to="/contact"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ContactUs
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-indigo-700">
          {currentUser ? (
            <>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <FaUserCircle className="h-10 w-10 text-white" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {currentUser.displayName || currentUser.email}
                  </div>
                  <div className="text-sm font-medium text-indigo-200">
                    {currentUser.role === 'admin' ? 'Administrator' : 
                     currentUser.role === 'teacher' ? 'Faculty' : 'Student'}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 space-y-1">
              <Link
                to="/login"
                className="block w-full px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block w-full px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}