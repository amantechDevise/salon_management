import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function StaffAdd() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      phone: "",
    });
    setImage(null);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);

    if (image) {
      data.append("image", image);
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/staffApi/staff/add`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("staffToken")}`,
        },
      });

      toast.success("Staff added successfully!");

      // ✅ Clear form before navigating
      setFormData({
        name: "",
        password: "",
        email: "",
        phone: "",
      });
      setImage(null);

      navigate("/staff-Admin/staff");
    } catch (error) {
      toast.error("Failed to add staff");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Staff Add</h2>
        <div className="mx-auto w-full max-w-full bg-white">
          <form onSubmit={handleSubmit}>
            <div className="-mx-3 flex flex-wrap">
              {/* Name */}
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label className="mb-3 block text-base font-medium text-[#07074D]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="new-name"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
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
                    autoComplete="new-email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
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
                    autoComplete="off"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
                <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label className="mb-3 block text-base font-medium text-[#07074D]">
                    Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
            </div>


            {/* Buttons */}
            <div className="flex justify-between items-center mt-6">
              <Link
                to="/staff-Admin/staff"
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
    </div>
  );
}

export default StaffAdd;
