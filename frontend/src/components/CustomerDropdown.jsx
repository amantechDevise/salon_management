import React from "react";
import Select from "react-select";

const CustomerDropdown = ({ formData, setFormData, dropdownData }) => {
  // Prepare customer options
  const customerOptions = dropdownData.customers.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  // Handle change
  const handleCustomerChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      customer_id: selectedOption ? selectedOption.value : "",
    }));
  };

  // Custom styles to match Tailwind select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db", // Focus: blue-500, Default: gray-300
      borderWidth: "1px",
      borderRadius: "0.375rem", // rounded-md
      padding: "0.15rem 0.25rem", // Similar to py-3 px-4
      minHeight: "48px", // py-3 equivalent
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#6b7280", // text-gray-500
      fontSize: "1rem", // text-base
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "1rem",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 20,
    }),
  };

  return (
    <div className="w-full sm:w-1/2 px-3 mb-5">
      <label className="block text-base font-medium text-[#07074D] mb-2">
        Select Customer
      </label>
      <Select
        options={customerOptions}
        value={
          customerOptions.find((opt) => opt.value === formData.customer_id) ||
          null
        }
        onChange={handleCustomerChange}
        placeholder="Search and select customer"
        isClearable
        styles={customStyles}
        className="w-full mt-3"
      />
    </div>
  );
};

export default CustomerDropdown;
