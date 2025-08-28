import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function BookingAdd() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    customer_id: "",

    service_id: [], // array me store hoga
    date: "",
    time: "",
  });

  const [dropdownData, setDropdownData] = useState({
    customers: [],
    staff: [],
    services: [],
  });

  const [staffDropdownOpen, setStaffDropdownOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

  // 🔹 Common input handler
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: name === "customer_id" ? Number(value) : value, // 🔹 convert to integer
  }));
};

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/staffadmin/getAll`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
          },
        });
        setDropdownData({
          customers: res.data.data.customer || [],
       
          services: res.data.data.service || [],
        });
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to fetch dropdown data");
      }
    };
    fetchData();
  }, [API_BASE_URL]);



  // Toggle service selection
  const toggleService = (id) => {
    setFormData((prev) => {
      const serviceArr = prev.service_id.includes(id.toString())
        ? prev.service_id.filter((sid) => sid !== id.toString())
        : [...prev.service_id, id.toString()];
      return { ...prev, service_id: serviceArr };
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        staff_id: formData.staff_id.join(","), // backend expects CSV
        service_id: formData.service_id.join(","),
      };

      await axios.post(`${API_BASE_URL}/staffadmin/bookings/add`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
        },
      });

      toast.success("Booking added successfully!");
      navigate("/staffadmin/bookings");
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

   
          </div>

          {/* Service Multi-select */}
          <div className="w-full px-3 mb-5 relative">
            <label className="mb-3 block text-base font-medium text-[#07074D]">
              Services
            </label>
            <div
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] cursor-pointer"
              onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
            >
              {formData.service_id.length > 0
                ? dropdownData.services
                    .filter((s) =>
                      formData.service_id.includes(s.id.toString())
                    )
                    .map((s) => s.title)
                    .join(", ")
                : "Select services"}
            </div>
            {serviceDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                {dropdownData.services.map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={s.id}
                      checked={formData.service_id.includes(s.id.toString())}
                      onChange={() => toggleService(s.id)}
                      className="mr-3"
                    />
                    {s.title}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Date + Time */}
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

export default BookingAdd;
