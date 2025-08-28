import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function AddBooking() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_id: "",
    staff_id: "",
    service_id: "",
    date: "",
    time: "",
  });

  const [dropdownData, setDropdownData] = useState({
    customers: [],
    staff: [],
    services: [],
  });

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/getAll`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        setDropdownData({
          customers: res.data.data.customer || [],
          staff: res.data.data.Staff || [],
          services: res.data.data.service || [],
        });
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to fetch dropdown data");
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/admin/bookings/add`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      toast.success("Booking added successfully!");
      navigate("/admin/bookings");
    } catch (error) {
      toast.error("Failed to add booking");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Add Booking</h2>
        <form onSubmit={handleSubmit}>
  <div className="flex flex-wrap -mx-3">
    {/* Customer Dropdown */}
    <div className="w-full sm:w-1/2 px-3 mb-5">
      <label className="block text-base font-medium text-[#07074D] mb-2">
        Select Customer
      </label>
      <select
        name="customer_id"
        value={formData.customer_id}
        onChange={handleChange}
        className="w-full border rounded-md py-3 px-4"
        required
      >
        <option value="">-- Select Customer --</option>
        {dropdownData.customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>

    {/* Staff Dropdown */}
    <div className="w-full sm:w-1/2 px-3 mb-5">
      <label className="block text-base font-medium text-[#07074D] mb-2">
        Select Staff
      </label>
      <select
        name="staff_id"
        value={formData.staff_id}
        onChange={handleChange}
        className="w-full border rounded-md py-3 px-4"
        required
      >
        <option value="">-- Select Staff --</option>
        {dropdownData.staff.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Service Dropdown */}
  <div className="mb-5">
    <label className="block text-base font-medium text-[#07074D] mb-2">
      Select Service
    </label>
    <select
      name="service_id"
      value={formData.service_id}
      onChange={handleChange}
      className="w-full border rounded-md py-3 px-4"
      required
    >
      <option value="">-- Select Service --</option>
      {dropdownData.services.map((s) => (
        <option key={s.id} value={s.id}>
          {s.title}
        </option>
      ))}
    </select>
  </div>

  {/* Date + Time side by side */}
  <div className="flex flex-wrap -mx-3">
    <div className="w-full sm:w-1/2 px-3 mb-5">
      <label className="block text-base font-medium text-[#07074D] mb-2">
        Date
      </label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full border rounded-md py-3 px-4"
        required
      />
    </div>

    <div className="w-full sm:w-1/2 px-3 mb-5">
      <label className="block text-base font-medium text-[#07074D] mb-2">
        Time
      </label>
      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        className="w-full border rounded-md py-3 px-4"
        required
      />
    </div>
  </div>

  {/* Actions */}
  <div className="flex justify-between items-center mt-6">
    <Link
      to="/admin/bookings"
      className="text-[#6A64F1] font-semibold hover:underline"
    >
      Back
    </Link>
    <button
      type="submit"
      className="rounded-md bg-[#6A64F1] py-3 px-8 text-white font-semibold"
    >
      Add Booking
    </button>
  </div>
</form>

      </div>
    </div>
  );
}

export default AddBooking;
