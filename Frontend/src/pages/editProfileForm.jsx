import React, { useState, useEffect } from "react";
import { useProfile } from "../context/profileContext";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const { profile, updateProfile, updateStatus } = useProfile();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        mobile: profile.mobile || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      navigate("/profile");
    } catch (err) {
      // Handled by context
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 px-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">Edit Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 py-6 space-y-5"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Mobile</label>
          <input
            type="text"
            name="mobile"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Profile
        </button>

        {updateStatus.message && (
          <p className="text-center mt-4 text-sm text-green-600">
            {updateStatus.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default EditProfilePage;
