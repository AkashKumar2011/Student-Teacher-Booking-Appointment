// src/pages/ContactUs.jsx
import { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';
import { MdOutlineSupportAgent } from 'react-icons/md';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Contact Akash University
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            We're here to help and answer any questions you might have.
          </p>
        </div>

        {/* Contact Information Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Location */}
          <div className="bg-indigo-50 rounded-lg p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
              <FaMapMarkerAlt className="h-6 w-6" />
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-medium text-gray-900">Location</h3>
              <p className="mt-2 text-base text-gray-600">
                123 Education Avenue<br />
                Knowledge City, KC 12345
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-indigo-50 rounded-lg p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
              <FaPhone className="h-6 w-6" />
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-medium text-gray-900">Phone</h3>
              <p className="mt-2 text-base text-gray-600">
                Main: +91-7376422015<br />
                Admissions: +91-7376422015
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="bg-indigo-50 rounded-lg p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
              <FaEnvelope className="h-6 w-6" />
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-medium text-gray-900">Email</h3>
              <p className="mt-2 text-base text-gray-600">
                General: info@akashuniversity.edu<br />
                Admissions: admissions@akashuniversity.edu
              </p>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-indigo-50 rounded-lg p-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
              <FaClock className="h-6 w-6" />
            </div>
            <div className="mt-5">
              <h3 className="text-lg font-medium text-gray-900">Office Hours</h3>
              <p className="mt-2 text-base text-gray-600">
                Monday-Friday: 8:00 AM - 6:00 PM<br />
                Saturday: 9:00 AM - 2:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form and Map */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
            {submitSuccess ? (
              <div className="mt-6 p-4 bg-green-50 rounded-md">
                <p className="text-green-800 font-medium">
                  Thank you for your message! We'll get back to you soon.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-4 text-sm text-green-600 hover:text-green-800 font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <div className="mt-1">
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="Admissions">Admissions</option>
                      <option value="Academic Programs">Academic Programs</option>
                      <option value="Financial Aid">Financial Aid</option>
                      <option value="Student Services">Student Services</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your message here..."
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2 -ml-1 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Map and Support Info */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <iframe
                title="Akash University Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215209179329!2d-73.9878446845938!3d40.74844047932881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU0LjQiTiA3M8KwNTknMTkuMyJX!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="rounded-t-lg"
              ></iframe>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Visit Our Campus</h3>
                <p className="mt-2 text-base text-gray-600">
                  We welcome visitors to our beautiful campus. Schedule a tour through our admissions office.
                </p>
              </div>
            </div>

            {/* Support Information */}
            <div className="bg-indigo-50 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MdOutlineSupportAgent className="h-10 w-10 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Technical Support</h3>
                  <p className="mt-1 text-base text-gray-600">
                    Having issues with our online systems? Contact our IT support team.
                  </p>
                  <div className="mt-2">
                    <a
                      href="mailto:support@akashuniversity.edu"
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      support@akashuniversity.edu
                    </a>
                    <span className="mx-2 text-gray-400">|</span>
                    <span className="text-gray-600">+91-7376422015</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="mt-16 bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900">Emergency Contacts</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Campus Security</h3>
              <p className="mt-1 text-red-600 font-semibold">+91 7376422015</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Health Center</h3>
              <p className="mt-1 text-red-600 font-semibold">+91 7376422015</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Counseling Services</h3>
              <p className="mt-1 text-red-600 font-semibold">+91 7376422015</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}