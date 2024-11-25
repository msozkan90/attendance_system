import React, { useState } from 'react';
import api from '../services/api';

const LeaveForm = ({ onLeaveRequested }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leave-requests/', { start_date: startDate, end_date: endDate, reason });
      alert('Leave request submitted successfully');
      onLeaveRequested();
    } catch (error) {
      alert('Error submitting leave request');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <div className="mb-4">
        <label className="block mb-2">Start Date</label>
        <input
          type="date"
          className="border border-gray-300 px-3 py-2 rounded w-full"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">End Date</label>
        <input
          type="date"
          className="border border-gray-300 px-3 py-2 rounded w-full"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Reason</label>
        <textarea
          className="border border-gray-300 px-3 py-2 rounded w-full"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit Request
      </button>
    </form>
  );
};

export default LeaveForm;
