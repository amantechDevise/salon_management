import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const DiscountListing = () => {
  const [discounts, setDiscounts] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch discounts
  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/discounts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setDiscounts(response.data.data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
      toast.error("Failed to load discounts");
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  // ✅ Delete discount with swal
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/api/discounts/delete/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          });

          toast.success("Discount deleted successfully");
          fetchDiscounts(); // refresh list

          Swal.fire("Deleted!", "The discount has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting discount:", error);
          toast.error("Failed to delete discount");
        }
      }
    });
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Discounts</h2>
        <Link
          to="/admin/discounts/add"
          className="text-white bg-black px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Add Discount
        </Link>
      </div>

      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">SR.NO</th>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Code</th>
            <th className="px-6 py-3">Discount</th>
            <th className="px-6 py-3">Start Date</th>
            <th className="px-6 py-3">End Date</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-6">
                <p className="mt-2 text-gray-500">No discounts found</p>
              </td>
            </tr>
          ) : (
            discounts.map((d, index) => (
              <tr key={d.id} className="odd:bg-white even:bg-gray-50 border-b">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {d.title}
                </td>
                <td className="px-6 py-4">{d.code}</td>
                <td className="px-6 py-4">
                  {d.type === 1 ? `${d.value}%` : `₹${d.value}`}
                </td>
                <td className="px-6 py-4">
                  {new Date(d.start_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {new Date(d.end_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DiscountListing;
