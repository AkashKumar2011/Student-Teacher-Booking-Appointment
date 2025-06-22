// src/components/UI/Toast.jsx
import { Toaster } from 'react-hot-toast';

export default function Toast() {
  return (
    <Toaster
      position="top-center"
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#ffffff',
          color: '#374151',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '16px',
          borderRadius: '8px'
        },
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: '#ffffff'
          }
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#ffffff'
          }
        }
      }}
    />
  );
}