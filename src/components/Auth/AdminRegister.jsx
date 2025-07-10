  import { useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { useAuth } from '../../context/AuthContext';
  import { toast } from 'react-hot-toast';
  import { FaUser, FaEnvelope, FaIdCard, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
  import { PulseLoader } from 'react-spinners';

  export default function AdminRegister() {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      adminKey: '',
      showPassword: false,
      showConfirmPassword: false
    });
    const [loading, setLoading] = useState(false);
    const { registerAdmin } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      try {
        
        setLoading(true);
        console.log('Form data before registration:', formData);
        const result = await registerAdmin(
          formData.email,
          formData.password,
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
          },
          formData.adminKey
        );
        console.log('Admin registration result:', result);
        
        if (result.success) {
          toast.success('Admin registration successful! Please check your email for verification.');
          navigate('/login');
        }
      } catch (error) {
        toast.error(error.message);
        console.error('Registration error:', error);
      } finally {
        setLoading(false);
      }
    };
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-2 bg-white py-6 px-4 rounded-xl shadow-lg">
          <div className="text-center pb-2">
            <h2 className="text-2xl font-extrabold text-gray-900">Admin Registration</h2>
            <p className="mt-1 text-sm text-gray-600">
              Create an administrator account
            </p>
          </div>

          <form className="space-y-2 px-4 rounded-md" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Key</label>
              <div className="relative">
                <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="adminKey"
                  type="password"
                  required
                  value={formData.adminKey}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter admin registration key"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  type={formData.showPassword ? "text" : "password"}
                  required
                  minLength="8"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                >
                  {formData.showPassword ? (
                    <FaEyeSlash className="text-gray-500 hover:text-gray-700" />
                  ) : (
                    <FaEye className="text-gray-500 hover:text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="confirmPassword"
                  type={formData.showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setFormData(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                >
                  {formData.showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-500 hover:text-gray-700" />
                  ) : (
                    <FaEye className="text-gray-500 hover:text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <PulseLoader color="#ffffff" size={8} className="mr-2" />
                    Registering Admin...
                  </>
                ) : 'Register Admin'}
              </button>
            </div>
          </form>

          <div className="text-sm text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/admin/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    );
}
