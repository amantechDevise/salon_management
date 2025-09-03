import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaClipboardList,
  FaUsers,
  FaConciergeBell,
  FaRegCalendarCheck,
  FaBoxes, // Packages
  FaTags, // Discounts
} from "react-icons/fa";

function StaffSidebar({ userData, isOpen, onClose }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
      isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700 text-white"
    }`;

  return (
    <>
      {/* Transparent Overlay for Mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-30 md:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-blue-800 text-white transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 ease-in-out md:static md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-center h-16 px-4 bg-blue-900">
          <span className="text-xl font-bold uppercase">Salon Management</span>
        </div>

        {/* Navigation */}
        <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <nav className="flex-1 space-y-2">
            <NavLink to="/staff-Admin/dashboard" className={navLinkClass}>
              <FaTachometerAlt className="mr-3" />
              Dashboard
            </NavLink>

            <NavLink to="/staff-Admin/customer" className={navLinkClass}>
              <FaUsers className="mr-3" />
              All Customers
            </NavLink>

            <NavLink to="/staff-Admin/services" className={navLinkClass}>
              <FaConciergeBell className="mr-3" />
              Services
            </NavLink>

            <NavLink to="/staff-Admin/packages" className={navLinkClass}>
              <FaBoxes className="mr-3" />
              Services Packages
            </NavLink>
            {/* <NavLink to="/staff-Admin/discounts" className={navLinkClass}>
              <FaTags className="mr-3" />
              Discounts
            </NavLink> */}
            <NavLink to="/staff-Admin/bookings" className={navLinkClass}>
              <FaClipboardList className="mr-3" />
              Bookings
            </NavLink>

            <NavLink to="/staff-Admin/attendance" className={navLinkClass}>
              <FaRegCalendarCheck className="mr-3" />
              Attendances
            </NavLink>
          </nav>
        </div>

        {/* User Info */}
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
              <p className="text-sm font-medium">{userData?.name || "Staff"}</p>
              <p className="text-xs text-blue-200">
                {userData?.email || "staff@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StaffSidebar;
