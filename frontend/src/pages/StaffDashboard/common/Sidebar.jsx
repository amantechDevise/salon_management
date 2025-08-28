import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaClipboardList ,
  FaUsers,
  FaConciergeBell,
} from "react-icons/fa"; 
function StaffSidebar({ userData }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  return (
   <div className="hidden md:flex md:flex-shrink-0">
  <div className="flex flex-col w-64 bg-blue-800 text-white">
    <div className="flex items-center justify-center h-16 px-4 bg-blue-900">
      <span className="text-xl font-bold uppercase">Salon Management</span>
    </div>
    <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
      <nav className="flex-1 space-y-2">
        <Link
          to={"/staffadmin/dashboard"}
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-blue-700 text-white"
        >
          <FaTachometerAlt className="mr-3" />
          Dashboard
        </Link>
        {/* <Link
          to={"/admin/staff"}
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 text-white"
        >
          <i className="fas fa-calendar-check mr-3" />
         All Staff
        </Link> */}
        <Link
          to={"/staffadmin/customer"}
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 text-white"
        >
           <FaUsers className="mr-3" />
          All Customers
        </Link>
      
        <Link
          to={"/staffadmin/services"}
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 text-white"
        >
          <FaConciergeBell className="mr-3" />
          Services
        </Link>
          <Link
          to={"/staffadmin/bookings"}
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 text-white"
        >
             <FaClipboardList className="mr-3" />

          Bookings
        </Link>
        {/* <a
          href="#"
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 text-white"
        >
          <i className="fas fa-chart-bar mr-3" />
          Reports
        </a>
        <a
          href="#"
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 text-white"
        >
          <i className="fas fa-cog mr-3" />
          Settings
        </a> */}
      </nav>
    </div>
    <div className="p-4 border-t border-blue-700">
      <div className="flex items-center">
        <img
          className="w-10 h-10 rounded-full"
             src={
                  
                  (userData?.image
                    ? `${API_BASE_URL}${userData.image}`
                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png")
                }
          alt="User"
        />
        <div className="ml-3">
          <p className="text-sm font-medium">{userData?.name || "Admin"}</p>
          <p className="text-xs text-blue-200">{userData?.email|| "admin@example.com"}</p>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
export default StaffSidebar;
