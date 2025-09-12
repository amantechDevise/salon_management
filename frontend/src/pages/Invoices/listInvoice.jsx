// src/pages/Invoice.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Invoice = () => {
  const { booking_id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/generate_Invoice/${booking_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        if (res.data.success) setInvoice(res.data.data);
      } catch (err) {
        console.error("Error fetching invoice:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [booking_id]);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${booking_id}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  const handlePrint = () => window.print();

  if (loading)
    return <div className="flex justify-center items-center h-screen text-lg font-medium">Loading Invoice...</div>;

  if (!invoice)
    return <div className="flex justify-center items-center h-screen text-red-500 font-semibold">Invoice not found.</div>;

  const { customer, booking, total_amount, final_amount } = invoice;
  const discounts = customer?.discounts || [];

  return (
    <div className="max-w-4xl mx-auto p-8 my-8 bg-gray-100">
      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mb-6 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-lg bg-blue-800 text-white hover:opacity-90 transition-all"
        >
          Print
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 rounded-lg bg-green-700 text-white hover:opacity-90 transition-all"
        >
          Download PDF
        </button>
      </div>

      {/* Invoice Content */}
      <div
        ref={invoiceRef}
        className="shadow-lg rounded-2xl p-8 border bg-white border-gray-300"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Salon Management</h1>
          <p className="text-gray-700">Invoice ID: #{invoice.id}</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          {/* Staff Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Staff Information</h2>
            <p className="text-gray-700">Name: {customer?.staff?.name}</p>
            <p className="text-gray-700">Email: {customer?.staff?.email}</p>
            <p className="text-gray-700">Phone: {customer?.staff?.phone}</p>
          </div>
          {/* Customer Info */}
          <div className="text-right">
            <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
            <p className="text-gray-700">Name: {customer?.name}</p>
            <p className="text-gray-700">Email: {customer?.email}</p>
            <p className="text-gray-700">Phone: {customer?.phone}</p>
            <p className="text-gray-700">Address: {customer?.address}</p>
          </div>
        </div>

        {/* Services Table */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Booking Services</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-2 border">Service</th>
                  <th className="text-left p-2 border">Duration</th>
                  <th className="text-left p-2 border">Price</th>
                </tr>
              </thead>
              <tbody>
                {booking?.bookingServices?.length > 0
                  ? booking.bookingServices.map((bs, idx) => (
                      <tr key={idx}>
                        <td className="p-2 border">{bs.service?.title || booking.package?.title}</td>
                        <td className="p-2 border">{bs.service?.duration || booking.package?.duration || "1.30 Hr"}</td>
                        <td className="p-2 border">₹{bs.service?.price || booking.package?.price}</td>
                      </tr>
                    ))
                  : booking.package && (
                      <tr>
                        <td className="p-2 border">{booking.package.title}</td>
                        <td className="p-2 border">{booking.package.duration || "1.30 Hr"}</td>
                        <td className="p-2 border">₹{booking.package.price}</td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>₹{total_amount}</span>
            </div>

            {discounts.length > 0 &&
              discounts.map((disc, idx) => (
                <div key={idx} className="flex justify-between text-green-600">
                  <span>
                    Discount ({disc.title} - {disc.type === 1 ? `${disc.value}%` : `₹${disc.value}`})
                  </span>
                  <span>- Applied</span>
                </div>
              ))}

            <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-300 pt-2 mt-2">
              <span>Total:</span>
              <span>₹{final_amount}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-gray-500 text-sm">
          Thank you for your booking!
        </div>
      </div>
    </div>
  );
};

export default Invoice;
