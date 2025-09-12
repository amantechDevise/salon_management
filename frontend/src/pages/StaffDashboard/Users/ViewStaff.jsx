import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";

function StaffView() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const [staff, setStaff] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [activeTab, setActiveTab] = useState("customers");

  // Pagination states
  const [customerPage, setCustomerPage] = useState(1);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const itemsPerPage = 10; // 🔹 You can change this (5 per page)

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/staffApi/staff/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
        },
      });
      const staffData = res.data.data;
      setStaff(staffData);
      setCustomers(staffData.customers || []);
      setRatings(staffData.ratingsReceived || []);
    } catch (err) {
      console.error("Error fetching staff details:", err);
      toast.error("Failed to load staff details");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  if (!staff) {
    return (
      <div className="flex items-center justify-center p-12">
        <p>Loading staff details...</p>
      </div>
    );
  }

  // Paginated data
  const paginatedCustomers = customers.slice(
    (customerPage - 1) * itemsPerPage,
    customerPage * itemsPerPage
  );
  const paginatedRatings = ratings.slice(
    (feedbackPage - 1) * itemsPerPage,
    feedbackPage * itemsPerPage
  );

  // Total pages
  const totalCustomerPages = Math.ceil(customers.length / itemsPerPage);
  const totalFeedbackPages = Math.ceil(ratings.length / itemsPerPage);

  return (
    <>
      {/* Staff Info */}
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Staff  Details</h2>

          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 sm:w-1/2 mb-5">
              <p className="font-medium text-[#07074D] mb-1">Name:</p>
              <p className="text-[#6B7280]">{staff.name}</p>
            </div>
            <div className="w-full px-3 sm:w-1/2 mb-5">
              <p className="font-medium text-[#07074D] mb-1">Email:</p>
              <p className="text-[#6B7280]">{staff.email}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Link
              to="/admin/staff"
              className="text-[#6A64F1] font-semibold hover:underline"
            >
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-12">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab("customers")}
            className={`px-4 py-2 rounded-full bg-gradient-to-r from-[#8763DC] to-[#B363E0] ${
              activeTab === "customers"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-4 py-2 rounded-full bg-gradient-to-r from-[#8763DC] to-[#B363E0] ${
              activeTab === "feedback"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Feedback
          </button>
        </div>

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Customers List</h2>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">SR.NO</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Visit Count</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((cust, index) => (
                    <tr
                      key={cust.id}
                      className="bg-white border-b hover:bg-gray-100"
                    >
                      <td className="px-6 py-4">
                        {(customerPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4">{cust.name || "N/A"}</td>
                      <td className="px-6 py-4">{cust.email || "N/A"}</td>
                      <td className="px-6 py-4">{cust.phone || "N/A"}</td>
                      <td className="px-6 py-4">
                        {cust.service?.title || "N/A"}
                      </td>
                      <td className="px-6 py-4">{cust.visit_count}</td>
                      <td className="px-6 py-4">
                        {new Date(cust.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalCustomerPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() =>
                    setCustomerPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={customerPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalCustomerPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCustomerPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      customerPage === i + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCustomerPage((prev) =>
                      Math.min(prev + 1, totalCustomerPages)
                    )
                  }
                  disabled={customerPage === totalCustomerPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === "feedback" && (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Customer Feedback</h2>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">SR.NO</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Rating</th>
                  <th className="px-6 py-3">Review</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {ratings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No feedback found.
                    </td>
                  </tr>
                ) : (
                  paginatedRatings.map((r, index) => (
                    <tr
                      key={r.id}
                      className="bg-white border-b hover:bg-gray-100"
                    >
                      <td className="px-6 py-4">
                        {(feedbackPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4">{r.customer?.name || "N/A"}</td>
                      <td className="px-6 py-4">
                        {/* ⭐ Star Rating */}
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < r.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">{r.feedback || "N/A"}</td>
                      <td className="px-6 py-4">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalFeedbackPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() =>
                    setFeedbackPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={feedbackPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalFeedbackPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setFeedbackPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      feedbackPage === i + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setFeedbackPage((prev) =>
                      Math.min(prev + 1, totalFeedbackPages)
                    )
                  }
                  disabled={feedbackPage === totalFeedbackPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default StaffView;
