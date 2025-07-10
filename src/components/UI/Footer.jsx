import { Link } from 'react-router-dom';
import { FaUniversity, FaCalendarAlt, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaUniversity className="text-indigo-400 text-2xl" />
              <span className="text-xl font-bold">Akash University</span>
            </div>
            <p className="text-gray-300">
              Committed to excellence in education, research, and innovation since 1995.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">
                <span className="sr-only">YouTube</span>
                <FaYoutube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                  <FaCalendarAlt className="mr-2 text-indigo-400" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                  <FaCalendarAlt className="mr-2 text-indigo-400" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/academics" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                  <FaCalendarAlt className="mr-2 text-indigo-400" />
                  Academics
                </Link>
              </li>
              <li>
                <Link to="/admissions" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                  <FaCalendarAlt className="mr-2 text-indigo-400" />
                  Admissions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-indigo-400 transition-colors flex items-center">
                  <FaCalendarAlt className="mr-2 text-indigo-400" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-2 text-indigo-400 flex-shrink-0" />
                <span className="text-gray-300">123 Education Avenue, Knowledge City, KC 12345</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 text-indigo-400" />
                <span className="text-gray-300">+91-7376422015</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-indigo-400" />
                <span className="text-gray-300">info@akashuniversity.edu</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">University Newsletter</h3>
            <p className="text-gray-300">
              Subscribe to receive updates on academic programs, events, and important announcements.
            </p>
            <form className="mt-4 sm:flex">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md border-0 text-white focus:ring-2 focus:ring-indigo-500 sm:max-w-xs"
                required
              />
              <button
                type="submit"
                className="mt-3 sm:mt-0 sm:ml-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Akash University. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link to="/accessibility" className="text-gray-400 hover:text-white text-sm">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}