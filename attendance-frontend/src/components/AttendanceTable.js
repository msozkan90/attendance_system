import React from 'react';

const AttendanceTable = ({ records }) => {
  return (
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
        {records.map((record) => (
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
  );
};

export default AttendanceTable;
