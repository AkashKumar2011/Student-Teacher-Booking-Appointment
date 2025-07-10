import { useLocation, Link } from 'react-router-dom';

export default function Unauthorized() {
  const location = useLocation();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Unauthorized Access</h1>
      <p className="mb-2">You don't have permission to view this page.</p>
      {location.state?.requiredRole && (
        <p className="mb-4">
          Required role: <span className="font-semibold">{location.state.requiredRole}</span>
        </p>
      )}
      <Link 
        to="/" 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Return Home
      </Link>
    </div>
  );
}