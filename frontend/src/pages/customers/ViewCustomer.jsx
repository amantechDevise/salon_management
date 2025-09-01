import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";

function ViewCustomer() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();

  const [staff, setStaff] = useState(null);
  const [visits, setVisits] = useState([]);
  const [totalVisits, setTotalVisits] = useState(0);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/admin/customerDetails/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      const data = res.data.data;

      if (!data || !data.specificCustomer) {
        toast.error("No staff/customer found with the given ID.");
        return;
      }

      // Set staff details from specificCustomer
      setStaff({
        name: data.specificCustomer.staff?.name || data.specificCustomer.name,
        email:
          data.specificCustomer.staff?.email || data.specificCustomer.email,
        phone:
          data.specificCustomer.staff?.phone || data.specificCustomer.phone,
           visit_count :
          data.specificCustomer.staff?.visit_count  || data.specificCustomer.visit_count,
      });

      // Set visits list from allVisits
      setVisits(data.allVisits || [data.specificCustomer]);
      setTotalVisits(data.allVisits?.length || 1);
    } catch (err) {
      console.error("Error fetching staff details:", err);
      toast.error("Failed to load staff details");
    }
  };

  useEffect(() => {
    if (id) fetchStaff();
  }, [id]);

  if (!staff) {
    return (
      <div className="flex items-center justify-center p-12">
        <p>Loading Customer details...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Customer Details</h2>

          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 sm:w-1/2 mb-5">
              <p className="font-medium text-[#07074D] mb-1">Name:</p>
              <p className="text-[#6B7280]">{staff.name}</p>
            </div>

            <div className="w-full px-3 sm:w-1/2 mb-5">
              <p className="font-medium text-[#07074D] mb-1">Email:</p>
              <p className="text-[#6B7280]">{staff.email}</p>
            </div>
            <div className="w-full px-3 sm:w-1/2 mb-5">
              <p className="font-medium text-[#07074D] mb-1">Phone:</p>
              <p className="text-[#6B7280]">{staff.phone}</p>
            </div>
            <div className="w-full px-3 sm:w-1/2 mb-5">
              <p className="font-medium text-[#07074D] mb-1">Total Visits:</p>
              <p className="text-[#6B7280]">{staff.visit_count }</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Link
              to="/admin/customer"
              className="text-[#6A64F1] font-semibold hover:underline"
            >
              ← Back 
            </Link>
          </div>
        </div>
      </div>

      {/* Customers Visit History */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold"> Visit History</h2>
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">SR.NO</th>
              <th className="px-6 py-3">Staff Name</th>
              <th className="px-6 py-3">Service Name</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
       <tbody>
  {visits.length === 0 ? (
    <tr>
      <td colSpan="4" className="text-center py-4">
        No visits found for this customer.
      </td>
    </tr>
  ) : (
    visits.map((visit, index) =>
      visit.customerServices.length > 0 ? (
        visit.customerServices.map((cs, csIndex) => (
          <tr key={`${visit.id}-${csIndex}`} className="bg-white border-b hover:bg-gray-100">
            <td className="px-6 py-4">{csIndex + 1}</td>
            <td className="px-6 py-4">{cs.staff?.name || "N/A"}</td>
            <td className="px-6 py-4">{cs.service?.title || "N/A"}</td>
            <td className="px-6 py-4">{new Date(visit.createdAt).toLocaleDateString()}</td>
          </tr>
        ))
      ) : (
        <tr key={visit.id} className="bg-white border-b hover:bg-gray-100">
          <td className="px-6 py-4">{index + 1}</td>
          <td className="px-6 py-4">N/A</td>
          <td className="px-6 py-4">N/A</td>
          <td className="px-6 py-4">{new Date(visit.createdAt).toLocaleDateString()}</td>
        </tr>
      )
    )
  )}
</tbody>

        </table>
      </div>
    </>
  );
}

export default ViewCustomer;