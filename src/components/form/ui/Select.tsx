import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  value?: string; // Thêm prop value
  defaultValue?: string; // Giữ defaultValue cho uncontrolled mode
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  value, // Thêm value vào destructuring
  defaultValue = "",
}) => {
  // Nếu value được truyền, sử dụng controlled mode
  // Nếu không, sử dụng state nội bộ với defaultValue
  const [selectedValue, setSelectedValue] = useState<string>(value ?? defaultValue);

  // Đồng bộ selectedValue với value khi value thay đổi
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (value === undefined) {
      // Uncontrolled mode: cập nhật state nội bộ
      setSelectedValue(newValue);
    }
    onChange(newValue); // Gọi handler của parent
  };

  return (
    <select
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/30 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${value ?? selectedValue
        ? "text-gray-800 dark:text-white/90"
        : "text-gray-400 dark:text-gray-400"
        } ${className}`}
      value={value ?? selectedValue} // Sử dụng value nếu có, nếu không dùng selectedValue
      onChange={handleChange}
    >
      {/* Placeholder option */}
      <option
        value=""
        disabled
        className="text-gray-400 dark:bg-gray-900 dark:text-white/30"
      >
        {placeholder}
      </option>
      {/* Map over options */}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;