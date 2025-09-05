import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Salon_Bg from "/salonbg.jpg";
import "react-toastify/dist/ReactToastify.css";
function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/staffApi/staffLogin`, {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("staffToken", token);

      toast.success("Login successful 🎉", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/staff-Admin/dashboard");
      }, 1500);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Something went wrong", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <h1 className="text-2xl font-bold mb-5 uppercase text-center text-green-400">
              Staff Login
            </h1>
            <img
              src="https://drive.google.com/uc?export=view&id=1MFiKAExRFF0-2YNpAZzIu1Sh52J8r16v"
              className="w-mx-auto"
              alt="Logo"
            />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <form className="w-full flex-1 mt-8" onSubmit={handleSignup}>
              <div className="mx-auto max-w-xs">
                <input
                  className="w-full px-8 py-4 rounded-lg bg-gray-100 border placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mb-5"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="w-full px-8 py-4 rounded-lg bg-gray-100 border placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mb-5"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {error && (
                  <p className="text-red-500 text-sm mb-3 text-center">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="tracking-wide font-semibold bg-green-400 text-white w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <svg
                    className="w-6 h-6 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy={7} r={4} />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-2">Login</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-1 bg-green-100 text-center hidden lg:flex ">
          <div
            className=" w-full bg-cover bg-center  rounded-r-lg "
            style={{
              backgroundImage: `url(${Salon_Bg})`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default StaffLogin;
