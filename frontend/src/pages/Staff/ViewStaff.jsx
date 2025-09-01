import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";

function ViewStaff() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const [staff, setStaff] = useState(null);
  const [customers, setCustomers] = useState([]);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/staff/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      const staffData = res.data.data;
      setStaff(staffData);
      setCustomers(staffData.customers || []);
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

  return (
    <>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Staff Details</h2>

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

      {/* Customers Listing */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Customers List</h2>
        </div>
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
              customers.map((cust, index) => (
                <tr
                  key={cust.id}
                  className="bg-white border-b hover:bg-gray-100"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{cust.name || "N/A"}</td>
                  <td className="px-6 py-4">{cust.email || "N/A"}</td>
                  <td className="px-6 py-4">{cust.phone || "N/A"}</td>
                  <td className="px-6 py-4">{cust.service?.title || "N/A"}</td>
                  <td className="px-6 py-4">{cust.visit_count}</td>
                  <td className="px-6 py-4">
                    {new Date(cust.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ViewStaff;
