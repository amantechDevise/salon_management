import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const PasswordChange = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on change
    setSuccess(""); // Clear success message on change
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    const token = localStorage.getItem("staffToken");

    try {
      await axios.put(
        `${API_BASE_URL}/staffApi/profile/password`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Password changed successfully! Redirecting...");
      setTimeout(() => {
        navigate("/staff-Admin/profile");
      }, 2000);
    } catch (err) {
      console.error("Error changing password:", err);
      setError(
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
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}

          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 ">
              <label className="mb-3 block text-base font-medium text-[#6A64F1]">
                Old Password
              </label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full rounded-md border border-[#6A64F1] py-3 px-6"
              />
            </div>
            <div className="w-full px-3 ">
              <label className="mb-3 block text-base font-medium text-[#6A64F1]">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full rounded-md border border-[#6A64F1] py-3 px-6"
              />
            </div>
            <div className="w-full px-3 ">
              <label className="mb-3 block text-base font-medium text-[#6A64F1]">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-md border border-[#6A64F1] py-3 px-6"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Link
              to="/staff-Admin/profile"
              className="text-[#6A64F1] font-semibold hover:underline"
            >
              Back
            </Link>
            <button
              type="submit"
              className="bg-[#6A64F1] py-3 px-8 text-white rounded-md shadow-md"
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