// src/context/AppContext.jsx
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);

  const value = {
    sidebarOpen,
    setSidebarOpen,
    currentTeacher,
    setCurrentTeacher
  };

 return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
} 

export function useApp() {
  return useContext(AppContext);
}