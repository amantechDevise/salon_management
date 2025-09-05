import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserstaffProfile = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch current user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("staffToken");
        const res = await axios.get(`${API_BASE_URL}/staffApi/get-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  // Image change handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      updateProfile({ image: file });
    }
  };

  // Update Profile API call
  const updateProfile = async (data) => {
    try {
      setUploading(true);
      const token = localStorage.getItem("staffToken");

      const formData = new FormData();
      if (data.image) formData.append("image", data.image);
      // if (data.first_name) formData.append("first_name", data.first_name);
      // if (data.email) formData.append("email", data.email);
      // if (data.phone) formData.append("phone", data.phone);

      const res = await axios.put(
        `${API_BASE_URL}/staffApi/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data.data);
      setUploading(false);
    } catch (error) {
      console.error("Update error:", error);
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={
                  previewImage ||
                  (user?.image
                    ? `${API_BASE_URL}${user.image}`
                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png")
                }
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <label
                htmlFor="image"
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100"
              >
                <i className="ri-camera-line text-indigo-600" />
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Name + Email */}
            <div>
              <h2 className="text-3xl font-bold">{user.name}</h2>
              <p className="text-sm opacity-90">{user.email}</p>
            </div>
          </div>

          {/* Profile Body */}
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Phone</p>
                <p className="font-medium">{user.phone || "N/A"}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/staff-Admin/update-profile")}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-md transition"
              >
                <i className="ri-edit-2-line" /> Edit Profile
              </button>
            </div>

            {uploading && (
              <p className="text-indigo-600 text-sm">Uploading image...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserstaffProfile;
