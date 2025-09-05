// src/pages/Invoice.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Invoice = () => {
  const { booking_id } = useParams(); // expects route like /invoice/:booking_id
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/admin/generate_Invoice/${booking_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );

        if (res.data.success) {
          setInvoice(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching invoice:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [booking_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium">
        Loading Invoice...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-semibold">
        Invoice not found.
      </div>
    );
  }

  const { customer, booking, total_amount, final_amount, discount } = invoice;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 my-8 border">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
        <p className="text-gray-600">Invoice ID: #{invoice.id}</p>
      </div>

      {/* Customer Info */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Customer Information
        </h2>
        <p className="text-gray-600">Name: {customer?.name}</p>
        <p className="text-gray-600">Email: {customer?.email}</p>
        <p className="text-gray-600">Phone: {customer?.phone}</p>
        <p className="text-gray-600">Address: {customer?.address}</p>
      </div>

      {/* Services Table */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Booking Services
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3 border">Service</th>
                <th className="text-left p-3 border">Duration</th>
                <th className="text-left p-3 border">Price</th>
              </tr>
            </thead>
            <tbody>
              {booking?.bookingServices?.map((bs, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3 border">{bs.service?.title}</td>
                  <td className="p-3 border">{bs.service?.duration} mins</td>
                  <td className="p-3 border">₹{bs.service?.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-1/2 space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>₹{total_amount}</span>
          </div>
          {discount && (
            <div className="flex justify-between text-gray-700">
              <span>
                Discount ({discount.title} -{" "}
                {discount.type === 1
                  ? `${discount.value}%`
                  : `₹${discount.value}`}
                )
              </span>
              <span className="text-green-600">- Applied</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-lg text-gray-800 border-t pt-2">
            <span>Total:</span>
            <span>₹{final_amount}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        Thank you for your booking!
      </div>
    </div>
  );
};

export default Invoice;
