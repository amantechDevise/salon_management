import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Avtar from "/avtar.jpg";
import StatsChart from "../components/StatsChart";
import BusinessOverview from "../components/BusinessOverview";
import { FaUsers, FaUserTie, FaCogs, FaDollarSign } from "react-icons/fa";
function Dashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [dashboardData, setDashboardData] = useState({
    totleUser: 0,
    totleCustomer: 0,
    totleServise: 0,
    loginUser: {},
    dailyStats: [],
    weeklyStats: [],
    monthlyStats: [],
    recentBookings: [],
    businessOverview: {
      totalRevenue: 0,
      dailyRevenue: [],
      weeklyRevenue: [],
      monthlyRevenue: [],
      revenueByService: [],
    },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });

        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Staff */}
        <div className="bg-white rounded-lg shadow p-6">
          <Link to={"/admin/staff"}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <FaUserTie className="text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Staff</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {dashboardData.totleUser}
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Total Customer */}
        <div className="bg-white rounded-lg shadow p-6 ">
          <Link to={"/admin/customer"}>
            <div className="flex items-center ">
              <div className="p-3 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <FaUsers className="text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Customer
                </p>
                <p className="text-2xl font-semibold text-gray-800">
                  {dashboardData.totleCustomer}
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Total Services */}
        <div className="bg-white rounded-lg shadow p-6">
          <Link to={"/admin/services"}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                <FaCogs className="text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Services
                </p>
                <p className="text-2xl font-semibold text-gray-800">
                  {dashboardData.totleServise}
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <FaDollarSign className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-800">
                {dashboardData.businessOverview.totalRevenue}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6">
        <BusinessOverview data={dashboardData.businessOverview} />
      </div>
      {/* Recent Bookings and Room Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Bookings
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Staff
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recentBookings
                  ?.slice(0, 5)
                  .map((booking, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                        {booking.image ? (
                          <img
                            src={`${API_BASE_URL}${
                              booking.customer?.image || customer?.image
                            }`}
                            alt={booking.customer?.name}
                            className="h-10 w-10 rounded-fulll"
                          />
                        ) : (
                          <img
                            src={Avtar}
                            alt={booking.customer?.name}
                            className="h-10 w-10 rounded-full"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.customer?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customer?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {booking.service?.title || booking.package?.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {booking.staff?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                {dashboardData.recentBookings?.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-4 text-sm text-gray-500"
                    >
                      No recent bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Room Status */}
        <div className="bg-white rounded-lg shadow overflow-hidden w-full">
          <StatsChart
            dailyStats={dashboardData.dailyStats}
            weeklyStats={dashboardData.weeklyStats}
            monthlyStats={dashboardData.monthlyStats}
          />
        </div>
      </div>
      {/* Quick Actions */}
    </>
  );
}

export default Dashboard;
