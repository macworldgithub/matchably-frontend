import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

// All continents and countries options
const createLocationOptions = () => {
  const continents = [
    { value: "global", label: "Global - Worldwide", type: "global" },
    { value: "north-america", label: "North America", type: "continent" },
    { value: "south-america", label: "South America", type: "continent" },
    { value: "europe", label: "Europe", type: "continent" },
    { value: "asia", label: "Asia", type: "continent" },
    { value: "africa", label: "Africa", type: "continent" },
    { value: "oceania", label: "Oceania", type: "continent" },
    { value: "antarctica", label: "Antarctica", type: "continent" },
  ];

  const countries = countryList()
    .getData()
    .map((country) => ({
      value: country.value,
      label: country.label,
      type: "country",
    }));

  return [
    {
      label: "Global & Continents",
      options: continents,
    },
    {
      label: "Countries",
      options: countries,
    },
  ];
};

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#374151",
    borderColor: state.isFocused ? "#60A5FA" : "#6B7280",
    color: "#ffffff",
    minHeight: "40px",
    "&:hover": {
      borderColor: "#60A5FA",
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#374151",
    border: "1px solid #6B7280",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#4B5563" : "#374151",
    color: "#ffffff",
    "&:active": {
      backgroundColor: "#6B7280",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#6B7280",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#ffffff",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#EF4444",
      color: "#ffffff",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9CA3AF",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#ffffff",
  }),
  input: (provided) => ({
    ...provided,
    color: "#ffffff",
  }),
  groupHeading: (provided) => ({
    ...provided,
    backgroundColor: "#1F2937",
    color: "#D1D5DB",
    fontWeight: "bold",
    fontSize: "12px",
    padding: "8px 12px",
  }),
};

export default function UnifiedLocationSelector({
  selectedLocations,
  onChange,
}) {
  const locationOptions = useMemo(() => createLocationOptions(), []);

  // Get currently selected locations
  const selectedValues = selectedLocations?.locations || [];
  const isGlobal = selectedLocations?.isGlobal || false;

  const handleLocationChange = (selectedOptions) => {
    const locations = selectedOptions || [];

    // Check if global is selected
    const globalSelected = locations.some((loc) => loc.value === "global");

    const finalLocations = globalSelected
      ? [{ value: "global", label: "Global - Worldwide", type: "global" }]
      : locations;

    const locationData = {
      locations: finalLocations,
      isGlobal: globalSelected || finalLocations.length === 0, // True if global selected OR no locations (default to global)
    };

    console.log("🌍 Brand Location Change:", {
      selectedOptions,
      finalLocations,
      isGlobal: locationData.isGlobal,
      globalSelected,
    });

    onChange(locationData);
  };

  const generateLocationDisplay = () => {
    if (isGlobal || selectedValues.some((loc) => loc.value === "global")) {
      return "This campaign is open to creators worldwide.";
    }

    if (selectedValues.length === 0) {
      return "This campaign is open to creators worldwide.";
    }

    const continents = selectedValues.filter((loc) => loc.type === "continent");
    const countries = selectedValues.filter((loc) => loc.type === "country");

    let parts = [];
    if (continents.length > 0) {
      parts.push(continents.map((c) => c.label).join(", "));
    }
    if (countries.length > 0) {
      parts.push(countries.map((c) => c.label).join(", "));
    }

    return `This campaign targets creators in ${parts.join(" and ")}.`;
  };

  return (
    <div className="space-y-4">
      <h4 className="text-base font-semibold text-gray-200 mb-4">
        Location Preference
      </h4>

      {/* Location Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Target Locations
        </label>
        <Select
          isMulti
          options={locationOptions}
          value={selectedValues}
          onChange={handleLocationChange}
          styles={customSelectStyles}
          placeholder="Select continents and/or countries..."
          className="text-sm"
          isDisabled={selectedValues.some((loc) => loc.value === "global")}
        />
        <p className="text-xs text-gray-400 mt-1">
          Select Global for worldwide, or choose specific continents and
          countries. If Global is selected, other options will be cleared.
        </p>
      </div>

      {/* Location Preview */}
      {generateLocationDisplay() && (
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-sm text-gray-300">
            <span className="font-medium">Preview:</span>{" "}
            {generateLocationDisplay()}
          </p>
        </div>
      )}
    </div>
  );
}
