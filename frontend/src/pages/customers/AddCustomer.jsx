import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function AddCustomer() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // States
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [staffDropdownOpen, setStaffDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const staffDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    address: "",
    email: "",
    phone: "",
    service_id: [], // array of string ids
    staff_id: [], // array of string ids (optional)
  });

  const [image, setImage] = useState(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        staffDropdownRef.current &&
        !staffDropdownRef.current.contains(event.target)
      ) {
        setStaffDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch services from API
  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/services`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setServices(response.data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    }
  };

  // Fetch staff from API
  const fetchStaff = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/staff`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    // Sirf role === 3 wale staff hi set karo
    const filteredStaff = response.data.data.filter((user) => user.role === 3);

    setStaff(filteredStaff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    toast.error("Failed to load staff");
  }
};

  useEffect(() => {
    fetchServices();
    fetchStaff();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file select
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Toggle service selection in array
  const toggleService = (id) => {
    setFormData((prev) => {
      let newArray = [...prev.service_id];
      const idStr = id.toString();
      if (newArray.includes(idStr)) {
        newArray = newArray.filter((item) => item !== idStr);
      } else {
        newArray.push(idStr);
      }
      return { ...prev, service_id: newArray };
    });
  };

  // Toggle staff selection in array (if needed)
  const toggleStaff = (id) => {
    setFormData((prev) => {
      let newArray = [...prev.staff_id];
      const idStr = id.toString();
      if (newArray.includes(idStr)) {
        newArray = newArray.filter((item) => item !== idStr);
      } else {
        newArray.push(idStr);
      }
      return { ...prev, staff_id: newArray };
    });
  };

  // Convert selected service ids to names string for dropdown display
  const selectedServicesNames = services
    .filter((s) => formData.service_id.includes(s.id.toString()))
    .map((s) => s.title)
    .join(", ");

  // Same for staff dropdown display
  const selectedStaffNames = staff
    .filter((s) => formData.staff_id.includes(s.id.toString()))
    .map((s) => s.name)
    .join(", ");

  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.service_id.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    // Construct form data for API (including image file)
    const data = new FormData();
    data.append("name", formData.name);
    data.append("dob", formData.dob);
    data.append("address", formData.address);
    data.append("email", formData.email);
    data.append("phone", formData.phone);

    // Join service_id array to comma separated string
    data.append("service_id", formData.service_id.join(","));

    // If staff_id is needed to send, join it too (or remove if backend ignores)
    if (formData.staff_id.length > 0) {
      data.append("staff_id", formData.staff_id.join(","));
    }

    if (image) {
      data.append("image", image);
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/customer/add`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      toast.success("Customer added successfully!");
      navigate("/admin/customer");

      // Reset form
      setFormData({
        name: "",
        dob: "",
        address: "",
        email: "",
        phone: "",
        service_id: [],
        staff_id: [],
      });
      setImage(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add customer");
    }
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Add Customer</h2>
        <form onSubmit={handleSubmit}>
          <div className="-mx-3 flex flex-wrap">
            {/* Services Multi-select */}
            <div className="w-full px-3 sm:w-1/2 relative" ref={dropdownRef}>
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Services
              </label>
              <div
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none cursor-pointer select-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {selectedServicesNames || "Select services"}
              </div>
              {dropdownOpen && (
                <div
                  className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg"
                  style={{ maxHeight: "180px" }}
                >
                  {services.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={service.id}
                        checked={formData.service_id.includes(
                          service.id.toString()
                        )}
                        onChange={() => toggleService(service.id)}
                        className="mr-3"
                      />
                      {service.title}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Staff Multi-select (optional, add UI if needed) */}
            {/* Uncomment this block if you want staff multi-select dropdown */}

            <div
              className="w-full px-3 sm:w-1/2 relative"
              ref={staffDropdownRef}
            >
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Staff
              </label>
              <div
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none cursor-pointer select-none"
                onClick={() => setStaffDropdownOpen(!staffDropdownOpen)}
              >
                {selectedStaffNames || "Select staff"}
              </div>
              {staffDropdownOpen && (
                <div
                  className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg"
                  style={{ maxHeight: "180px" }}
                >
                  {staff.map((member) => (
                    <label
                      key={member.id}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={member.id}
                        checked={formData.staff_id.includes(
                          member.id.toString()
                        )}
                        onChange={() => toggleStaff(member.id)}
                        className="mr-3"
                      />
                      {member.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="w-full px-3 sm:w-1/2">
              <label
                htmlFor="name"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>

            {/* Email */}
            <div className="w-full px-3 sm:w-1/2">
              <label
                htmlFor="email"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>

            {/* Phone */}
            <div className="w-full px-3 sm:w-1/2">
              <label
                htmlFor="phone"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Phone
              </label>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>

            {/* DOB */}
            <div className="w-full px-3 sm:w-1/2">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Date Of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>

            {/* Address */}
            <div className="w-full px-3">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                placeholder="Enter your address"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md resize-y min-h-[100px] max-h-[200px]"
              />
            </div>

            {/* Image Upload (optional) */}
            {/* <div className="w-full px-3 sm:w-1/2">
              <label
                htmlFor="image"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div> */}
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-6">
            <Link
              to="/admin/staff"
              className="text-[#6A64F1] font-semibold hover:underline"
            >
              Back
            </Link>

            <button
              type="submit"
              className="hover:shadow-form rounded-full bg-gradient-to-r from-[#8763DC] to-[#B363E0] py-3 px-8 text-center text-base font-semibold text-white outline-none"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCustomer;
