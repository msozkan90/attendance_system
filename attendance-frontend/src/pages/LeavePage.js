import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LeaveForm from '../components/LeaveForm';
import Navbar from '../components/Navbar';

const LeavePage = ({ isAdmin, setIsAdmin, setIsAuthenticated }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  const fetchLeaveRequests = async () => {
    const response = await api.get('/leave-requests/mine/');
    setLeaveRequests(response.data);
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  return (
    <div>
      <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} setIsAuthenticated={setIsAuthenticated} />
      <div className="p-6">
        <LeaveForm onLeaveRequested={fetchLeaveRequests} />
        <h2 className="text-xl font-bold mt-8">My Leave Requests</h2>
        <ul>
          {leaveRequests.map((leave) => (
            <li key={leave.id} className="border p-2 mb-2 rounded">
              {leave.start_date} to {leave.end_date}: {leave.reason} ({leave.status})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LeavePage;
