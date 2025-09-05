import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";

const AttendanceList = () => {
  const { id } = useParams(); // staff id from URL
  const [attendance, setAttendance] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [staffName, setStaffName] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch staff attendance (listing)
  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/staff/${id}/attendance`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setAttendance(response.data.data.attendance || []);
      setStaffName(response.data.data.name || "");
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to load attendance");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [id]);

  // Fetch attendance by date range (filter)
  const fetchRangeAttendance = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/staff/${id}/range?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setAttendance(response.data.data.attendance || []);
      setStaffName(response.data.data.name || "");
      setCurrentPage(1); // reset pagination
    } catch (error) {
      console.error("Error fetching range attendance:", error);
      toast.error("Failed to load range attendance");
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = attendance.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(attendance.length / itemsPerPage);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-semibold mb-4">
          Attendance - {staffName}
        </h2>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <span>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <button
            onClick={fetchRangeAttendance}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Filter
          </button>
          <button
            onClick={fetchAttendance}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">SR.NO</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Check-in</th>
            <th className="px-6 py-3">Check-out</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-6">
                <p className="mt-2 text-gray-500">No attendance found</p>
              </td>
            </tr>
          ) : (
            currentItems.map((item, index) => (
              <tr key={item.id} className="border-b">
                <td className="px-6 py-4">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-6 py-4">
                  {moment(item.date).format("DD MMM YYYY")}
                </td>
                <td className="px-6 py-4">
                  {item.checkIn
                    ? moment(item.checkIn, "HH:mm").format("hh:mm A")
                    : "--"}
                </td>
                <td className="px-6 py-4">
                  {item.checkOut
                    ? moment(item.checkOut, "HH:mm").format("hh:mm A")
                    : "--"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {attendance.length > itemsPerPage && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
