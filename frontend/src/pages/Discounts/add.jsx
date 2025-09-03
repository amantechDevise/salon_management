import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function AddDiscount() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    type: "1", // default percentage
    value: "",
    start_date: "",
    end_date: "",
    status: 1,
  });

  // Generate promo code (3 letters + 3 numbers)
  const generatePromoCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetters = Array.from({ length: 3 }, () =>
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join("");
    const randomNumbers = Math.floor(100 + Math.random() * 900);
    return `${randomLetters}${randomNumbers}`;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle generate button click
  const handleGenerateCode = () => {
    const newCode = generatePromoCode();
    setFormData((prev) => ({ ...prev, code: newCode }));
    toast.info(`Generated Code: ${newCode}`);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.value ||
      !formData.start_date ||
      !formData.end_date
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/admin/discounts/add`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      toast.success("Discount added successfully!");
      navigate("/admin/discounts");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add discount");
    }
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Add Discount</h2>
        <form onSubmit={handleSubmit}>
          <div className="-mx-3 flex flex-wrap">
            {/* Code */}
            <div className="w-full px-3 sm:w-1/2">
              <label className="mb-3 block text-base font-medium">Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Leave blank to auto-generate"
                  className="w-full rounded-md border border-[#e0e0e0] py-3 px-6"
                />
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="w-full px-3 sm:w-1/2">
              <label className="mb-3 block text-base font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-[#e0e0e0] py-3 px-6"
              />
            </div>

            {/* Type */}
            <div className="w-full px-3 sm:w-1/2">
              <label className="mb-3 block text-base font-medium">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-md border border-[#e0e0e0] py-3 px-6"
              >
                <option value="1">Percentage</option>
                <option value="2">Fixed Amount</option>
              </select>
            </div>

            {/* Value */}
            <div className="w-full px-3 sm:w-1/2">
              <label className="mb-3 block text-base font-medium">Value</label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-[#e0e0e0] py-3 px-6"
              />
            </div>

            {/* Start Date */}
            <div className="w-full px-3 sm:w-1/2">
              <label className="mb-3 block text-base font-medium">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-[#e0e0e0] py-3 px-6"
              />
            </div>

            {/* End Date */}
            <div className="w-full px-3 sm:w-1/2">
              <label className="mb-3 block text-base font-medium">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-[#e0e0e0] py-3 px-6"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-6">
            <Link
              to="/admin/discounts"
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

export default AddDiscount;
