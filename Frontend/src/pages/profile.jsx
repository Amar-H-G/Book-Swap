import React from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/profileContext";

const Profile = () => {
  const { profile, loading } = useProfile();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load profile.
      </div>
    );
  }

  const joined = new Date(profile.createdAt).toLocaleDateString();

  const handleEdit = () => {
    navigate(`/edit-profile/${profile._id}`);
  };

  const goToHome = () => {
    if (profile.role === "owner") {
      navigate("/owner");
    } else if (profile.role === "seeker") {
      navigate("/seeker");
    } else {
      navigate("/"); // default to home if role is unknown
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex flex-col items-center p-6">
          <img
            src="https://cdn.pixabay.com/photo/2015/11/06/12/41/p-1027211_640.jpg"
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-indigo-400 shadow-sm object-cover"
          />
          <h2 className="mt-4 text-2xl font-bold text-indigo-700">
            {profile.name}
          </h2>
          <p className="text-gray-600">
            {profile.role === "owner" ? "Book Owner" : "Book Seeker"}
          </p>
          <p className="text-sm text-gray-500 text-center mt-2">
            Welcome to your BookSwap profile.
          </p>
        </div>

        <div className="bg-indigo-50 p-4">
          <h3 className="text-indigo-600 font-semibold mb-2">User Info</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              <strong>Email:</strong> {profile.email}
            </li>
            <li>
              <strong>Mobile:</strong> {profile.mobile}
            </li>
            <li>
              <strong>Joined:</strong> {joined}
            </li>
          </ul>
        </div>

        <div className="p-4 flex justify-center gap-4">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-indigo-500 text-white rounded-xl shadow hover:bg-indigo-600 transition"
          >
            Edit Profile
          </button>
          <button
            onClick={goToHome}
            className="px-4 py-2 bg-gray-400 text-white rounded-xl shadow hover:bg-gray-500 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
