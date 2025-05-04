// src/context/profileContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./authContext";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    success: false,
    message: ""
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!user?.id) return;
      
      const res = await axios.get(`https://book-swap-backend-946c.onrender.com/api/users/${user.id}`);
      setProfile(res.data.user);
    } catch (err) {
      console.error("Failed to fetch profile", err);
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      setUpdateStatus({ loading: true, success: false, message: "" });
      if (!user?.id) throw new Error("No user ID available");
      
      const res = await axios.patch(
        `https://book-swap-backend-946c.onrender.com/api/users/${user.id}`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setProfile(res.data.user);
      setUpdateStatus({
        loading: false,
        success: true,
        message: "Profile updated successfully"
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateStatus(prev => ({ ...prev, message: "" }));
      }, 3000);
      
      return res.data;
    } catch (err) {
      console.error("Failed to update profile", err);
      setUpdateStatus({
        loading: false,
        success: false,
        message: err.response?.data?.message || "Failed to update profile"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        updateProfile,
        updateStatus,
        refreshProfile: fetchProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
