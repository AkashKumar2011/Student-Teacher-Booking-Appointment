import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUniversity, FaSearch, FaBell, FaUserCircle, FaBars } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function Navbar({ onMenuClick }) {
  const { currentUser, logout, userData, initialCheckComplete } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    const checkViewport = () => {
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkViewport);
    checkViewport(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!initialCheckComplete) {
    return null;
  }

  return (
    <nav className={`fixed w-full z-50 ${scrolled ? 'bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg' : 'bg-gradient-to-r from-indigo-600 to-purple-700'} transition-all duration-300`}>
      
      
     
      
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

           {/* MOBILE: show hamburger only on small screens */}
      <div className="md:hidden flex items-center justify-start ">
        <button onClick={onMenuClick} className="p-2 text-white hover:bg-indigo-700">
          <FaBars className="h-6 w-6" />
        </button>
      </div>


          {/* Logo - Centered on mobile/tablet */}
          <div className="flex flex-1 justify-center md:flex-none md:justify-start">
            <div className='m-0'>
               <Link to="/" className="flex items-center">
                <FaUniversity className="h-8 w-8 text-white" />
                <span className={`ml-2 text-xl font-bold text-white ${isTablet ? 'block' : 'hidden md:block'}`}>
                  Akash University
                </span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation Links - Center aligned */}
          <div className="hidden md:flex md:flex-1 md:justify-center">
            <div className="flex space-x-1 lg:space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                Home
              </Link>
              <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                About
              </Link>
              <Link to="/contact" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* User Controls - Right aligned */}
          <div className="flex items-center justify-end md:flex-1">
            {currentUser ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <FaUserCircle className="h-7 w-7 text-white" />
                  <span className="text-md font-medium text-white truncate max-w-[120px]">
                    {userData?.firstName || currentUser.email.split('@')[0]}
                  </span>
                </div>
                
                {/* <div className="flex space-x-1">
                  <button className="p-2 rounded-full text-white hover:bg-indigo-700 focus:outline-none transition-colors">
                    <FaSearch className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-full text-white hover:bg-indigo-700 focus:outline-none transition-colors">
                    <FaBell className="h-4 w-4" />
                  </button>
                </div>
                 */}
                <button
                  onClick={handleLogout}
                  className="ml-1 px-3 py-1.5 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button - Right aligned */}
            <div className="md:hidden flex items-center">
              {/* {currentUser && (
                <div className="flex items-center mr-3">
                  <FaUserCircle className="h-7 w-7 text-white" />
                </div>
              )} */}
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-700 focus:outline-none"
              >
                <span className="sr-only">Open menu</span>
                <FaBars className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-indigo-600 to-purple-700">
          <div className="px-2 pt-2 pb-3 flex flex-col justify-center items-center space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium  text-white hover:bg-indigo-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>

          <div className="pt-4 pb-3  border border-x-none border-y-white">
            {currentUser ? (
              <>
                <div className="flex justify-center items-center gap-6 px-5 mb-3">
                  <div className="flex ">
                    <FaUserCircle className="h-10 w-10 text-white" />
                    <div className="ml-3 flex flex-col text-white">
                      <div className="text-base font-medium text-white truncate">
                        {userData?.firstName || currentUser.email}
                      </div>
                      <div className="text-sm font-medium text-indigo-200">
                        {userData?.role === 'admin' ? 'Administrator' :
                        userData?.role === 'teacher' ? 'Faculty' : 'Student'}
                      </div>
                    </div>
                  </div>

                  <div className="px-2">
                    <button
                      onClick={handleLogout}
                      className=" w-full px-4 py-1 pb-2 flex items-center rounded-md text-base font-bold bg-white text-indigo-600 hover:bg-indigo-800"
                    >
                      Logout
                    </button>
                  </div>
                  
                </div>
                
                {/* <div className="flex justify-center space-x-3 px-2 mb-3">
                  <button className="p-2 rounded-full bg-white hover:text-indigo-600 focus:outline-none">
                    <FaSearch className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full bg-white hover:text-indigo-600 focus:outline-none">
                    <FaBell className="h-5 w-5" />
                  </button>
                </div> */}
                
                
              </>
            ) : (
              <div className="px-2 flex gap-4 justify-between space-y-1">
                <Link
                  to="/login"
                  className="block w-full px-3 py-2 rounded-md text-base text-center font-medium bg-white text-indigo-600 hover:bg-indigo-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full px-3 py-2 rounded-md text-base text-center font-medium bg-white text-indigo-600 hover:bg-indigo-800"
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