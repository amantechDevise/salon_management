import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function AddstaffCustomer() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    service_id: [], // store as array
  });

  const [image, setImage] = useState(null);

  // Dropdown open state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle checkbox toggle for services
  const toggleService = (id) => {
    setFormData((prev) => {
      const selected = prev.service_id;
      if (selected.includes(id.toString())) {
        // Remove
        return {
          ...prev,
          service_id: selected.filter((sid) => sid !== id.toString()),
        };
      } else {
        // Add
        return {
          ...prev,
          service_id: [...selected, id.toString()],
        };
      }
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.service_id.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "service_id") {
        data.append(key, formData.service_id.join(","));
      } else {
        data.append(key, formData[key]);
      }
    });

    if (image) {
      data.append("image", image);
    }

    try {
      await axios.post(`${API_BASE_URL}/staffAdmin/customer/add`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
        },
      });

      toast.success("Customer added successfully!");
      navigate("/staff-Admin/customer");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        dob: "",
        address: "",
        service_id: [],
      });
      setImage(null);
    } catch (error) {
      toast.error("Failed to add customer");
      console.error(error);
    }
  };

  // Fetch services list
  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staffAdmin/services`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
        },
      });
      setServices(response.data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Helper to show selected service names in dropdown label
  const selectedServicesNames = services
    .filter((s) => formData.service_id.includes(s.id.toString()))
    .map((s) => s.title)
    .join(", ");

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Add Customer</h2>
        <form onSubmit={handleSubmit}>
          <div className="-mx-3 flex flex-wrap">
            {/* Name */}
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label className="mb-3 block text-base font-medium text-[#07074D]">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 
                  text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div>

            {/* Email */}
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label className="mb-3 block text-base font-medium text-[#07074D]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 
                  text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label className="mb-3 block text-base font-medium text-[#07074D]">
                  Phone
                </label>
                <input
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 
                  text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div>

            {/* DOB */}
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label className="mb-3 block text-base font-medium text-[#07074D]">
                  Date Of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 
                  text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div>

            {/* Services */}
            <div className="w-full px-3 sm:w-1/2 relative" ref={dropdownRef}>
              <div className="mb-5">
                <label className="mb-3 block text-base font-medium text-[#07074D]">
                  Services
                </label>
                <div
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 
                  text-base text-[#6B7280] outline-none cursor-pointer select-none"
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
                          checked={formData.service_id.includes(service.id.toString())}
                          onChange={() => toggleService(service.id)}
                          className="mr-3"
                        />
                        {service.title}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="w-full px-3">
              <div className="mb-5">
                <label className="mb-3 block text-base font-medium text-[#07074D]">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter your address"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 
                  text-base text-[#6B7280] outline-none focus:border-[#6A64F1] 
                  focus:shadow-md resize-y min-h-[100px] max-h-[200px]"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center mt-6">
            <Link
              to="/staff-Admin/customer"
              className="text-[#6A64F1] font-semibold hover:underline"
            >
              Back
            </Link>

            <button
              type="submit"
              className="hover:shadow-form rounded-md bg-[#6A64F1] 
              py-3 px-8 text-center text-base font-semibold text-white outline-none"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddstaffCustomer;
