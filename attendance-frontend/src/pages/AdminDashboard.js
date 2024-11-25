import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const AdminDashboard = ({ isAdmin, setIsAdmin, setIsAuthenticated }) => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const response = await api.get('/attendance/');
      setAttendanceData(response.data);
    };
    fetchAttendance();
  }, []);

  return (
    <div>
    <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} setIsAuthenticated={setIsAuthenticated} />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Attendance Records</h2>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Employee</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Check-In</th>
              <th className="border border-gray-300 px-4 py-2">Check-Out</th>
              <th className="border border-gray-300 px-4 py-2">Late (Minutes)</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record) => (
              <tr key={record.id}>
                <td className="border border-gray-300 px-4 py-2">{record.user}</td>
                <td className="border border-gray-300 px-4 py-2">{record.date}</td>
                <td className="border border-gray-300 px-4 py-2">{record.check_in_time}</td>
                <td className="border border-gray-300 px-4 py-2">{record.check_out_time}</td>
                <td className="border border-gray-300 px-4 py-2">{record.late_minutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
