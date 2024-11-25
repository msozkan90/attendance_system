import React, { useState, useEffect } from 'react';
import api from '../services/api';
import NotificationList from '../components/NotificationList';
import Navbar from '../components/Navbar';

const NotificationsPage = ({ isAdmin, setIsAdmin, setIsAuthenticated }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await api.get('/notifications/');
      setNotifications(response.data);
    };
    fetchNotifications();
  }, []);

  return (
    <div>
    <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} setIsAuthenticated={setIsAuthenticated} />
      <div className="p-6">
        <NotificationList notifications={notifications} />
      </div>
    </div>
  );
};

export default NotificationsPage;
