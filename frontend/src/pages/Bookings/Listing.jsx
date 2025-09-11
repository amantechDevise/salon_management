import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ListBooking = () => {
  const [bookings, setBookings] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setBookings(response.data.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Delete booking
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      toast.success("Booking deleted successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
    }
  };

  // Toggle booking status (active/inactive)
  const handleToggleStatus = async (booking) => {
    const newStatus = booking.status === 1 ? 0 : 1;
    try {
      await axios.patch(
        `${API_BASE_URL}/api/bookings/${booking.id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      toast.success("Status updated successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };
  const paymentStatus = {
    1: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    2: { label: "Paid", color: "bg-green-100 text-green-800" },
    3: { label: "Failed", color: "bg-red-100 text-red-800" },
    4: { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Bookings</h2>
        <Link
          to="/admin/bookings/add"
          className="text-white bg-gradient-to-r from-[#8763DC] to-[#B363E0] px-4 py-2 rounded-full hover:bg-gray-800 transition"
        >
          Add Booking
        </Link>
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">SR.NO</th>
            <th className="px-6 py-3">Staff</th>
            <th className="px-6 py-3">Customer</th>
            <th className="px-6 py-3">Service</th>
            <th className="px-6 py-3">Total Amount</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Time</th>
            <th className="px-6 py-3"> Payment Status</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-6">
                <img
                  src="/oder.jpg"
                  alt="No bookings"
                  className="inline-block w-40 h-40 object-contain"
                />
                <p className="mt-2 text-gray-500">No bookings found</p>
              </td>
            </tr>
          ) : (
            bookings.map((booking, index) => (
              <tr
                key={booking.id}
                className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {booking.staff?.name || "N/A"}
                </td>
                <td className="px-6 py-4">{booking.customer?.name || "N/A"}</td>
                {/* <td className="px-6 py-4">{booking.service?.title || "N/A"}</td> */}
                <td className="px-6 py-4">
                  {booking.bookingServices
                    ?.map((ps) => ps.service?.title)
                    .join(", ") || booking.package?.title} 
                </td>
                <td className="px-6 py-4">
                  {(
                    booking.bookingServices?.reduce(
                      (total, ps) => total + Number(ps.service?.price ||  booking.package?.price),
                      0
                    ) || 0
                  ).toFixed(2)||  booking.package?.price}
                </td>
                <td className="px-6 py-4">
                  {booking.date
                    ? new Date(booking.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>

                <td className="px-6 py-4">
                  {booking.time
                    ? new Date(`1970-01-01T${booking.time}`).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )
                    : "N/A"}
                </td>
                <td className="px-6 py-4">
                  {paymentStatus[booking.status] ? (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        paymentStatus[booking.status].color
                      }`}
                    >
                      {paymentStatus[booking.status].label}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/generate_Invoice/${booking.id}`}
                    className="bg-gradient-to-r from-[#8763DC] to-[#B363E0] text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                  >
                    Generate Invoice
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListBooking;
