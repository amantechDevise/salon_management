import React, { useState, useEffect } from "react";

const CategoryModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setStatus(initialData.status !== undefined ? initialData.status : 1);
    } else {
      setName("");
      setStatus(1);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Name is required");
      return;
    }
    onSubmit({ name, status });
  };

  return (
  <div
  className="fixed inset-0 flex items-center justify-center z-50"
  style={{
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    backdropFilter: "blur(6px)",         
    WebkitBackdropFilter: "blur(6px)",  
  }}
>
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Update Category" : "Add Category"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {initialData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
