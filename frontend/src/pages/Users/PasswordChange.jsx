import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
// Import ToastContainer and toast
import { ToastContainer, toast } from 'react-toastify';
// Import toastify CSS
import 'react-toastify/dist/ReactToastify.css';

// Import react-icons
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordChange = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle password visibility for a specific input
  const toggleShowPassword = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validations
    if (!formData.password || !formData.newPassword || !formData.confirmNewPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    const token = localStorage.getItem("adminToken");

    try {
      await axios.put(
        `${API_BASE_URL}/api/profile/change-password`,
        {
          password: formData.password,
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmNewPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Password changed successfully! Redirecting...");
      setTimeout(() => navigate("/admin/dashboard"), 2000);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to change password. Please check your old password."
      );
    }
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[50rem] bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Change Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="-mx-3 flex flex-wrap">
            {/* Old Password Input */}
            <div className="w-full px-3 relative">
              <label className="mb-2 block text-base font-medium text-[#6A64F1]">
                Old Password
              </label>
              <input
                type={showPassword.password ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-md border border-[#6A64F1] py-3 px-6 pr-12"
                placeholder="Enter old password"
              />
              <span
                className="absolute right-6 top-1/2 mt-4 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => toggleShowPassword("password")}
              >
                {showPassword.password ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* New Password Input */}
            <div className="w-full px-3 mt-4 relative">
              <label className="mb-2 block text-base font-medium text-[#6A64F1]">
                New Password
              </label>
              <input
                type={showPassword.newPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full rounded-md border border-[#6A64F1] py-3 px-6 pr-12"
                placeholder="Enter new password"
              />
              <span
                className="absolute right-6 top-1/2 mt-4 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => toggleShowPassword("newPassword")}
              >
                {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm New Password Input */}
            <div className="w-full px-3 mt-4 relative">
              <label className="mb-2 block text-base font-medium text-[#6A64F1]">
                Confirm New Password
              </label>
              <input
                type={showPassword.confirmNewPassword ? "text" : "password"}
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="w-full rounded-md border border-[#6A64F1] py-3 px-6 pr-12"
                placeholder="Re-enter new password"
              />
              <span
                className="absolute right-6 top-1/2 mt-4 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => toggleShowPassword("confirmNewPassword")}
              >
                {showPassword.confirmNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Link
              to="/admin/dashboard"
              className="text-[#6A64F1] font-semibold hover:underline"
            >
              Back
            </Link>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#8763DC] to-[#B363E0] py-3 px-8 text-white rounded-full shadow-md hover:bg-[#5548c8] transition"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChange;