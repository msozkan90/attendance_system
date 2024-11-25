import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const AdminLeaveRequestsPage = ({ isAdmin, setIsAdmin, setIsAuthenticated }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/leave-requests/');
      setLeaveRequests(response.data);
    } catch (err) {
      setError('Failed to fetch leave requests.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveRequest = async (id, status) => {
    try {
      await api.patch(`/leave-requests/${id}/`, { status });
      fetchLeaveRequests(); // Güncel listeyi çek
    } catch (err) {
      console.error('Failed to update leave request:', err);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  return (
    <div>
    <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} setIsAuthenticated={setIsAuthenticated} />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Leave Requests</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : leaveRequests.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Employee</th>
                <th className="border border-gray-300 px-4 py-2">Start Date</th>
                <th className="border border-gray-300 px-4 py-2">End Date</th>
                <th className="border border-gray-300 px-4 py-2">Reason</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request.id}>
                  <td className="border border-gray-300 px-4 py-2">{request.user}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.start_date}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.end_date}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.reason}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.status}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => updateLeaveRequest(request.id, 'Approved')}
                          className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateLeaveRequest(request.id, 'Rejected')}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminLeaveRequestsPage;
