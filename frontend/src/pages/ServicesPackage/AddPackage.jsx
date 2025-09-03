import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function AddPackage() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // Dropdown refs & states
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Data states
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    service_id: [], // selected services
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch services from API
  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/services`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setServices(res.data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle service selection
  const toggleService = (id) => {
    setFormData((prev) => {
      let updated = [...prev.service_id];
      const idStr = id.toString();
      if (updated.includes(idStr)) {
        updated = updated.filter((s) => s !== idStr);
      } else {
        updated.push(idStr);
      }
      return { ...prev, service_id: updated };
    });
  };

  // Selected services text
  const selectedServicesNames = services
    .filter((s) => formData.service_id.includes(s.id.toString()))
    .map((s) => s.title)
    .join(", ");

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price) {
      toast.error("Please fill title and price");
      return;
    }
    if (formData.service_id.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/admin/packages/add`,
        {
          title: formData.title,
          price: formData.price,
          description: formData.description,
          service_id: formData.service_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      toast.success("Package added successfully!");
      navigate("/admin/packages");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add package");
    }
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Add Package</h2>
        <form onSubmit={handleSubmit}>
          <div className="-mx-3 flex flex-wrap">
            {/* Title */}
            <div className="w-full px-3 sm:w-1/2">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-md border border-[#e0e0e0] py-3 px-6"
              />
            </div>

            {/* Price */}
            <div className="w-full px-3 sm:w-1/2">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full rounded-md border border-[#e0e0e0] py-3 px-6"
              />
            </div>

            {/* Description */}
            <div className="w-full px-3">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-[#e0e0e0] py-3 px-6 resize-y min-h-[100px]"
              />
            </div>

            {/* Services Multi-select */}
            <div className="w-full px-3 relative" ref={dropdownRef}>
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Services
              </label>
              <div
                className="w-full rounded-md border border-[#e0e0e0] py-3 px-6 cursor-pointer bg-white"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {selectedServicesNames || "Select services"}
              </div>
              {dropdownOpen && (
                <div className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
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
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-6">
            <Link
              to="/admin/packages"
              className="text-[#6A64F1] font-semibold hover:underline"
            >
              Back
            </Link>
            <button
              type="submit"
              className="rounded-md bg-[#6A64F1] py-3 px-8 text-white font-semibold"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPackage;
