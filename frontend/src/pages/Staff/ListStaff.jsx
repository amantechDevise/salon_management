import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const ListStaff = () => {
  const [products, setProducts] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/staff`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // if auth required
        },
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Optionally show toast or error UI
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`${API_BASE_URL}/admin/staff/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      toast.success("Staff deleted successfully!");
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete product");
    }
  };
    const handleToggleStatus = async (service) => {
    const newStatus = service.status === 1 ? 0 : 1; // switch
    try {
      await axios.patch(
        `${API_BASE_URL}/admin/staff/${service.id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );
      toast.success("Status updated successfully");
      fetchProducts(); // refresh list
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold"> All Staff</h2>
        <Link
          to="/admin/staff/add"
          className="text-white bg-black px-4 py-2 rounded hover:bg-gray-800 transition"
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
            <th className="px-6 py-3">Image</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                <img
                  src="/oder.jpg"
                  alt=""
                  className="inline-block w-70 h-70"
                />
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr
                key={product.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
              >
                <td className="px-6 py-4">{index + 1}</td>

                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {product.name} 
                </td>

                <td className="px-6 py-4">{product.email}</td>
                <td className="px-6 py-4">{product.phone}</td>
                 <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleStatus(product)}
                    className={`px-3 py-1 rounded ${
                      product.status === 1
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {product.status === 1 ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  {product.image ? (
                    <img
                      src={`${API_BASE_URL}${product.image || product.image}`}
                      alt={product.name}
                      className="w-16 h-12 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>

                {/* <td className="px-6 py-4 max-w-xs truncate">{product.description || "-"}</td> */}
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/products/edit/${product.id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/admin/staff/${product.id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                  >
                    View
                  </Link>
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

export default ListStaff;
