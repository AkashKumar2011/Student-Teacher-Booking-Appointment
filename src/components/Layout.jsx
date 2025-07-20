import Navbar from './UI/Navbar';
import Sidebar from './UI/Sidebar';
import Footer from './UI/Footer';
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Close sidebar when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex flex-1 md:pt-16"> {/* Add padding-top to account for fixed navbar */}
        {/* Sidebar - Fixed on desktop, overlay on mobile */}
        {sidebarOpen && (
          <div 
            className="fixed z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div 
          className={`fixed z-50 w-55 h-full transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        </div>
        
        {/* Main content area with scroll */}
        <div className="flex-1 md:pl-55 transition-all duration-300"> {/* Add padding-left to account for fixed sidebar */}
          <main className="flex-1 min-h-[calc(100vh-8rem)] p-4 md:p-6">
            {children}
          </main>
          
          {/* Footer */}
          <Footer className="mt-auto" />
        </div>
      </div>
    </div>
  );
}