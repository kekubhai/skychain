import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

interface NotificationToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, type }) => {
  React.useEffect(() => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
        toast(message);
        break;
      case 'warning':
        toast(message, {
          icon: '⚠️',
        });
        break;
    }
  }, [message, type]);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#333',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '0.5rem',
          padding: '1rem',
        },
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

export default NotificationToast; 