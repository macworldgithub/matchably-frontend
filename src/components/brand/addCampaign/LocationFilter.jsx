import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

// Region data
const REGIONS = [
  { value: "north-america", label: "North America" },
  { value: "south-america", label: "South America" },
  { value: "europe", label: "Europe" },
  { value: "east-asia", label: "East Asia (e.g., South Korea, Japan, China)" },
  {
    value: "southeast-asia",
    label:
      "Southeast Asia (e.g., Vietnam, Thailand, Indonesia, Malaysia, Philippines, Singapore, Cambodia, Laos, Myanmar, Brunei, Timor-Leste)",
  },
  {
    value: "south-asia",
    label: "South Asia (e.g., India, Pakistan, Bangladesh)",
  },
  { value: "middle-east", label: "Middle East" },
  { value: "oceania", label: "Oceania" },
  { value: "africa", label: "Africa" },
];

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#1f2937",
    borderColor: state.isFocused ? "#2563eb" : "#374151",
    borderRadius: "0.5rem",
    minHeight: "48px",
    boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
    "&:hover": {
      borderColor: "#2563eb",
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "0.5rem",
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#2563eb"
      : state.isFocused
      ? "#374151"
      : "#1f2937",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#374151",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#374151",
    borderRadius: "0.375rem",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#ffffff",
    fontSize: "0.875rem",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#9ca3af",
    "&:hover": {
      backgroundColor: "#ef4444",
      color: "#ffffff",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#ffffff",
  }),
  input: (provided) => ({
    ...provided,
    color: "#ffffff",
  }),
};

export default function LocationFilter({ locationFilter, onChange }) {
  const [noLocationPreference, setNoLocationPreference] = useState(false);

  // Use the existing country list from react-select-country-list
  const countryOptions = useMemo(() => countryList().getData(), []);

  // Initialize state from props
  useEffect(() => {
    if (locationFilter?.noLocationPreference) {
      setNoLocationPreference(true);
    }
  }, []);

  const handleRegionChange = (selectedOptions) => {
    const regions = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    onChange({
      ...locationFilter,
      regions,
      noLocationPreference: false,
    });
  };

  const handleCountryChange = (selectedOptions) => {
    const countries = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    onChange({
      ...locationFilter,
      countries,
      noLocationPreference: false,
    });
  };

  const handleNoPreferenceChange = (checked) => {
    setNoLocationPreference(checked);
    if (checked) {
      onChange({
        regions: [],
        countries: [],
        noLocationPreference: true,
      });
    } else {
      onChange({
        ...locationFilter,
        noLocationPreference: false,
      });
    }
  };

  const generateLocationMessage = () => {
    if (locationFilter?.noLocationPreference || noLocationPreference) {
      return "This campaign is open to creators worldwide.";
    }

    const selectedRegions = locationFilter?.regions || [];
    const selectedCountries = locationFilter?.countries || [];

    if (selectedRegions.length === 0 && selectedCountries.length === 0) {
      return "";
    }

    let message = "This campaign targets creators in ";
    let parts = [];

    if (selectedRegions.length > 0) {
      const regionLabels = selectedRegions.map(
        (regionValue) =>
          REGIONS.find((r) => r.value === regionValue)?.label || regionValue
      );
      parts.push(regionLabels.join(" and "));
    }

    if (selectedCountries.length > 0) {
      const countryLabels = selectedCountries.map(
        (countryValue) =>
          countryOptions.find((c) => c.value === countryValue)?.label ||
          countryValue
      );

      if (selectedRegions.length > 0) {
        parts.push(`specifically ${countryLabels.join(", ")}`);
      } else {
        parts.push(countryLabels.join(", "));
      }
    }

    return message + parts.join(", ") + ".";
  };

  const selectedRegionOptions = (locationFilter?.regions || [])
    .map((regionValue) => REGIONS.find((r) => r.value === regionValue))
    .filter(Boolean);

  const selectedCountryOptions = (locationFilter?.countries || [])
    .map((countryValue) => countryOptions.find((c) => c.value === countryValue))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <h4 className="text-base font-semibold text-gray-200 mb-4">
        Location Filter Section
      </h4>

      {/* No Location Preference Checkbox */}
      <div className="mb-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={
              noLocationPreference || locationFilter?.noLocationPreference
            }
            onChange={(e) => handleNoPreferenceChange(e.target.checked)}
            className="h-4 w-4 text-blue-500 border-gray-600 rounded focus:ring-blue-400 bg-gray-800"
          />
          <span className="text-gray-200 text-sm">
            I don't have a location preference
          </span>
        </label>
        <p className="text-xs text-gray-400 mt-1 ml-7">
          Select this option if you're open to working with creators from any
          country. This will override all Region/Country selections.
        </p>
      </div>

      {/* Region Selection */}
      <div
        className={`transition-opacity duration-200 ${
          noLocationPreference || locationFilter?.noLocationPreference
            ? "opacity-50 pointer-events-none"
            : ""
        }`}
      >
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Region
        </label>
        <Select
          isMulti
          options={REGIONS}
          value={selectedRegionOptions}
          onChange={handleRegionChange}
          styles={customSelectStyles}
          placeholder="Select one or more continents..."
          className="text-sm"
          isDisabled={
            noLocationPreference || locationFilter?.noLocationPreference
          }
        />
        <p className="text-xs text-gray-400 mt-1">
          Select one or more continents. You may choose multiple (e.g., East
          Asia + Southeast Asia). Leave empty if targeting only by country.
        </p>
      </div>

      {/* Country Selection */}
      <div
        className={`transition-opacity duration-200 ${
          noLocationPreference || locationFilter?.noLocationPreference
            ? "opacity-50 pointer-events-none"
            : ""
        }`}
      >
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Country
        </label>
        <Select
          isMulti
          options={countryOptions}
          value={selectedCountryOptions}
          onChange={handleCountryChange}
          styles={customSelectStyles}
          placeholder="Select one or more countries..."
          className="text-sm"
          isDisabled={
            noLocationPreference || locationFilter?.noLocationPreference
          }
        />
        <p className="text-xs text-gray-400 mt-1">
          Select one or more countries. You may choose multiple (e.g., Vietnam,
          Indonesia, Thailand). You can skip region if targeting only by
          countries.
        </p>
      </div>

      {/* Location Preview Message */}
      {generateLocationMessage() && (
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
          <h5 className="text-sm font-medium text-blue-300 mb-1">
            Location Targeting Preview:
          </h5>
          <p className="text-sm text-blue-200">{generateLocationMessage()}</p>
        </div>
      )}
    </div>
  );
}
