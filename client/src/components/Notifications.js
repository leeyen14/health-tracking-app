import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications', {
          headers: accessToken ? { 
            'Authorization': `Bearer ${accessToken}` 
          } : {}
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Notification fetch error:', error);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [accessToken]);

  return (
    <div className="notifications">
      {notifications.map(notification => (
        <div key={notification.id} className="notification-item">
          {notification.message}
        </div>
      ))}
    </div>
  );
};

export default Notifications;