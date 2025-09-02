// src/pages/admin/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../common/Navbar";
import AdminSidebar from "../common/Sidebar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminLayouts = () => {
  const [userData, setUserData] = useState(null);
  const [dashboardCounts, setDashboardCounts] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // default hidden on mobile
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200 && res.data.data) {
          setUserData(res.data.data.loginUser);
          setDashboardCounts({
            totleUser: res.data.data.totleUser,
            totleCustomer: res.data.data.totleCustomer,
            totleServise: res.data.data.totleServise,
          });
        } else {
          navigate("/admin/login");
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        navigate("/admin/login");
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        userData={userData}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden h-full">
        <AdminNavbar
          userData={userData}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100 h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayouts;
