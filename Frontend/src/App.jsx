import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import OwnerDashboard from "./pages/owner";
import SeekerDashboard from "./pages/Seeker";
import EditProfilePage from "./pages/editProfileForm";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/edit-profile/:id"
        element={user ? <EditProfilePage /> : <Navigate to="/login" replace />}
      />

      {/* Owner Dashboard */}
      <Route
        path="/owner"
        element={
          user?.role === "owner" ? (
            <OwnerDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Seeker Dashboard */}
      <Route
        path="/seeker"
        element={
          user?.role === "seeker" ? (
            <SeekerDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
