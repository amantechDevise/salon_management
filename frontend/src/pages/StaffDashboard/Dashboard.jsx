import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import Avtar from "/avtar.jpg";
import { FaUsers, FaUserTie, FaCogs, FaDollarSign } from "react-icons/fa";
function StaffDashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [attendance, setAttendance] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totleUser: 0,
    totleCustomer: 0,
    totleServise: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/staffAdmin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
            },
          }
        );
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("staffToken");
      const res = await axios.get(`${API_BASE_URL}/staffAdmin/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sorted = res.data.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      const lastThree = sorted.slice(0, 3);

      setAttendance(lastThree);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleAttendance = async () => {
    try {
      const token = localStorage.getItem("staffToken");

      // Agar checkout karna hai to swal confirm
      if (buttonLabel === "Check Out") {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Do you want to check out?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Check Out",
        });

        if (!result.isConfirmed) return; // cancel kare to kuch na ho
      }

      await axios.post(
        `${API_BASE_URL}/staffAdmin/attendance/add`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchAttendance();
    } catch (err) {
      console.error(err);
    }
  };

  const today = moment().format("YYYY-MM-DD");
  const todayRecord = attendance.find(
    (a) => moment(a.date).format("YYYY-MM-DD") === today
  );

  const buttonLabel = !todayRecord
    ? "Check In"
    : todayRecord && !todayRecord.checkOut
    ? "Check Out"
    : "Check In Again"; // ✅ Re-Check-in allowed

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
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
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
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
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <i className="fas fa-calendar-times text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Check-outs Today
              </p>
              <p className="text-2xl font-semibold text-gray-800">8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              All Attendance
            </h2>
            <button
              onClick={handleAttendance}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {buttonLabel}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-in
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendance.map((a) => (
                  <tr key={a.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {a.staffId?.image ? (
                            <img
                              src={`${API_BASE_URL}${a.staffId?.image}`}
                              alt={a.staffId?.name}
                              className="h-12 w-12 object-cover rounded-full"
                            />
                          ) : (
                            <img
                              src={Avtar}
                              alt={a.staffId?.name}
                              className="h-12 w-12 object-cover rounded-full"
                            />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {a.staffId?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {a.staffId?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {moment(a.date).format("DD MMM YYYY")}
                    </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {a.checkIn
    ? moment(a.checkIn, "hh:mm A").format("hh:mm A") // Parse as 12-hour format
    : "--"}
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {a.checkOut
    ? moment(a.checkOut, "hh:mm A").format("hh:mm A") // Parse as 12-hour format
    : "--"}
</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {a.checkOut ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      ) : a.checkIn ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Checked In
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Room Status */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Room Status</h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Occupied
                </span>
                <span className="text-sm font-medium text-gray-700">70%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: "70%" }}
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Available
                </span>
                <span className="text-sm font-medium text-gray-700">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: "30%" }}
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Maintenance
                </span>
                <span className="text-sm font-medium text-gray-700">5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-red-600 h-2.5 rounded-full"
                  style={{ width: "5%" }}
                />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-800 mb-3">
                Room Types
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Standard</span>
                  <span className="text-sm font-medium">40 rooms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Deluxe</span>
                  <span className="text-sm font-medium">35 rooms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Executive</span>
                  <span className="text-sm font-medium">25 rooms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Suite</span>
                  <span className="text-sm font-medium">20 rooms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mb-2">
              <i className="fas fa-plus text-lg" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              New Booking
            </span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mb-2">
              <i className="fas fa-user-check text-lg" />
            </div>
            <span className="text-sm font-medium text-gray-700">Check In</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-200 transition">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mb-2">
              <i className="fas fa-user-times text-lg" />
            </div>
            <span className="text-sm font-medium text-gray-700">Check Out</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mb-2">
              <i className="fas fa-bell text-lg" />
            </div>
            <span className="text-sm font-medium text-gray-700">Requests</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default StaffDashboard;
