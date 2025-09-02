// src/pages/admin/common/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaUsers,
  FaClipboardList,
  FaConciergeBell,
} from "react-icons/fa";

function AdminSidebar({ userData, isOpen, onClose }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
      isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700 text-white"
    }`;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0  z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 w-64 h-full bg-blue-800 text-white transform 
        transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-64"} 
        md:translate-x-0`}
      >
        <div className="flex items-center justify-center h-16 px-4 bg-blue-900">
          <span className="text-xl font-bold uppercase">Salon Management</span>
        </div>

        <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <nav className="flex-1 space-y-2">
            <NavLink to="/admin/dashboard" className={navLinkClass}>
              <FaTachometerAlt className="mr-3" />
              Dashboard
            </NavLink>

            <NavLink to="/admin/staff" className={navLinkClass}>
              <FaCalendarCheck className="mr-3" />
              All Staff
            </NavLink>

            <NavLink to="/admin/customer" className={navLinkClass}>
              <FaUsers className="mr-3" />
              All Customers
            </NavLink>

            <NavLink to="/admin/services" className={navLinkClass}>
              <FaConciergeBell className="mr-3" />
              Services
            </NavLink>

            <NavLink to="/admin/bookings" className={navLinkClass}>
              <FaClipboardList className="mr-3" />
              Bookings
            </NavLink>
          </nav>
        </div>

        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center">
            <img
              className="w-10 h-10 rounded-full"
              src={
                userData?.image
                  ? `${API_BASE_URL}${userData.image}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="User"
            />
            <div className="ml-3">
              <p className="text-sm font-medium">{userData?.name || "Admin"}</p>
              <p className="text-xs text-blue-200">
                {userData?.email || "admin@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;
