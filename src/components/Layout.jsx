import Navbar from './UI/Navbar';
import Sidebar from './UI/Sidebar';
import Footer from './UI/Footer';
import { useState } from 'react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Fixed Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex flex-1 pt-16"> {/* Add padding-top to account for fixed navbar */}
        {/* Fixed Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          className="md:block md:fixed md:z-40 md:inset-y-0 md:left-0"
        />
        
        {/* Main content area with scroll */}
        <div className="flex-1 md:pl-64"> {/* Add padding-left to account for fixed sidebar */}
          <main className="flex-1 pb-8">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}