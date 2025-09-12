import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function AddstaffCustomer() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    staff_id: [], // added staff_id array
    // service_id: [],
  });

  const [image, setImage] = useState(null);

  // Dropdown open state
  const [dropdownOpen, setDropdownOpen] = useState(false); // for services
  const [staffDropdownOpen, setStaffDropdownOpen] = useState(false); // for staff
  const dropdownRef = useRef();
  const staffRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (staffRef.current && !staffRef.current.contains(event.target)) {
        setStaffDropdownOpen(false);
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

  // Toggle staff selection
  const toggleStaff = (id) => {
    setFormData((prev) => {
      const selected = prev.staff_id;
      if (selected.includes(id.toString())) {
        return {
          ...prev,
          staff_id: selected.filter((sid) => sid !== id.toString()),
        };
      } else {
        return {
          ...prev,
          staff_id: [...selected, id.toString()],
        };
      }
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        data.append(key, formData[key].join(","));
      } else {
        data.append(key, formData[key]);
      }
    });

    if (image) {
      data.append("image", image);
    }

    try {
      await axios.post(`${API_BASE_URL}/staffApi/customer/add`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
        },
      });

      toast.success("Customer added successfully!");
      navigate("/staff-Admin/customer");

      setFormData({
        name: "",
        email: "",
        phone: "",
        dob: "",
        address: "",
        staff_id: [],
        // service_id: [],
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
      const response = await axios.get(`${API_BASE_URL}/staffApi/services`, {
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

  // Fetch staff list
  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staffApi/staff`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
        },
      });
      setStaff(response.data.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Failed to load staff");
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchServices();
  }, []);

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

            {/* Staff Dropdown */}
            <div className="w-full sm:w-1/2 px-3 mb-5 relative" ref={staffRef}>
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Staff
              </label>
              <div
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] cursor-pointer"
                onClick={() => setStaffDropdownOpen(!staffDropdownOpen)}
              >
                {formData.staff_id.length > 0
                  ? staff
                      .filter((s) => formData.staff_id.includes(s.id.toString()))
                      .map((s) => s.name)
                      .join(", ")
                  : "Select staff"}
              </div>
              {staffDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                  {staff.map((s) => (
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
              className="hover:shadow-form rounded-full bg-gradient-to-r from-[#8763DC] to-[#B363E0] 
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
