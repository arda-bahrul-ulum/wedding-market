import React from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";

const SelectComponent = ({
  name,
  control,
  options = [],
  placeholder = "Pilih...",
  isDisabled = false,
  isClearable = true,
  isSearchable = true,
  isMulti = false,
  className = "",
  error,
  label,
  value,
  onChange,
  isLoading = false,
  ...props
}) => {
  // Custom styles untuk Select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "38px", // Sama dengan Input (py-2 = 8px top + 8px bottom + 22px text = 38px)
      borderColor: error ? "#ef4444" : state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: error
        ? "0 0 0 1px #ef4444"
        : state.isFocused
        ? "0 0 0 1px #3b82f6"
        : "none",
      "&:hover": {
        borderColor: error ? "#ef4444" : "#9ca3af",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0px 12px", // Sama dengan Input (px-3 = 12px)
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "14px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#374151",
      fontSize: "14px",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#e5e7eb",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#374151",
      fontSize: "14px",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#6b7280",
      "&:hover": {
        backgroundColor: "#ef4444",
        color: "white",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      fontSize: "14px",
      "&:hover": {
        backgroundColor: state.isSelected ? "#3b82f6" : "#f3f4f6",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    loadingIndicator: (provided) => ({
      ...provided,
      color: "#6b7280",
    }),
  };

  // Format options untuk react-select
  const formattedOptions = options.map((option) => {
    if (typeof option === "string") {
      return { value: option, label: option };
    }
    return option;
  });

  // Komponen untuk react-hook-form
  if (control && name) {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <Controller
          name={name}
          control={control}
          rules={props.rules}
          render={({ field }) => {
            const currentValue = formattedOptions.find(
              (option) => option.value === field.value
            );
            return (
              <Select
                {...field}
                value={currentValue || null}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption ? selectedOption.value : "");
                }}
                options={formattedOptions}
                placeholder={placeholder}
                isDisabled={isDisabled}
                isClearable={isClearable}
                isSearchable={isSearchable}
                isMulti={isMulti}
                isLoading={isLoading}
                styles={customStyles}
                className="react-select-container"
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                {...props}
              />
            );
          }}
        />
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    );
  }

  // Komponen standalone
  const currentValue =
    typeof value === "string"
      ? formattedOptions.find((option) => option.value === value)
      : value;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <Select
        value={currentValue || null}
        onChange={onChange}
        options={formattedOptions}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isMulti={isMulti}
        isLoading={isLoading}
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        {...props}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default SelectComponent;
