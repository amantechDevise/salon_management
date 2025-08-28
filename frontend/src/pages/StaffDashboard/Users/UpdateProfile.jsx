import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const UpdatestaffProfile = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch existing profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("staffToken");
        const res = await axios.get(`${API_BASE_URL}/staffadmin/get-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data.data;
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          image: null,
        });
        if (userData.image) {
          setPreviewImage(`${API_BASE_URL}/${userData.image}`);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [API_BASE_URL]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("staffToken");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await axios.put(`${API_BASE_URL}/staffadmin/update-profile`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
      });
      navigate("/staffadmin/profile"); 
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[50rem] bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Update profile</h2>

        <form onSubmit={handleSubmit}>
          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 ">
              <label className="mb-3 block text-base font-medium text-[#6A64F1]">
                Username
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-[#6A64F1] py-3 px-6"
              />
            </div>
            <div className="w-full px-3 ">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md border border-[#6A64F1] py-3 px-6"
              />
            </div>
          </div>

          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 ">
              <label className="mb-3 block text-base font-medium text-[#6A64F1]">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-md border border-[#6A64F1] py-3 px-6"
              />
            </div>
          </div>

          {/* Image upload + preview */}
          <div className="mb-5">
            <label className="mb-3 block text-base font-medium text-[#6A64F1]">
              Image
            </label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover mb-3"
              />
            )}
            <input type="file" name="image" onChange={handleImageChange} />
          </div>

          <div className="flex justify-between items-center mt-6">
            <Link
              to="/staffadmin/profile"
              className="text-[#6A64F1] font-semibold hover:underline"
            >
              Back
            </Link>
            <button
              type="submit"
              className="bg-[#6A64F1] py-3 px-8 text-white rounded-md shadow-md"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatestaffProfile;
