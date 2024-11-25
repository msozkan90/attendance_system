import React from 'react';

const NotificationList = ({ notifications }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className="border p-2 mb-2 rounded">
              {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
