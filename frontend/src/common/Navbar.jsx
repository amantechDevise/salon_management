// src/pages/admin/common/Navbar.jsx
import React, { useState, useRef } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AdminNavbar = ({ userData, onToggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const timeoutRef = useRef(null);

  const defaultImage = "https://randomuser.me/api/portraits/women/11.jpg";

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      }
    });
  };

  return (
    <header className="relative flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Left Side */}
      <div className="flex items-center">
        <button
          className="md:hidden text-gray-500 focus:outline-none"
          onClick={onToggleSidebar}
        >
          <FaBars className="text-2xl" />
        </button>
        <h1 className="2xl:text-xl  text-[0.75rem] font-semibold text-gray-800 ml-4">Dashboard</h1>
      </div>

      {/* Center */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link
          to={"/admin/bookings/calendar"}
          className="2xl:text-lg text-[0.75rem] font-semibold text-white bg-blue-600 rounded-full px-4 py-2"
        >
          Booking Calendar
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 focus:outline-none">
          <i className="fas fa-bell" />
        </button>
        <button className="text-gray-500 focus:outline-none">
          <i className="fas fa-envelope" />
        </button>

        {/* Profile Dropdown */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="flex items-center focus:outline-none">
            <img
              className="w-9 h-9 rounded-full"
              src={
                userData?.image
                  ? `${API_BASE_URL}${userData.image}`
                  : defaultImage
              }
              alt="User"
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 transition-all duration-300">
              <Link
                to="/admin/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
