import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const ListingPackage = () => {
  const [packages, setPackages] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch packages
  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/packages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setPackages(response.data.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to load packages");
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // ✅ Delete package with swal
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This package will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/api/packages/delete/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          });

          toast.success("Package deleted successfully");
          fetchPackages(); // refresh list

          Swal.fire("Deleted!", "The package has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting package:", error);
          toast.error("Failed to delete package");
        }
      }
    });
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Packages</h2>
        <Link
          to="/admin/packages/add"
          className="text-white bg-black px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Add Package
        </Link>
      </div>

      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">SR.NO</th>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Services</th>
            <th className="px-6 py-3">Start Date</th>
            <th className="px-6 py-3">End Date</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-6">
                <p className="mt-2 text-gray-500">No packages found</p>
              </td>
            </tr>
          ) : (
            packages.map((pkg, index) => (
              <tr
                key={pkg.id}
                className="odd:bg-white even:bg-gray-50 border-b"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {pkg.title}
                </td>
                <td className="px-6 py-4">₹{pkg.price}</td>
                <td className="px-6 py-4">
                  {pkg.packageServices
                    ?.map((ps) => ps.service?.title)
                    .join(", ")}
                </td>
                <td className="px-6 py-4">
                  {new Date(pkg.start_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {new Date(pkg.end_date).toLocaleDateString()}
                </td>
                   <td className="px-6 py-4">
                  {pkg.status === 1 ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDelete(pkg.id)}
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

export default ListingPackage;
