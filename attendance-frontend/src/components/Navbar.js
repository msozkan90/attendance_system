import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isAdmin, setIsAdmin, setIsAuthenticated }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <nav className="bg-blue-500 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Attendance System</h1>
      <ul className="flex space-x-4">
        {isAdmin ? (
          <>
            <li>
              <Link to="/notifications" className="hover:text-gray-200">
                Notifications
              </Link>
            </li>
            <li>
              <Link to="/admin/leave-requests" className="hover:text-gray-200">
                Leave Requests
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-gray-200">
                Admin Panel
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link to="/dashboard" className="hover:text-gray-200">
              Dashboard
            </Link>
          </li>
        )}
        <li>
          <Link to="/leave" className="hover:text-gray-200">
            Leave
          </Link>
        </li>

        <li>
          <Link
            to="/"
            onClick={() => handleLogout()}
            className="hover:text-gray-200"
          >
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
