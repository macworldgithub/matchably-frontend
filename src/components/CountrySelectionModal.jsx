import React, { useState, useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import { toast } from "react-toastify";
import config from "../config";

const CountrySelectionModal = ({ isOpen, onClose, onSuccess, token }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(false);

  const countryOptions = useMemo(() => countryList().getData(), []);

  const handleSubmit = async () => {
    if (!selectedCountry) {
      toast.error("Please select a country", { theme: "dark" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/auth/update-country`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          country: selectedCountry.label,
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        // Don't show duplicate toast - parent component handles success message
        onSuccess(data.user);
        onClose();
      } else {
        toast.error(data.message || "Failed to update country", {
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Country update error:", error);
      toast.error("Something went wrong. Please try again.", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#202020] rounded-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Complete Your Registration
          </h2>
          <p className="text-gray-400">
            Please select your country to continue
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Country *
            </label>
            <Select
              options={countryOptions}
              value={selectedCountry}
              onChange={setSelectedCountry}
              placeholder="Select your country"
              className="text-black"
              isSearchable={true}
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "#374151",
                  borderColor: "#6B7280",
                  color: "white",
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: "#374151",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused ? "#4B5563" : "#374151",
                  color: "white",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "white",
                }),
                input: (provided) => ({
                  ...provided,
                  color: "white",
                }),
              }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              disabled={loading}
            >
              Skip for Now
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedCountry}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountrySelectionModal;
