import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ListStaff = () => {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalRecords: 0,
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch staff from API
  const fetchStaff = async (page = 1, search = "") => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/staff`, {
        params: {
          page: search ? 1 : page, // if searching, always get first page
          limit: search ? 10000 : pagination.perPage, // large number to get all for search
          search: search || undefined, // send search query if present
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      setStaff(response.data.data);
      if (!search) {
        setPagination({
          currentPage: response.data.meta.currentPage,
          totalPages: response.data.meta.totalPages,
          perPage: response.data.meta.perPage,
          totalRecords: response.data.meta.totalRecords,
        });
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  useEffect(() => {
    fetchStaff(); // initial load
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This staff record will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/api/staff/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          });
          toast.success("Staff deleted successfully!");
          fetchStaff(pagination.currentPage, searchTerm);
          Swal.fire("Deleted!", "Staff has been deleted.", "success");
        } catch (error) {
          console.error("Delete failed:", error);
          toast.error("Failed to delete staff");
          Swal.fire("Error!", "Failed to delete staff.", "error");
        }
      }
    });
  };

  const handleToggleStatus = async (staffMember) => {
    const newStatus = staffMember.status === 1 ? 0 : 1;
    try {
      await axios.patch(
        `${API_BASE_URL}/api/staff/${staffMember.id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      toast.success("Status updated successfully");
      fetchStaff(pagination.currentPage, searchTerm);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handlePageChange = (newPage) => {
    fetchStaff(newPage, searchTerm);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchStaff(1, value); // search always fetches from first page
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Staff</h2>
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search staffs..."
            className="pl-10 pr-4 py-2 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <FaSearch className="absolute top-2.5 left-3 text-gray-500" />
        </div>
        <Link
          to="/admin/staff/add"
          className="text-white bg-gradient-to-r from-[#8763DC] to-[#B363E0] px-4 py-2 rounded-full hover:bg-gray-800 transition"
          style={{ whiteSpace: "nowrap" }}
        >
          Add Staff
        </Link>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">SR.NO</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Phone No</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Attendance</th>
            <th className="px-6 py-3">Image</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {staff.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4">
                {searchTerm ? (
                  <span className="text-gray-500 text-lg">
                    No staff found for "{searchTerm}"
                  </span>
                ) : (
                  <img
                    src="/oder.jpg"
                    alt=""
                    className="inline-block w-70 h-70"
                  />
                )}
              </td>
            </tr>
          ) : (
            staff.map((staffMember, index) => (
              <tr
                key={staffMember.id}
                className="odd:bg-white even:bg-gray-50 border-b"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{staffMember.name}</td>
                <td className="px-6 py-4">{staffMember.email}</td>
                <td className="px-6 py-4">{staffMember.phone}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleStatus(staffMember)}
                    className={`px-3 py-1 rounded ${
                      staffMember.status === 1 ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {staffMember.status === 1 ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/attendance/${staffMember.id}`}
                    className="inline-block px-4 py-2 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-600 hover:text-white transition duration-200"
                  >
                    List Attendance
                  </Link>
                </td>
                <td className="px-6 py-4">
                  {staffMember.image ? (
                    <img
                      src={`${API_BASE_URL}${staffMember.image}`}
                      alt={staffMember.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/staff/${staffMember.id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(staffMember.id)}
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

      {/* Pagination Controls (hide if searching) */}
      {!searchTerm && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ListStaff;
