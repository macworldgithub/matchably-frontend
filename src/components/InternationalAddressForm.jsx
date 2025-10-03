import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

// Address field configurations for different countries
const ADDRESS_CONFIGS = {
  US: {
    fields: [
      {
        name: "addressLine1",
        label: "Address Line 1",
        required: true,
        type: "text",
        placeholder: "123 Main Street",
      },
      {
        name: "addressLine2",
        label: "Address Line 2",
        required: false,
        type: "text",
        placeholder: "Apt, Suite, Unit",
      },
      {
        name: "city",
        label: "City",
        required: true,
        type: "text",
        placeholder: "New York",
      },
      {
        name: "state",
        label: "State",
        required: true,
        type: "select",
        options: [
          "Alabama",
          "Alaska",
          "Arizona",
          "Arkansas",
          "California",
          "Colorado",
          "Connecticut",
          "Delaware",
          "Florida",
          "Georgia",
          "Hawaii",
          "Idaho",
          "Illinois",
          "Indiana",
          "Iowa",
          "Kansas",
          "Kentucky",
          "Louisiana",
          "Maine",
          "Maryland",
          "Massachusetts",
          "Michigan",
          "Minnesota",
          "Mississippi",
          "Missouri",
          "Montana",
          "Nebraska",
          "Nevada",
          "New Hampshire",
          "New Jersey",
          "New Mexico",
          "New York",
          "North Carolina",
          "North Dakota",
          "Ohio",
          "Oklahoma",
          "Oregon",
          "Pennsylvania",
          "Rhode Island",
          "South Carolina",
          "South Dakota",
          "Tennessee",
          "Texas",
          "Utah",
          "Vermont",
          "Virginia",
          "Washington",
          "West Virginia",
          "Wisconsin",
          "Wyoming",
        ],
      },
      {
        name: "zipCode",
        label: "ZIP Code",
        required: true,
        type: "text",
        placeholder: "12345",
        pattern: "^\\d{5}(-\\d{4})?$",
      },
    ],
  },
  CA: {
    fields: [
      {
        name: "addressLine1",
        label: "Address Line 1",
        required: true,
        type: "text",
        placeholder: "123 Main Street",
      },
      {
        name: "addressLine2",
        label: "Address Line 2",
        required: false,
        type: "text",
        placeholder: "Apt, Suite, Unit",
      },
      {
        name: "city",
        label: "City",
        required: true,
        type: "text",
        placeholder: "Toronto",
      },
      {
        name: "province",
        label: "Province",
        required: true,
        type: "select",
        options: [
          "Alberta",
          "British Columbia",
          "Manitoba",
          "New Brunswick",
          "Newfoundland and Labrador",
          "Northwest Territories",
          "Nova Scotia",
          "Nunavut",
          "Ontario",
          "Prince Edward Island",
          "Quebec",
          "Saskatchewan",
          "Yukon",
        ],
      },
      {
        name: "postalCode",
        label: "Postal Code",
        required: true,
        type: "text",
        placeholder: "A1A 1A1",
        pattern: "^[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d$",
      },
    ],
  },
  GB: {
    fields: [
      {
        name: "addressLine1",
        label: "Address Line 1",
        required: true,
        type: "text",
        placeholder: "123 High Street",
      },
      {
        name: "addressLine2",
        label: "Address Line 2",
        required: false,
        type: "text",
        placeholder: "Flat, Apartment",
      },
      {
        name: "city",
        label: "City/Town",
        required: true,
        type: "text",
        placeholder: "London",
      },
      {
        name: "county",
        label: "County",
        required: false,
        type: "text",
        placeholder: "Greater London",
      },
      {
        name: "postcode",
        label: "Postcode",
        required: true,
        type: "text",
        placeholder: "SW1A 1AA",
        pattern: "^[A-Z]{1,2}\\d[A-Z\\d]? ?\\d[A-Z]{2}$",
      },
    ],
  },
  DE: {
    fields: [
      {
        name: "addressLine1",
        label: "Straße und Hausnummer",
        required: true,
        type: "text",
        placeholder: "Musterstraße 123",
      },
      {
        name: "addressLine2",
        label: "Adresszusatz",
        required: false,
        type: "text",
        placeholder: "Wohnung, Etage",
      },
      {
        name: "city",
        label: "Stadt",
        required: true,
        type: "text",
        placeholder: "Berlin",
      },
      {
        name: "state",
        label: "Bundesland",
        required: false,
        type: "text",
        placeholder: "Berlin",
      },
      {
        name: "zipCode",
        label: "Postleitzahl",
        required: true,
        type: "text",
        placeholder: "10115",
        pattern: "^\\d{5}$",
      },
    ],
  },
  FR: {
    fields: [
      {
        name: "addressLine1",
        label: "Adresse",
        required: true,
        type: "text",
        placeholder: "123 Rue de la Paix",
      },
      {
        name: "addressLine2",
        label: "Complément d'adresse",
        required: false,
        type: "text",
        placeholder: "Appartement, Étage",
      },
      {
        name: "city",
        label: "Ville",
        required: true,
        type: "text",
        placeholder: "Paris",
      },
      {
        name: "zipCode",
        label: "Code postal",
        required: true,
        type: "text",
        placeholder: "75001",
        pattern: "^\\d{5}$",
      },
    ],
  },
  KR: {
    fields: [
      {
        name: "zipCode",
        label: "우편번호",
        required: true,
        type: "text",
        placeholder: "06292",
        pattern: "^\\d{5}$",
      },
      {
        name: "addressLine1",
        label: "주소",
        required: true,
        type: "text",
        placeholder: "서울특별시 강남구 테헤란로",
      },
      {
        name: "addressLine2",
        label: "상세주소",
        required: false,
        type: "text",
        placeholder: "아파트, 동, 호수",
      },
      {
        name: "city",
        label: "시/도",
        required: true,
        type: "text",
        placeholder: "서울특별시",
      },
      {
        name: "district",
        label: "구/군",
        required: true,
        type: "text",
        placeholder: "강남구",
      },
    ],
  },
  JP: {
    fields: [
      {
        name: "zipCode",
        label: "郵便番号",
        required: true,
        type: "text",
        placeholder: "100-0001",
        pattern: "^\\d{3}-\\d{4}$",
      },
      {
        name: "prefecture",
        label: "都道府県",
        required: true,
        type: "select",
        options: [
          "北海道",
          "青森県",
          "岩手県",
          "宮城県",
          "秋田県",
          "山形県",
          "福島県",
          "茨城県",
          "栃木県",
          "群馬県",
          "埼玉県",
          "千葉県",
          "東京都",
          "神奈川県",
          "新潟県",
          "富山県",
          "石川県",
          "福井県",
          "山梨県",
          "長野県",
          "岐阜県",
          "静岡県",
          "愛知県",
          "三重県",
          "滋賀県",
          "京都府",
          "大阪府",
          "兵庫県",
          "奈良県",
          "和歌山県",
          "鳥取県",
          "島根県",
          "岡山県",
          "広島県",
          "山口県",
          "徳島県",
          "香川県",
          "愛媛県",
          "高知県",
          "福岡県",
          "佐賀県",
          "長崎県",
          "熊本県",
          "大分県",
          "宮崎県",
          "鹿児島県",
          "沖縄県",
        ],
      },
      {
        name: "city",
        label: "市区町村",
        required: true,
        type: "text",
        placeholder: "千代田区",
      },
      {
        name: "addressLine1",
        label: "町域・番地",
        required: true,
        type: "text",
        placeholder: "千代田1-1-1",
      },
      {
        name: "addressLine2",
        label: "建物名・部屋番号",
        required: false,
        type: "text",
        placeholder: "マンション名 101号室",
      },
    ],
  },
  VN: {
    fields: [
      {
        name: "addressLine1",
        label: "Địa chỉ",
        required: true,
        type: "text",
        placeholder: "123 Đường Nguyễn Huệ",
      },
      {
        name: "addressLine2",
        label: "Địa chỉ chi tiết",
        required: false,
        type: "text",
        placeholder: "Căn hộ, Tầng",
      },
      {
        name: "ward",
        label: "Phường/Xã",
        required: true,
        type: "text",
        placeholder: "Phường Bến Nghé",
      },
      {
        name: "district",
        label: "Quận/Huyện",
        required: true,
        type: "text",
        placeholder: "Quận 1",
      },
      {
        name: "city",
        label: "Tỉnh/Thành phố",
        required: true,
        type: "text",
        placeholder: "TP. Hồ Chí Minh",
      },
      {
        name: "zipCode",
        label: "Mã bưu điện",
        required: false,
        type: "text",
        placeholder: "700000",
      },
    ],
  },
  TH: {
    fields: [
      {
        name: "addressLine1",
        label: "ที่อยู่",
        required: true,
        type: "text",
        placeholder: "123 ถนนสุขุมวิท",
      },
      {
        name: "addressLine2",
        label: "ที่อยู่เพิ่มเติม",
        required: false,
        type: "text",
        placeholder: "อพาร์ทเมนท์, ชั้น",
      },
      {
        name: "subDistrict",
        label: "ตำบล/แขวง",
        required: true,
        type: "text",
        placeholder: "คลองเตย",
      },
      {
        name: "district",
        label: "อำเภอ/เขต",
        required: true,
        type: "text",
        placeholder: "คลองเตย",
      },
      {
        name: "province",
        label: "จังหวัด",
        required: true,
        type: "text",
        placeholder: "กรุงเทพมหานคร",
      },
      {
        name: "zipCode",
        label: "รหัสไปรษณีย์",
        required: true,
        type: "text",
        placeholder: "10110",
        pattern: "^\\d{5}$",
      },
    ],
  },
  AU: {
    fields: [
      {
        name: "addressLine1",
        label: "Address Line 1",
        required: true,
        type: "text",
        placeholder: "123 Collins Street",
      },
      {
        name: "addressLine2",
        label: "Address Line 2",
        required: false,
        type: "text",
        placeholder: "Unit, Apartment",
      },
      {
        name: "city",
        label: "Suburb",
        required: true,
        type: "text",
        placeholder: "Melbourne",
      },
      {
        name: "state",
        label: "State",
        required: true,
        type: "select",
        options: [
          "Australian Capital Territory",
          "New South Wales",
          "Northern Territory",
          "Queensland",
          "South Australia",
          "Tasmania",
          "Victoria",
          "Western Australia",
        ],
      },
      {
        name: "zipCode",
        label: "Postcode",
        required: true,
        type: "text",
        placeholder: "3000",
        pattern: "^\\d{4}$",
      },
    ],
  },
  // Default fallback for other countries
  DEFAULT: {
    fields: [
      {
        name: "addressLine1",
        label: "Address Line 1",
        required: true,
        type: "text",
        placeholder: "Street Address",
      },
      {
        name: "addressLine2",
        label: "Address Line 2",
        required: false,
        type: "text",
        placeholder: "Apartment, Unit, etc.",
      },
      {
        name: "city",
        label: "City",
        required: true,
        type: "text",
        placeholder: "City",
      },
      {
        name: "state",
        label: "State/Province",
        required: false,
        type: "text",
        placeholder: "State or Province",
      },
      {
        name: "zipCode",
        label: "Postal Code",
        required: false,
        type: "text",
        placeholder: "Postal Code",
      },
    ],
  },
};

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#575757",
    borderColor: state.isFocused ? "#2563eb" : "#575757",
    borderRadius: "0.375rem",
    minHeight: "40px",
    boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
    "&:hover": {
      borderColor: "#2563eb",
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#575757",
    border: "1px solid #575757",
    borderRadius: "0.375rem",
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#2563eb"
      : state.isFocused
      ? "#4B5563"
      : "#575757",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#4B5563",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#ffffff",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
  }),
  input: (provided) => ({
    ...provided,
    color: "#ffffff",
  }),
};

export default function InternationalAddressForm({
  selectedCountry,
  addressData = {},
  onChange,
  showCountrySelector = true,
}) {
  const countryOptions = useMemo(() => countryList().getData(), []);
  const [currentCountry, setCurrentCountry] = useState(selectedCountry);

  useEffect(() => {
    setCurrentCountry(selectedCountry);
  }, [selectedCountry]);

  const handleCountryChange = (selectedOption) => {
    const newCountry = selectedOption?.value || "";
    setCurrentCountry(newCountry);

    // Clear address data when country changes
    onChange({
      country: newCountry,
      addressData: {},
    });
  };

  const handleAddressFieldChange = (fieldName, value) => {
    const newAddressData = {
      ...addressData,
      [fieldName]: value,
    };

    onChange({
      country: currentCountry,
      addressData: newAddressData,
    });
  };

  // Get address configuration for current country
  const getAddressConfig = (countryCode) => {
    return ADDRESS_CONFIGS[countryCode] || ADDRESS_CONFIGS.DEFAULT;
  };

  const currentConfig = getAddressConfig(currentCountry);
  const selectedCountryOption = countryOptions.find(
    (option) => option.value === currentCountry
  );

  const validateField = (field, value) => {
    if (field.required && (!value || value.trim() === "")) {
      return false;
    }
    if (field.pattern && value) {
      const regex = new RegExp(field.pattern);
      return regex.test(value);
    }
    return true;
  };

  return (
    <div className="space-y-4">
      {/* Country Selector */}
      {showCountrySelector && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <Select
            options={countryOptions}
            value={selectedCountryOption}
            onChange={handleCountryChange}
            styles={customSelectStyles}
            placeholder="Select your country"
            className="text-sm"
            isSearchable={true}
          />
        </div>
      )}

      {/* Dynamic Address Fields */}
      {currentCountry &&
        currentConfig.fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === "select" ? (
              <select
                value={addressData[field.name] || ""}
                onChange={(e) =>
                  handleAddressFieldChange(field.name, e.target.value)
                }
                required={field.required}
                className="w-full bg-[#575757] text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">{`Select ${field.label}`}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={addressData[field.name] || ""}
                onChange={(e) =>
                  handleAddressFieldChange(field.name, e.target.value)
                }
                placeholder={field.placeholder}
                required={field.required}
                pattern={field.pattern}
                className={`w-full bg-[#575757] text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  field.pattern &&
                  addressData[field.name] &&
                  !validateField(field, addressData[field.name])
                    ? "border-red-500"
                    : ""
                }`}
              />
            )}

            {field.pattern &&
              addressData[field.name] &&
              !validateField(field, addressData[field.name]) && (
                <p className="text-red-400 text-xs mt-1">
                  Please enter a valid {field.label.toLowerCase()}
                </p>
              )}
          </div>
        ))}

      {/* Address Preview */}
      {currentCountry && Object.keys(addressData).length > 0 && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Address Preview:
          </h4>
          <div className="text-sm text-gray-400 space-y-1">
            {currentConfig.fields.map((field) => {
              const value = addressData[field.name];
              if (value) {
                return (
                  <div key={field.name}>
                    <span className="font-medium">{field.label}:</span> {value}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
