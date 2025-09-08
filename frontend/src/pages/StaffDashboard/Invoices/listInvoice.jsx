// src/pages/Invoice.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Staff_Invoice = () => {
  const { booking_id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch invoice data
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

  // Download PDF
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        backgroundColor: "#ffffff", // safe white background
      });

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
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium">
        Loading Invoice...
      </div>
    );

  if (!invoice)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-semibold">
        Invoice not found.
      </div>
    );

  const { customer, booking, total_amount, final_amount, discount } = invoice;

  return (
    <div className="max-w-4xl mx-auto p-8 my-8" style={{ backgroundColor: "#f9f9f9" }}>
      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mb-6 print:hidden">
        <button
          onClick={handlePrint}
          style={{ backgroundColor: "#1e40af", color: "#ffffff" }}
          className="px-4 py-2 rounded-lg hover:opacity-90 transition-all"
        >
          Print
        </button>
        <button
          onClick={handleDownloadPDF}
          style={{ backgroundColor: "#047857", color: "#ffffff" }}
          className="px-4 py-2 rounded-lg hover:opacity-90 transition-all"
        >
          Download PDF
        </button>
      </div>

      {/* Invoice Content */}
      <div
        ref={invoiceRef}
        className="shadow-lg rounded-2xl p-8 border"
        style={{
          backgroundColor: "#ffffff", // safe white
          color: "#000000", // safe black text
          borderColor: "#d1d5db", // gray border
        }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 style={{ color: "#111111", fontWeight: "700", fontSize: "24px" }}>
            Salon Management
          </h1>
          <p style={{ color: "#333333" }}>Invoice ID: #{invoice.id}</p>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          {/* Staff Info */}
          <div style={{ textAlign: "left" }}>
            <h2 style={{ color: "#111111", fontWeight: "600", fontSize: "18px" }}>
              Staff Information
            </h2>
            <p style={{ color: "#333333" }}>Name: {customer?.staff?.name}</p>
            <p style={{ color: "#333333" }}>Email: {customer?.staff?.email}</p>
            <p style={{ color: "#333333" }}>Phone: {customer?.staff?.phone}</p>
          </div>
          {/* Customer Info */}
          <div style={{ textAlign: "right" }}>
            <h2 style={{ color: "#111111", fontWeight: "600", fontSize: "18px" }}>
              Customer Information
            </h2>
            <p style={{ color: "#333333" }}>Name: {customer?.name}</p>
            <p style={{ color: "#333333" }}>Email: {customer?.email}</p>
            <p style={{ color: "#333333" }}>Phone: {customer?.phone}</p>
            <p style={{ color: "#333333" }}>Address: {customer?.address}</p>
          </div>
        </div>

        {/* Services Table */}
        <div className="mb-6">
          <h2 style={{ color: "#111111", fontWeight: "600", fontSize: "18px" }}>Booking Services</h2>
          <br />
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#f3f4f6" }}>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px", border: "1px solid #d1d5db" }}>Service</th>
                  <th style={{ textAlign: "left", padding: "8px", border: "1px solid #d1d5db" }}>Duration</th>
                  <th style={{ textAlign: "left", padding: "8px", border: "1px solid #d1d5db" }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {booking?.bookingServices?.map((bs, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>{bs.service?.title}</td>
                    <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>{bs.service?.duration} mins</td>
                    <td style={{ padding: "8px", border: "1px solid #d1d5db" }}>₹{bs.service?.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "50%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#333333" }}>
              <span>Subtotal:</span>
              <span>₹{total_amount}</span>
            </div>
            {discount && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#047857" }}>
                <span>
                  Discount ({discount.title} - {discount.type === 1 ? `${discount.value}%` : `₹${discount.value}`})
                </span>
                <span>- Applied</span>
              </div>
            )}
            <br />
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "600",
              fontSize: "16px",
              borderTop: "1px solid #d1d5db",
              paddingTop: "8px"
            }}>
              <span>Total:</span>
              <span>₹{final_amount}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "16px", textAlign: "center", color: "#555555", fontSize: "12px" }}>
          Thank you for your booking!
        </div>
      </div>
    </div>
  );
};

export default Staff_Invoice;
