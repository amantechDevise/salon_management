import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import CustomerDropdown from "../../components/CustomerDropdown";

function AddBooking() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const staffRef = useRef(null);
  const [activeTab, setActiveTab] = useState("services");
  const serviceRef = useRef(null);

  // 🔹 State for form
  const [formData, setFormData] = useState({
    customer_id: "",
    staff_id: [],
    service_id: [],
    package_id: "",
    date: "",
    time: "",
    isRecurring: false,
    frequency: "",
    endDate: "",
  });

  const [dropdownData, setDropdownData] = useState({
    customers: [],
    package_id: [],
    staff: [],
    services: [],
  });

  const [staffDropdownOpen, setStaffDropdownOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

  // 🔹 Common input handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "customer_id"
          ? Number(value)
          : value,
    }));
  };

  // 🔹 Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/getAll`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        setDropdownData({
          customers: res.data.data.customer || [],
          staff: res.data.data.Staff || [],
          services: res.data.data.service || [],
          package: res.data.data.package || [],
        });
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to fetch dropdown data");
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData((prev) => ({
      ...prev,
      service_id: tab === "package" ? [] : prev.service_id,
      package_id: tab === "services" ? "" : prev.package_id,
    }));
  };
  // 🔹 Toggle staff selection
  const toggleStaff = (id) => {
    setFormData((prev) => {
      const staffArr = prev.staff_id.includes(id.toString())
        ? prev.staff_id.filter((sid) => sid !== id.toString())
        : [...prev.staff_id, id.toString()];
      return { ...prev, staff_id: staffArr };
    });
  };

  // 🔹 Toggle service selection
  const toggleService = (id) => {
    setFormData((prev) => {
      const serviceArr = prev.service_id.includes(id.toString())
        ? prev.service_id.filter((sid) => sid !== id.toString())
        : [...prev.service_id, id.toString()];
      return { ...prev, service_id: serviceArr };
    });
  };

const fetchPackages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/packages`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    // filter status = 1
    const activePackages = response.data.data.filter(
      (pkg) => pkg.status === 1
    );

    setPackages(activePackages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    toast.error("Failed to load packages");
  }
};

useEffect(() => {
  fetchPackages();
}, []);


  // 🔹 Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (staffRef.current && !staffRef.current.contains(event.target)) {
        setStaffDropdownOpen(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(event.target)) {
        setServiceDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        staff_id: formData.staff_id.join(","),
        service_id: formData.service_id.join(","),
      };

      await axios.post(`${API_BASE_URL}/api/bookings/add`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      toast.success(
        formData.isRecurring
          ? "Recurring booking added successfully!"
          : "Booking added successfully!"
      );
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
          {/* Customer Dropdown */}
          <div className="flex flex-wrap -mx-3">
            <CustomerDropdown
              formData={formData}
              setFormData={setFormData}
              dropdownData={dropdownData}
            />

            {/* Staff Multi-select */}
            <div className="w-full sm:w-1/2 px-3 mb-5 relative" ref={staffRef}>
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Staff
              </label>
              <div
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] cursor-pointer"
                onClick={() => setStaffDropdownOpen(!staffDropdownOpen)}
              >
                {formData.staff_id.length > 0
                  ? dropdownData.staff
                      .filter((s) =>
                        formData.staff_id.includes(s.id.toString())
                      )
                      .map((s) => s.name)
                      .join(", ")
                  : "Select staff"}
              </div>
              {staffDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                  {dropdownData.staff.map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={s.id}
                        checked={formData.staff_id.includes(s.id.toString())}
                        onChange={() => toggleStaff(s.id)}
                        className="mr-3"
                      />
                      {s.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-3 mb-5">
            <button
              type="button"
              onClick={() => handleTabChange("services")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "services"
                  ? "bg-gradient-to-r from-[#8763DC] to-[#B363E0] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Select Services
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("package")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "package"
                  ? "bg-gradient-to-r from-[#8763DC] to-[#B363E0] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Select Package
            </button>
          </div>

          {/* Services Multi-select */}
          {activeTab === "services" && (
            <div className="w-full mb-5 relative" ref={serviceRef}>
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
                      {s.title} &nbsp; - &nbsp; {s.price}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Package Single-select */}
          {activeTab === "package" && (
            <div className="w-full mb-5">
              <label className="block text-base font-medium text-[#07074D] mb-2">
                Package
              </label>
              <select
                name="package_id"
                value={formData.package_id}
                onChange={handleChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] cursor-pointer"
              >
                <option value="">-- Select Package --</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} &nbsp; - &nbsp; {p.price}
                  </option>
                ))}
              </select>
            </div>
          )}

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
                className="w-full border border-[#e0e0e0] rounded-md py-3 px-4"
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
                className="w-full border border-[#e0e0e0] rounded-md py-3 px-4"
                required
              />
            </div>
          </div>

          {/* Recurring Appointment Toggle */}
          <div className="w-full px-3 mb-5">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
              />
              <span className="text-base font-medium text-[#07074D]">
                Recurring Appointment?
              </span>
            </label>
          </div>

          {/* Frequency + End Date */}
          {formData.isRecurring && (
            <div className="flex flex-wrap -mx-3">
              <div className="w-full sm:w-1/2 px-3 mb-5 ">
                <label className="block text-base font-medium text-[#07074D] mb-2">
                  Frequency
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full border border-[#e0e0e0] rounded-md py-3 px-4"
                  required
                >
                  <option value="">-- Select Frequency --</option>
                  <option value="1">Weekly</option>
                  <option value="2">Monthly</option>
                </select>
              </div>

              <div className="w-full sm:w-1/2 px-3 mb-5">
                <label className="block text-base font-medium text-[#07074D] mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full border border-[#e0e0e0] rounded-md py-3 px-4"
                  required
                />
              </div>
            </div>
          )}

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
              className="rounded-full  bg-gradient-to-r from-[#8763DC] to-[#B363E0] py-3 px-8 text-white font-semibold"
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
