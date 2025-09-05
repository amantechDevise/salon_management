import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Avtar from "/avtar.jpg";
import { FaSearch } from "react-icons/fa";

const ListCustomer = () => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // controlled input
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchProducts = async (page = 1, search = "") => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/customer`, {
        params: {
          page: page,
          limit: search ? 10000 : 10, // large limit when searching
          search: search || undefined,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      setProducts(response.data.data || []);
      setMeta(response.data.meta || {});
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load customers");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchProducts(1, value); // always search from page 1
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-semibold">All Customers</h2>

        {/* Search Input */}
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            value={searchQuery || ""} // ensure controlled input
            onChange={handleSearchChange}
            placeholder="Search customers..."
            className="pl-10 pr-4 py-2 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <FaSearch className="absolute top-2.5 left-3 text-gray-500" />
        </div>

        <Link
          to="/admin/customer/add"
          className="text-white bg-black px-4 py-2 rounded hover:bg-gray-800 transition whitespace-nowrap"
        >
          Add Customer
        </Link>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">SR.NO</th>
            {/* <th className="px-6 py-3">Service Name</th>
            <th className="px-6 py-3">Staff Name</th> */}
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Phone No</th>
            <th className="px-6 py-3">Visit Count</th>
            <th className="px-6 py-3">Image</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-4">
                {searchQuery ? (
                  <span className="text-gray-500 text-lg">
                    No customers found for "{searchQuery}"
                  </span>
                ) : (
                  <img
                    src="/oder.jpg"
                    alt="Empty"
                    className="inline-block w-70 h-70"
                  />
                )}
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr
                key={product.id}
                className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700"
              >
                <td className="px-6 py-4">
                  {(currentPage - 1) * 10 + index + 1}
                </td>
                {/* <td className="px-6 py-4">{product.service?.title || "N/A"}</td>
                <td className="px-6 py-4">{product.staff?.name || "N/A"}</td> */}
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {product.name}
                </td>
                <td className="px-6 py-4">{product.email}</td>
                <td className="px-6 py-4">{product.phone}</td>
                <td className="px-6 py-4">{product.visit_count}</td>
                <td className="px-6 py-4">
                  <img
                    src={
                      product.image ? `${API_BASE_URL}${product.image}` : Avtar
                    }
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/view/${product.id}`}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls (hide when searching) */}
      {!searchQuery && meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => fetchProducts(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(meta.totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => fetchProducts(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-black text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => fetchProducts(currentPage + 1)}
            disabled={currentPage === meta.totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ListCustomer;
