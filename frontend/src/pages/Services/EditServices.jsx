import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditServices() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { id } = useParams(); // service ID from URL

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    duration: "",
    status: 1, // default active
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing service
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/services/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        setFormData({
          title: res.data.data.title,
          price: res.data.data.price,
          status: res.data.data.status,
          duration: res.data.data.duration,
        });
      } catch (error) {
        toast.error("Failed to fetch service");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [API_BASE_URL, id]);

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
    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("status", formData.status);
    data.append("duration", formData.duration);

    if (image) {
      data.append("image", image);
    }

    try {
      await axios.put(`${API_BASE_URL}/api/services/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      toast.success("Service updated successfully!");
      navigate("/admin/services");
    } catch (error) {
      toast.error("Failed to update service");
      console.error(error);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Edit Service</h2>
        <div className="mx-auto w-full max-w-full bg-white">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>

            {/* Price */}
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>

            {/* Status */}
            {/* <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div> */}

            {/* Image */}
            {/* <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div> */}

            <div className="flex justify-between items-center mt-6">
              <Link
                to="/admin/services"
                className="text-[#6A64F1] font-semibold hover:underline"
              >
                Back
              </Link>

              <button
                type="submit"
                className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditServices;
