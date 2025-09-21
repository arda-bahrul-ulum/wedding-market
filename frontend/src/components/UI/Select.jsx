import React from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";
import clsx from "clsx";

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
  required = false,
  helperText,
  ...props
}) => {
  // Custom styles untuk Select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "48px",
      borderColor: error ? "#ef4444" : state.isFocused ? "#0ea5e9" : "#d1d5db",
      borderRadius: "12px",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(4px)",
      boxShadow: error
        ? "0 0 0 1px #ef4444"
        : state.isFocused
        ? "0 0 0 2px rgba(14, 165, 233, 0.2)"
        : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      "&:hover": {
        borderColor: error ? "#ef4444" : "#9ca3af",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
      transition: "all 0.2s ease-in-out",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0px 16px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "14px",
      fontWeight: "500",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#374151",
      fontSize: "14px",
      fontWeight: "500",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#e0f2fe",
      borderRadius: "8px",
      border: "1px solid #bae6fd",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#0369a1",
      fontSize: "14px",
      fontWeight: "500",
      padding: "2px 8px",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#0369a1",
      borderRadius: "0 8px 8px 0",
      "&:hover": {
        backgroundColor: "#ef4444",
        color: "white",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#0ea5e9"
        : state.isFocused
        ? "#e0f2fe"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      fontSize: "14px",
      fontWeight: "500",
      padding: "12px 16px",
      "&:hover": {
        backgroundColor: state.isSelected ? "#0ea5e9" : "#e0f2fe",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(8px)",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    loadingIndicator: (provided) => ({
      ...provided,
      color: "#0ea5e9",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: "#d1d5db",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#9ca3af",
      "&:hover": {
        color: "#6b7280",
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "#9ca3af",
      "&:hover": {
        color: "#6b7280",
      },
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
      <div className={clsx("space-y-2", className)}>
        {label && (
          <label className="block text-sm font-semibold text-gray-700">
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
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
        {error && (
          <p className="text-sm text-danger-600 font-medium flex items-center">
            <span className="w-1 h-1 bg-danger-500 rounded-full mr-2"></span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500 font-medium">{helperText}</p>
        )}
      </div>
    );
  }

  // Komponen standalone
  const currentValue =
    typeof value === "string"
      ? formattedOptions.find((option) => option.value === value)
      : value;

  return (
    <div className={clsx("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
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
      {error && (
        <p className="text-sm text-danger-600 font-medium flex items-center">
          <span className="w-1 h-1 bg-danger-500 rounded-full mr-2"></span>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 font-medium">{helperText}</p>
      )}
    </div>
  );
};

export default SelectComponent;
