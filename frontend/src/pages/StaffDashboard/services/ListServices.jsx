import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ListServices = () => {
  const [services, setServices] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch services
  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staffAdmin/services`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("staffToken")}`, // staff token required
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

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Services</h2>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">SR.NO</th>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Price</th>
            {/* <th className="px-6 py-3">Image</th> */}
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-6">
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
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {service.title}
                </td>
                <td className="px-6 py-4">{service.price}</td>
                {/* <td className="px-6 py-4">
                  {service.image ? (
                    <img
                      src={`${API_BASE_URL}${service.image}`}
                      alt={service.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListServices;
