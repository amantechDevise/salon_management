import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Feedlisting = () => {
  const { staffName, token } = useParams();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [staffInfo, setStaffInfo] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  // Fetch staff + rating info
  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/staffApi/feedback/${staffName}/${token}`
        );
        setStaffInfo(res.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Invalid or expired link");
      }
    };
    fetchFeedbackData();
  }, [API_BASE_URL, staffName, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE_URL}/staffApi/feedback/${staffName}/${token}`,
        {
          rating,
          feedback,
        }
      );

      // SweetAlert success
      Swal.fire({
        icon: "success",
        title: "Thank You!",
        text: res.data.message || "Your feedback has been submitted.",
        confirmButtonColor: "#16a34a",
      });

      // Reset form
      setRating(0);
      setFeedback("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  if (message && !staffInfo) {
    return (
      <div className="p-8 text-center text-red-500 font-bold">{message}</div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        {staffInfo ? (
          <>
            <h2 className="text-2xl font-bold mb-2">
              Feedback for {staffInfo.staff_name}
            </h2>
            <p className="text-gray-600 mb-6">Please share your experience</p>

            {/* Star Rating */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-3xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Feedback textarea */}
            <textarea
              className="w-full border rounded-lg p-3 mb-4 focus:ring focus:ring-green-200"
              placeholder="Write your feedback here..."
              rows="4"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Submit Feedback
            </button>
          </>
        ) : (
          <p className="text-gray-600">Loading staff information...</p>
        )}
      </div>
    </div>
  );
};

export default Feedlisting;
