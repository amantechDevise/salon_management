import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Avtar from "/avtar.jpg";
import { toast } from "react-toastify";

const ListStaffCustomer = () => {
  const [products, setProducts] = useState([]);
  const [loadingLinkId, setLoadingLinkId] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staffAdmin/customer`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
        },
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleGenerateLink = async (customerId) => {
    try {
      setLoadingLinkId(customerId);
      const res = await axios.post(
        `${API_BASE_URL}/staffAdmin/generate`,
        { customer_id: customerId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
          },
        }
      );
      setLoadingLinkId(null);

      const { link } = res.data;
      toast.success("Feedback link generated!");

      // Show link in alert or copy to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(link);
        toast.info("Link copied to clipboard!");
      } else {
        alert(`Feedback link: ${link}`);
      }
    } catch (error) {
      setLoadingLinkId(null);
      console.error("Generate link failed:", error);
      toast.error(error.response?.data?.message || "Failed to generate link");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    try {
      await axios.delete(`${API_BASE_URL}/admin/products/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
        },
      });

      toast.success("Customer deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete customer");
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Customers</h2>
        <Link
          to="/staff-Admin/customer/add"
          className="text-white bg-black px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Add Customer
        </Link>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">SR.NO</th>
            <th className="px-6 py-3">Service Name</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Phone No</th>
            <th className="px-6 py-3">Visit Count</th>
            <th className="px-6 py-3">Image</th>
            <th className="px-6 py-3">Generate Link</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-4">
                <img src="/oder.jpg" alt="" className="inline-block w-70 h-70" />
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr
                key={product.id}
                className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{product.service?.title || "N / A"}</td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {product.name}
                </td>
                <td className="px-6 py-4">{product.email}</td>
                <td className="px-6 py-4">{product.phone}</td>
                <td className="px-6 py-4">{product.visit_count}</td>
                <td className="px-6 py-4">
                  {product.image ? (
                    <img
                      src={`${API_BASE_URL}${product.image}`}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  ) : (
                    <img
                      src={Avtar}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleGenerateLink(product.id)}
                    disabled={loadingLinkId === product.id}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    {loadingLinkId === product.id ? "Generating..." : "Generate Link"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(product.id)}
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

export default ListStaffCustomer;
