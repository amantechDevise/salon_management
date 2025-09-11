// src/pages/admin/common/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt, // Dashboard
  FaUserTie, // Staff
  FaUsers, // Customers
  FaConciergeBell, // Services
  FaBoxes, // Packages
  FaTags, // Discounts
  FaCalendarAlt, // Bookings
} from "react-icons/fa";

function AdminSidebar({ userData, isOpen, onClose }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
      isActive ? "bg-white text-black" : "hover:bg-[#B363E0] text-white"
    }`;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0  z-30 md:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
   <div
  className={`fixed md:relative z-40 w-64 h-full text-white transform 
    transition-transform duration-300 
    bg-gradient-to-r from-[#8763DC] to-[#B363E0]
    ${isOpen ? "translate-x-0" : "-translate-x-64"} 
    md:translate-x-0`}
>
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-[#8763DC] to-[#B363E0]">
          <span className="text-xl font-bold uppercase">Salon Management</span>
        </div>

        <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <nav className="flex-1 space-y-2">
            <NavLink to="/admin/dashboard" className={navLinkClass}>
              <FaTachometerAlt className="mr-3" />
              Dashboard
            </NavLink>

            <NavLink to="/admin/staff" className={navLinkClass}>
              <FaUserTie className="mr-3" />
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

            <NavLink to="/admin/packages" className={navLinkClass}>
              <FaBoxes className="mr-3" />
              Service Packages
            </NavLink>

            <NavLink to="/admin/discounts" className={navLinkClass}>
              <FaTags className="mr-3" />
              Discounts
            </NavLink>

            <NavLink to="/admin/bookings" className={navLinkClass}>
              <FaCalendarAlt className="mr-3" />
              Bookings
            </NavLink>
          </nav>
        </div>

        {/* Footer User Info */}
        <div className="p-4 border-t border-white/30">
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
              <p className="text-xs text-white">
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
