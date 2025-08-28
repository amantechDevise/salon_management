import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
function StaffDashboard() {
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
   const [dashboardData, setDashboardData] = useState({
    totleUser: 0,
    totleCustomer: 0,
    totleServise: 0,
  });
   useEffect(() => {
    const fetchDashboardData = async () => {
      try {
      const response = await axios.get(`${API_BASE_URL}/staffadmin/dashboard`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('staffToken')}`,
  },
});

        // response.data.data me actual counts hain
        setDashboardData(response.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);
  return (

    
<>
  {/* Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 h-full">
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
          <i className="fas fa-bed text-xl" />
        </div>
       <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">Totle Customer</p>
          <p className="text-2xl font-semibold text-gray-800">{dashboardData.totleCustomer}</p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-green-100 text-green-600">
          <i className="fas fa-calendar-check text-xl" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">Totle Servises </p>
          <p className="text-2xl font-semibold text-gray-800">{dashboardData.totleServise}</p>
        </div>
      </div>
    </div>
    {/* <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
          <i className="fas fa-calendar-day text-xl" />
        </div>
         <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">Total Staff</p>
          <p className="text-2xl font-semibold text-gray-800">{dashboardData.totleUser}</p>
        </div>
      </div>
    </div> */}
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-red-100 text-red-600">
          <i className="fas fa-calendar-times text-xl" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">Check-outs Today</p>
          <p className="text-2xl font-semibold text-gray-800">8</p>
        </div>
      </div>
    </div>
  </div>
  {/* Recent Bookings and Room Status */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
    {/* Recent Bookings */}
    <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
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
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      John Smith
                    </div>
                    <div className="text-sm text-gray-500">
                      john@example.com
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Deluxe Suite</div>
                <div className="text-sm text-gray-500">#205</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                15 May 2023
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                20 May 2023
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Checked In
                </span>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      Emily Johnson
                    </div>
                    <div className="text-sm text-gray-500">
                      emily@example.com
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Executive Room</div>
                <div className="text-sm text-gray-500">#312</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                18 May 2023
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                22 May 2023
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  Confirmed
                </span>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://randomuser.me/api/portraits/men/75.jpg"
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      Michael Brown
                    </div>
                    <div className="text-sm text-gray-500">
                      michael@example.com
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Standard Room</div>
                <div className="text-sm text-gray-500">#108</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                20 May 2023
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                25 May 2023
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </td>
            </tr>
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
            <span className="text-sm font-medium text-gray-700">Occupied</span>
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
            <span className="text-sm font-medium text-gray-700">Available</span>
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
          <h3 className="text-md font-medium text-gray-800 mb-3">Room Types</h3>
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
    <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mb-2">
          <i className="fas fa-plus text-lg" />
        </div>
        <span className="text-sm font-medium text-gray-700">New Booking</span>
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
