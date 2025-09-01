import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Listing = () => {
  const [services, setServices] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch services
  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/services`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setServices(response.data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Delete service
// Delete service
const handleDelete = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/admin/services/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });
        toast.success("Service deleted successfully");
        fetchServices(); // refresh list
        Swal.fire("Deleted!", "Your service has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting service:", error);
        toast.error("Failed to delete service");
        Swal.fire("Error!", "Failed to delete the service.", "error");
      }
    }
  });
};


  // Toggle status
  const handleToggleStatus = async (service) => {
    const newStatus = service.status === 1 ? 0 : 1; // switch
    try {
      await axios.patch(
        `${API_BASE_URL}/admin/services/${service.id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );
      toast.success("Status updated successfully");
      fetchServices(); // refresh list
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Services</h2>
        <Link
          to="/admin/services/add"
          className="text-white bg-black px-4 py-2 rounded hover:bg-gray-800 transition"
          style={{ whiteSpace: "nowrap" }}
        >
          Add Services
        </Link>
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">SR.NO</th>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-6">
                <img
                  src="/oder.jpg"
                  alt="No services"
                  className="inline-block w-40 h-40 object-contain"
                />
                <p className="mt-2 text-gray-500">No services found</p>
              </td>
            </tr>
          ) : (
            services.map((service, index) => (
              <tr
                key={service.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {service.title}
                </td>
                <td className="px-6 py-4">{service.price}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleStatus(service)}
                    className={`px-3 py-1 rounded ${
                      service.status === 1
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {service.status === 1 ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/services/${service.id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(service.id)}
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

export default Listing;
