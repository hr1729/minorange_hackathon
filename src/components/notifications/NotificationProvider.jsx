import React, { createContext, useContext, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { X } from 'lucide-react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification, notifications }}>
      <Toast.Provider swipeDirection="right">
        {children}
        {notifications.map((notification) => (
          <Toast.Root
            key={notification.id}
            className="bg-white rounded-lg shadow-lg p-4 flex items-start gap-4"
            onOpenChange={(open) => !open && removeNotification(notification.id)}
          >
            <div className="flex-1">
              <Toast.Title className="font-medium mb-1">
                {notification.title}
              </Toast.Title>
              <Toast.Description className="text-sm text-gray-500">
                {notification.message}
              </Toast.Description>
            </div>
            <Toast.Close className="text-gray-400 hover:text-gray-500">
              <X className="w-4 h-4" />
            </Toast.Close>
          </Toast.Root>
        ))}
        <Toast.Viewport className="fixed bottom-0 right-0 p-6 w-96 flex flex-col gap-2 z-50" />
      </Toast.Provider>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
