// src/pages/admin/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StaffNavbar from './common/Navbar';
import StaffSidebar from './common/Sidebar';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StaffLayouts = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
const [dashboardCounts, setDashboardCounts] = useState({});
useEffect(() => {
  const token = localStorage.getItem('staffToken');
  if (!token) {
    navigate('/admin/staff-login'); // Redirect if no token
    return;
  }

 const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/staffadmin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 && res.data.data) {
        setUserData(res.data.data.loginUser); // ✅ admin info
        setDashboardCounts({
          totleUser: res.data.data.totleUser,
          totleCustomer: res.data.data.totleCustomer,
          totleServise: res.data.data.totleServise,
        });
      } else {
        navigate('/admin/staff-login');
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      navigate('/admin/staff-login');
    }
  };

  fetchDashboardData();
}, [navigate]);


  return (
<div className="flex w-full h-full  overflow-hidden">
  <StaffSidebar userData={userData}/>
  <div className="flex flex-col flex-1 overflow-hidden h-full">
    <StaffNavbar userData={userData} />
    <main className="flex-1 overflow-y-auto p-6 bg-gray-100 h-full">
      <Outlet />
    </main>
  </div>
</div>


  );
};

export default StaffLayouts;
