import { useState, useEffect } from "react";
import useAuthStore from "../../state/atoms";
import axios from "axios";
import Cookies from "js-cookie";
import config from "../../config";
import { toast } from "react-toastify";
import InternationalAddressForm from "../InternationalAddressForm";
import ApplyAgreementModal from "../ApplyAgreementModal"; // adjust path if needed

const usStates = [
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
];

const canadaProvinces = [
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
];

export default function SubmitApplication({
  isOpen,
  setIsOpen,
  setSuccess,
  campaignId,
  campaign,
}) {
  console.log(campaign);
  const { User } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [bid, setBid] = useState("");
  const [bidError, setBidError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAgreed(false);
    }
  }, [isOpen]);

  const scrollToTopOfDrawer = () => {
    const drawer = document.querySelector(".apply-drawer");
    if (drawer) {
      drawer.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const [formData, setFormData] = useState({
    country: "US", // default value (using ISO code for react-select-country-list)
    name: User.name,
    email: User.email,
    street: "",
    unit: "", // NEW: Unit/Apt field
    city: "",
    phone: "",
    state: "",
    zip: "",
    instagramId: User.instagramId,
    tiktokId: User.tiktokId,
  });
  const [tiktokError, setTiktokError] = useState("");

  // New state for international address
  const [addressData, setAddressData] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("US");
  // Helper: campaign contentFormat
  const contentFormat = Array.isArray(campaign?.contentFormat)
    ? campaign.contentFormat
    : [];
  const requiresInstagram = contentFormat.includes("Instagram");
  const requiresTikTok = contentFormat.includes("TikTok");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // TikTok ID logic
    if (name === "tiktokId") {
      let val = value;
      // Block URLs
      if (
        /https?:\/\/(www\.)?tiktok\.com\//i.test(val) ||
        /www\.tiktok\.com\//i.test(val)
      ) {
        setTiktokError("Please enter your TikTok ID without extra @ or links.");
        setFormData({ ...formData, tiktokId: val });
        return;
      }
      // Auto-prepend @
      if (val && !val.startsWith("@")) val = "@" + val.replace(/^@+/, "");
      // Prevent double @
      if (/^@@+/.test(val)) {
        setTiktokError("Please enter your TikTok ID without extra @ or links.");
        setFormData({ ...formData, tiktokId: val });
        return;
      }
      // Only allow @username (no spaces, no URLs)
      if (/\s/.test(val)) {
        setTiktokError("Please enter your TikTok ID without spaces.");
        setFormData({ ...formData, tiktokId: val });
        return;
      }
      setTiktokError("");
      setFormData({ ...formData, tiktokId: val });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = ({ country, addressData: newAddressData }) => {
    setSelectedCountry(country);
    setAddressData(newAddressData);
    // Also update formData for backward compatibility
    setFormData((prev) => ({
      ...prev,
      country: country,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { street, city, state, zip, instagramId, tiktokId, country } =
      formData;

    // Validate required address fields using international address data
    if (!selectedCountry) {
      toast.error("Please select a country.", { position: "top-center" });
      setLoading(false);
      return;
    }

    // Validate required address fields based on country configuration
    const requiredFields = ["addressLine1", "city"]; // Basic required fields for all countries
    for (const field of requiredFields) {
      if (!addressData[field] || addressData[field].trim() === "") {
        toast.error("Please fill in all required address fields.", {
          position: "top-center",
        });
        setLoading(false);
        return;
      }
    }

    // Validate at least one social ID (updated logic)
    if (requiresInstagram && !formData.instagramId.trim()) {
      toast.error("Instagram ID is required for this campaign.", {
        position: "top-center",
      });
      setLoading(false);
      return;
    }
    if (requiresTikTok) {
      if (!formData.tiktokId.trim()) {
        toast.error("TikTok ID is required for this campaign.", {
          position: "top-center",
        });
        setLoading(false);
        return;
      }
      // Validate TikTok ID format
      if (
        /https?:\/\/(www\.)?tiktok\.com\//i.test(formData.tiktokId) ||
        /www\.tiktok\.com\//i.test(formData.tiktokId) ||
        /^@@+/.test(formData.tiktokId) ||
        /\s/.test(formData.tiktokId)
      ) {
        toast.error("Please enter your TikTok ID without extra @ or links.", {
          position: "top-center",
        });
        setLoading(false);
        return;
      }
    }

    // Bidding validation
    if (
      campaign?.campaignType === "paid" &&
      campaign?.pricingModel === "bidding"
    ) {
      const min = campaign.minBid || 1;
      const max = campaign.maxBid || 10000;
      const bidValue = Number(bid);
      if (isNaN(bidValue) || bidValue < min || bidValue > max) {
        setBidError(`Bid must be between $${min} and $${max}.`);
        setLoading(false);
        return;
      }
      setBidError("");
    }

    try {
      const token = Cookies.get("token") || localStorage.getItem("token");

      // Construct address string from international address data - avoid duplicates
      const addressParts = [];
      
      // Add street address (line 1)
      if (addressData.addressLine1 || addressData.street) {
        addressParts.push(addressData.addressLine1 || addressData.street);
      }
      
      // Add address line 2 only if it's different from unit and line 1
      if (addressData.addressLine2 && 
          addressData.addressLine2 !== addressData.unit && 
          addressData.addressLine2 !== (addressData.addressLine1 || addressData.street)) {
        addressParts.push(addressData.addressLine2);
      }
      
      // Add unit/apartment number
      if (addressData.unit) {
        addressParts.push(addressData.unit);
      }
      
      // Add city
      if (addressData.city) {
        addressParts.push(addressData.city);
      }
      
      // Add state/province/prefecture
      const stateValue = addressData.state || addressData.province || addressData.prefecture;
      if (stateValue) {
        addressParts.push(stateValue);
      }
      
      // Add postal code
      const postalCode = addressData.zipCode || addressData.postalCode || addressData.postcode;
      if (postalCode) {
        addressParts.push(postalCode);
      }

      const payload = {
        country: selectedCountry,
        state:
          addressData.state ||
          addressData.province ||
          addressData.prefecture ||
          "",
        city: addressData.city || "",
        phone: formData.phone,
        address: addressParts.join(", "),
        unit: addressData.unit || "",
        zip:
          addressData.zipCode ||
          addressData.postalCode ||
          addressData.postcode ||
          "",
        // Store full international address data
        internationalAddress: addressData,
        campaignId,
        // Only send IDs if relevant
        ...(requiresInstagram ? { instagramId } : {}),
        ...(requiresTikTok ? { tiktokId } : {}),
      };
      if (
        campaign?.campaignType === "paid" &&
        campaign?.pricingModel === "bidding"
      ) {
        payload.bid = Number(bid);
      }
      const res = await axios.post(
        `${config.BACKEND_URL}/user/campaigns/apply`,
        payload,
        {
          headers: { authorization: token },
        }
      );

      if (res.data.status === "success") {
        setIsOpen(false);
        setSuccess(true);
        toast.success("Application submitted successfully!", {
          position: "top-center",
        });
      } else {
        // Enhanced error handling for duplicate applications
        if (
          res.data.code === "DUPLICATE_APPLICATION" ||
          res.data.code === "DUPLICATE_APPLICATION_BY_USER_ID"
        ) {
          toast.error(
            `You have already applied to this campaign on ${new Date(
              res.data.appliedAt
            ).toLocaleDateString()}`,
            {
              position: "top-center",
              duration: 5000,
            }
          );
          setIsOpen(false); // Close modal since they already applied
        } else {
          toast.error(res.data.message || "Application failed.", {
            position: "top-center",
          });
        }
      }
    } catch (error) {
      console.error(error);

      // Handle network errors or server errors
      if (error.response?.status === 409) {
        const errorData = error.response.data;
        if (
          errorData.code === "DUPLICATE_APPLICATION" ||
          errorData.code === "DUPLICATE_APPLICATION_BY_USER_ID"
        ) {
          toast.error(
            `You have already applied to this campaign on ${new Date(
              errorData.appliedAt
            ).toLocaleDateString()}`,
            {
              position: "top-center",
              duration: 5000,
            }
          );
          setIsOpen(false);
          return;
        }
      }
      const message = error?.response?.data?.message || "Something went wrong.";
      toast.error(message, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    if (!agreed) {
      e.preventDefault();
      scrollToTopOfDrawer();
      setShowAgreement(true);
      return;
    }
    handleSubmit(e);
  };

  return (
    <div
      className={`apply-drawer fixed top-0 right-0 h-full max-h-screen overflow-y-auto
    bg-[#303030] text-white w-full md:w-[400px]
    transform ${isOpen ? "translate-x-0" : "translate-x-full"}
    transition-transform duration-300 ease-in-out
    shadow-lg z-[9999] pointer-events-auto p-6`}
    >
      <h2 className="text-2xl font-bold mb-6 flex justify-between items-center">
        Apply to Campaign
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-300 hover:text-white"
        >
          ✕
        </button>
      </h2>
      <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4">
        {/* Name & Email (disabled) */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            disabled
            className="w-full bg-[#484848] text-[#b4b4b4] px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            disabled
            className="w-full bg-[#484848] text-[#b4b4b4] px-3 py-2 rounded-md"
          />
        </div>

        {/* Contact & Address Fields */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            maxLength={14}
            placeholder="(123) 456-7890"
            className="w-full bg-[#484848] text-[#b4b4b4] px-3 py-2 rounded-md"
          />
        </div>
        {/* International Address Form */}
        <InternationalAddressForm
          selectedCountry={selectedCountry}
          addressData={addressData}
          onChange={handleAddressChange}
          showCountrySelector={true}
        />
        {/* SNS ID fields, conditional */}
        {requiresInstagram && (
          <div>
            <label
              htmlFor="instagramId"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Instagram ID
            </label>
            <input
              id="instagramId"
              name="instagramId"
              type="text"
              value={formData.instagramId}
              onChange={handleInputChange}
              placeholder="Instagram ID"
              required
              className="w-full bg-[#575757] px-3 py-2 rounded-md"
            />
          </div>
        )}
        {requiresTikTok && (
          <div>
            <label
              htmlFor="tiktokId"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              TikTok ID
            </label>
            <input
              id="tiktokId"
              name="tiktokId"
              type="text"
              value={formData.tiktokId}
              onChange={handleInputChange}
              placeholder="TikTok ID"
              required
              className="w-full bg-[#575757] px-3 py-2 rounded-md"
            />
            {tiktokError && (
              <p className="text-red-500 text-xs mt-1">{tiktokError}</p>
            )}
          </div>
        )}

        {/* Bid input for paid bidding campaigns */}
        {campaign?.campaignType === "paid" &&
          campaign?.pricingModel === "bidding" && (
            <div>
              <label
                htmlFor="bid"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Enter your proposed bid (USD)
              </label>
              <input
                id="bid"
                name="bid"
                type="number"
                min={campaign.minBid || 1}
                max={campaign.maxBid || 10000}
                value={bid}
                onChange={(e) => setBid(e.target.value)}
                placeholder={`Enter a bid between $${
                  campaign.minBid || 1
                } and $${campaign.maxBid || 10000}`}
                className="w-full bg-[#575757] px-3 py-2 rounded-md"
                required
              />
              {bidError && (
                <p className="text-red-500 text-xs mt-1">{bidError}</p>
              )}
            </div>
          )}
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          onClick={scrollToTopOfDrawer}
          className={`w-full py-3 text-lg rounded-md text-white ${
            loading ? "bg-gray-500" : "bg-yellow-500 hover:bg-yellow-400"
          }`}
        >
          {loading ? "Loading..." : "Apply"}
        </button>
      </form>
      <ApplyAgreementModal
        isOpen={showAgreement}
        onClose={() => setShowAgreement(false)}
        onAgree={() => {
          setAgreed(true);
          setShowAgreement(false);
          setTimeout(() => {
            document.querySelector(".apply-drawer form")?.requestSubmit();
          }, 0);
        }}
      />
    </div>
  );
}
