import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const EmployeeDashboard = ({ isAdmin, setIsAdmin, setIsAuthenticated }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);

  const fetchAttendance = async () => {
    try {
      const response = await api.get("/attendance/")
      setAttendanceData(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Unauthorized: Please log in again.");
      } else {
        setError("An error occurred while fetching attendance records.");
      }
    }
  };

  const handleCheckIn = async () => {
    try {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD format
      const formattedTime = today.toTimeString().split(" ")[0]; // HH:MM:SS format

      await api.post("/attendance/", {
        date: formattedDate,
        check_in_time: formattedTime,
      });
      fetchAttendance();
    } catch (err) {
      console.error("Failed to check in", err);
      setError("An error occurred while performing Check-In.");
    }
  };

  const handleCheckOut = async () => {
    try {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD format
      const formattedTime = today.toTimeString().split(" ")[0]; // HH:MM:SS format

      // Get today's attendance record
      const todayRecord = attendanceData.find(
        (record) => record.date === formattedDate
      );

      if (!todayRecord) {
        setError("You need to check in first before checking out.");
        return;
      }

      // Update the check-out time for today's record
      await api.patch(`/attendance/${todayRecord.id}/`, {
        check_out_time: formattedTime,
      });
      fetchAttendance();
    } catch (err) {
      console.error("Failed to check out", err);
      setError("An error occurred while performing Check-Out.");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [isAdmin]);

  return (
    <div>
      <Navbar
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        setIsAuthenticated={setIsAuthenticated}
      />
      <div style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "16px" }}>
          {isAdmin ? "All Employee Attendance Records" : "My Attendance Records"}
        </h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div style={{ marginBottom: "16px", display: "flex", gap: "16px" }}>
          <button
            onClick={handleCheckIn}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Check-In
          </button>
          <button
            onClick={handleCheckOut}
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Check-Out
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ccc" }}>
          <thead>
            <tr>
              {isAdmin && (
                <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
                  Employee
                </th>
              )}
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
                Date
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
                Check-In
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
                Check-Out
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
                Late (Minutes)
              </th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record) => (
              <tr key={record.id}>
                {isAdmin && (
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {record.user}
                  </td>
                )}
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{record.date}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {record.check_in_time}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {record.check_out_time}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {record.late_minutes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
