import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import LeavePage from "./pages/LeavePage";
import AdminLeaveRequestsPage from "./pages/AdminLeaveRequestsPage";
import SignupPage from "./pages/SignupPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <LoginPage
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
            />
          }
        />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              adminOnly={false} // Sadece normal kullanıcılar
            >
              <EmployeeDashboard
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
                setIsAuthenticated={setIsAuthenticated}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leave-requests"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              adminOnly={true} // Sadece admin kullanıcılar
            >
              <AdminLeaveRequestsPage
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
                setIsAuthenticated={setIsAuthenticated}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              adminOnly={true}
            >
              <AdminDashboard
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
                setIsAuthenticated={setIsAuthenticated}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              adminOnly={true}
            >
              <NotificationsPage
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
                setIsAuthenticated={setIsAuthenticated}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leave"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              adminOnly={false} // Hem admin hem kullanıcı
            >
              <LeavePage
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
                setIsAuthenticated={setIsAuthenticated}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
