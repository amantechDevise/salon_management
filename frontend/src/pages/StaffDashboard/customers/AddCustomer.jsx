import React, { useState, useEffect } from "react";
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
    service_id: "",
  });

  const [image, setImage] = useState(null);

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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (image) {
      data.append("image", image);
    }

    try {
      await axios.post(`${API_BASE_URL}/staffadmin/customer/add`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
        },
      });

      toast.success("Customer added successfully!");
      navigate("/staffadmin/customer");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        dob: "",
        address: "",
        service_id: "",
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
      const response = await axios.get(`${API_BASE_URL}/staffadmin/services`, {
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
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label className="mb-3 block text-base font-medium text-[#07074D]">
                  Services
                </label>
                <select
                  name="service_id"
                  value={formData.service_id}
                  onChange={handleChange}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 
                  text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
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

            {/* Image Upload (optional) */}
            {/* <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label className="mb-3 block text-base font-medium text-[#07074D]">
                  Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 
                  text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div> */}
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center mt-6">
            <Link
              to="/staffadmin/customer"
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
