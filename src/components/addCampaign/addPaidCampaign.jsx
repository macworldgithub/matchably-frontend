// src/components/brand/CampaignFormWizard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import config from "../../config";
import { InputField } from "../brand/addCampaign/InputField";
import { FileUpload } from "../brand/addCampaign/FileUpload";
import { SuccessMessage } from "../SuccessMessage";
import { HashtagsInput } from "../brand/addCampaign/HashtagsInput";
import { CampaignSubmittedModal } from "../brand/addCampaign/CampaignSubmittedModal";
import UnifiedLocationSelector from "../brand/addCampaign/UnifiedLocationSelector";

const CATEGORY_OPTIONS = [
  "Beauty",
  "Food",
  "Beverage",
  "Wellness & Supplements",
  "Personal Care",
];

const CREATOR_OPTIONS = [
  {
    label: "10 Creators (Show up to 20 applicants)",
    value: 10,
    applicantsToShow: 20,
  },
  {
    label: "15 Creators (Show up to 25 applicants)",
    value: 15,
    applicantsToShow: 25,
  },
  {
    label: "20 Creators (Show up to 30 applicants)",
    value: 20,
    applicantsToShow: 30,
  },
];

const PLATFORM_OPTIONS = ["TikTok", "Instagram", "YouTube"];

export default function CampaignFormWizard({ setShowModal, onCampaignAdded }) {
  // ───────────────────────────────────────────────────
  // STATE FOR "CAMPAIGN" OBJECT (ALL FIELDS IN ONE PLACE)
  // ───────────────────────────────────────────────────
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);

  const [campaign, setCampaign] = useState({
    // Step 1 (Campaign Info)
    campaignTitle: "",
    category: "", // (e.g. "Beauty")
    brandName: "",
    productName: "",
    productDescription: "",
    brandLogo: null, // File object
    productImages: [], // Array<File>
    numCreators: "", // 10 / 15 / 20
    // (We'll compute "applicantsToShow" on the backend from this)

    // 🟠 Step 1 – Pricing Model + Content Request
    pricingModel: "", // "fixed" or "bidding"
    fixedPrice: "", // if pricingModel === "fixed"
    minBid: "", // if pricingModel === "bidding"
    maxBid: "", // if pricingModel === "bidding"
    requestedContent: {
      videos: "",
      photos: "",
      notes: "",
    },

    // Step 2 (Content Guidelines)
    contentPlatform: "", // "TikTok" / "Instagram" / "YouTube"
    requiredHashtags: [], // ["#skincare", "#glow"]
    mentionHandle: "", // "@matchably.official"
    toneMessage: "", // e.g. "Bright, positive tone"
    referenceContent: "", // URL or optional
    referenceFile: null, // File object (optional)

    // 🟠 Step 2 – Creator Requirements
    creatorRequirements: {
      followerCount: "Any", // Any, 1K+, 5K+, ...
      location: "",
      minAge: "",
      maxAge: "",
      gender: "Any",
    },

    // Location Filter
    locationFilter: {
      locations: [],
      isGlobal: true, // Default to global when no specific location is selected
    },

    // Step 3 (Category‐Specific) – ALL OPTIONAL!
    // We'll keep everything in a nested object keyed by category:
    categoryDetails: {
      Beauty: {
        productType: "", // "Ampoule" / manual
        skinTypes: [], // ["Oily", "Dry", ...]
        keyIngredients: "", // comma-separated string
        howToUse: "", // multi-line
      },
      Food: {
        preparationMethod: "",
        dietaryTags: [],
        eatingScene: "",
      },
      Beverage: {
        servingType: "",
        servingTemperature: "",
        caffeineContent: "",
        dietaryTags: [],
      },
      "Wellness & Supplements": {
        productType: "",
        targetFunction: [],
        formType: "",
        usageTiming: "",
        flavor: "",
        dietaryTags: [],
      },
      "Personal Care": {
        productType: "",
        skinBodyAreas: [],
        keyIngredients: "",
        scentFlavor: "",
        textureForm: "",
      },
    },

    // 🟠 Step 3 – Usage Terms & Creator Commitments
    usageTerms: {
      usageRightsDuration: "", // e.g. "6 months", "1 year", "Forever"
      lateSubmissionPenalty: "",
      paymentResponsibilityNotice: false, // must be checked
      usageRights: [], // array of selected rights
      usageRightsOther: "", // if "Other" is selected
    },

    // Step 4 (Review – no new fields; just "status" to send)
    status: "Active",
    // Step 4 fields (avoid undefined)
    influencersReceive: "",
    participationRequirements: "",
    deadline: "", // or null, depending how you handle it
    recruitmentEndDate: "", // likewise
  });

  // ───────────────────────────────────────────────────
  // PER-FIELD LOCAL STATE (PREVIEW PROGRES ERRORS)
  // ───────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    brandLogo: 0,
    productImages: 0,
    referenceFile: 0,
  });
  const [imagePreviews, setImagePreviews] = useState({
    brandLogo: null, // Data URL
    productImages: [], // Array<Data URL>
    referenceFile: null, // Data URL if an image
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // ───────────────────────────────────────────────────
  // UPDATE FORM STATE BY NAME
  // ───────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign((prev) => ({ ...prev, [name]: value }));
  };

  // ───────────────────────────────────────────────────
  // STEP 1: IMAGE UPLOAD HANDLERS (SQUARE PREVIEWS via CSS)
  // ───────────────────────────────────────────────────
  const handleBrandLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCampaign((prev) => ({ ...prev, brandLogo: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev) => ({ ...prev, brandLogo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setCampaign((prev) => ({
      ...prev,
      productImages: [...prev.productImages, ...files],
    }));

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    ).then((previews) => {
      setImagePreviews((prev) => ({
        ...prev,
        productImages: [...prev.productImages, ...previews],
      }));
    });
  };

  const removeBrandLogo = () => {
    setCampaign((prev) => ({ ...prev, brandLogo: null }));
    setImagePreviews((prev) => ({ ...prev, brandLogo: null }));
    setUploadProgress((prev) => ({ ...prev, brandLogo: 0 }));
  };

  const removeProductImage = (index) => {
    setCampaign((prev) => {
      const newArr = [...prev.productImages];
      newArr.splice(index, 1);
      return { ...prev, productImages: newArr };
    });
    setImagePreviews((prev) => {
      const newArr = [...prev.productImages];
      newArr.splice(index, 1);
      return { ...prev, productImages: newArr };
    });
  };

  // ───────────────────────────────────────────────────
  // STEP 2: HASHTAGS & MENTION
  // ───────────────────────────────────────────────────
  const handleHashtagsChange = (e) => {
    const inputValue = e.target.value;
    const hashtagsArray = inputValue
      .split(" ")
      .filter((tag) => tag.startsWith("#") && tag.length > 1);
    setCampaign((prev) => ({
      ...prev,
      requiredHashtags: hashtagsArray,
    }));
  };

  // ───────────────────────────────────────────────────
  // STEP 2: REFERENCE CONTENT FILE/URL
  // ───────────────────────────────────────────────────
  const handleReferenceFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCampaign((prev) => ({ ...prev, referenceFile: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev) => ({ ...prev, referenceFile: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeReferenceFile = () => {
    setCampaign((prev) => ({ ...prev, referenceFile: null }));
    setImagePreviews((prev) => ({ ...prev, referenceFile: null }));
    setUploadProgress((prev) => ({ ...prev, referenceFile: 0 }));
  };

  // ───────────────────────────────────────────────────
  // STEP 3: CATEGORY-SPECIFIC FIELD HANDLER
  // We'll store everything under campaign.categoryDetails[category]
  // ───────────────────────────────────────────────────
  const handleCategoryDetailChange = (category, field, value) => {
    setCampaign((prev) => ({
      ...prev,
      categoryDetails: {
        ...prev.categoryDetails,
        [category]: {
          ...prev.categoryDetails[category],
          [field]: value,
        },
      },
    }));
  };

  // ───────────────────────────────────────────────────
  // VALIDATION FUNCTIONS FOR "Next" BUTTON
  // ───────────────────────────────────────────────────
  const validateStep1 = () => {
    // Required: campaignTitle, category, brandName, productName, productDescription,
    // brandLogo (optional?), at least one productImage (optional),
    // numCreators (10/15/20) must be selected
    const baseValid =
      campaign.campaignTitle.trim() !== "" &&
      campaign.category.trim() !== "" &&
      campaign.brandName.trim() !== "" &&
      campaign.productName.trim() !== "" &&
      campaign.productDescription.trim() !== "" &&
      campaign.numCreators !== "";

    // Pricing Model validation
    if (!campaign.pricingModel) return false;
    if (campaign.pricingModel === "fixed") {
      const price = Number(campaign.fixedPrice);
      if (isNaN(price) || price < 5) return false;
    } else if (campaign.pricingModel === "bidding") {
      const minBid = Number(campaign.minBid);
      const maxBid = Number(campaign.maxBid);
      if (
        isNaN(minBid) ||
        isNaN(maxBid) ||
        minBid < 1 ||
        maxBid < 1 ||
        minBid >= maxBid
      )
        return false;
    } else {
      return false;
    }

    // Requested Content validation
    const videos = Number(campaign.requestedContent.videos);
    const photos = Number(campaign.requestedContent.photos);
    if (
      isNaN(videos) ||
      videos < 0 ||
      isNaN(photos) ||
      photos < 0 ||
      (videos < 1 && photos < 1)
    )
      return false;

    return baseValid;
  };

  const validateStep2 = () => {
    // Required: contentPlatform, requiredHashtags (length > 0), mentionHandle (nonempty)
    return (
      campaign.contentPlatform !== "" &&
      campaign.requiredHashtags.length > 0 &&
      campaign.mentionHandle.trim() !== ""
    );
  };

  const validateStep3 = () => {
    // For paid campaigns, require paymentResponsibilityNotice to be checked
    return true;
  };

  const validateStep4 = () => {
    return (
      // campaign.participationRequirements &&
      // campaign.participationRequirements.trim() !== "" &&
      // campaign.influencersReceive &&
      // campaign.influencersReceive.trim() !== "" &&
      campaign.deadline &&
      campaign.deadline !== "" &&
      campaign.recruitmentEndDate &&
      campaign.recruitmentEndDate !== ""
    );
  };

  const [hashtagsInput, setHashtagsInput] = useState(
    campaign.requiredHashtags.join(" ")
  );

  // ───────────────────────────────────────────────────
  // HANDLE "Next," "Back," "Save Draft," AND "Submit"
  // ───────────────────────────────────────────────────
  const goToNext = () => {
    // If moving to Step 4, set deadlines if not already set
    if (step === 3) {
      if (!campaign.deadline || !campaign.recruitmentEndDate) {
        const today = new Date();
        const deadlineDate = new Date(today);
        deadlineDate.setDate(today.getDate() + 7);
        const recruitmentEndDate = new Date(deadlineDate);
        recruitmentEndDate.setDate(deadlineDate.getDate() + 7);
        setCampaign((prev) => ({
          ...prev,
          deadline: deadlineDate.toISOString().slice(0, 10),
          recruitmentEndDate: recruitmentEndDate.toISOString().slice(0, 10),
        }));
      }
    }
    setStep((prev) => prev + 1);
  };
  const goToBack = () => setStep((prev) => prev - 1);

  const handleSaveDraft = async () => {
    // You could implement a "save draft" that sends partial data to backend.
    // For now, let's just console.log and show a success message.
    console.log("Saving draft:", campaign);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1) Загрузка файлов
      let brandLogoUrl = "";
      const productImageUrls = [];
      const referenceUrls = [];

      if (campaign.brandLogo) {
        brandLogoUrl = await uploadFile(campaign.brandLogo, "brandLogo");
      }
      if (campaign.productImages.length > 0) {
        for (const file of campaign.productImages) {
          const url = await uploadFile(file, "productImages");
          productImageUrls.push(url);
        }
      }
      if (campaign.referenceFile) {
        const fileUrl = await uploadFile(
          campaign.referenceFile,
          "referenceFile"
        );
        referenceUrls.push(fileUrl);
      }
      if (campaign.referenceContent.trim()) {
        referenceUrls.push(campaign.referenceContent.trim());
      }

      // 2) Сборка полного payload
      const payload = {
        // Шаг 1
        campaignTitle: campaign.campaignTitle.trim(),
        campaignIndustry: campaign.category,
        campaignType: "paid", // Industry = Category
        category: campaign.category,
        brandName: campaign.brandName.trim(),
        productName: campaign.productName.trim(),
        productDescription: campaign.productDescription.trim(),
        brandLogo: brandLogoUrl,
        productImages: productImageUrls,
        creatorCount: Number(campaign.numCreators),

        // Paid Campaign fields
        pricingModel: campaign.pricingModel,
        fixedPrice:
          campaign.pricingModel === "fixed"
            ? Number(campaign.fixedPrice)
            : undefined,
        minBid:
          campaign.pricingModel === "bidding"
            ? Number(campaign.minBid)
            : undefined,
        maxBid:
          campaign.pricingModel === "bidding"
            ? Number(campaign.maxBid)
            : undefined,
        requestedContent: {
          videos: Number(campaign.requestedContent.videos),
          photos: Number(campaign.requestedContent.photos),
          notes: campaign.requestedContent.notes?.trim() || "",
        },

        // Step 2
        contentFormat: [campaign.contentPlatform],
        requiredHashtags: campaign.requiredHashtags,
        mentionHandle: campaign.mentionHandle.trim(),
        toneGuide: campaign.toneMessage.trim(),
        referenceContent: referenceUrls,

        // Creator Requirements
        creatorRequirements: {
          followerCount: campaign.creatorRequirements.followerCount,
          location: campaign.creatorRequirements.location,
          minAge: campaign.creatorRequirements.minAge,
          maxAge: campaign.creatorRequirements.maxAge,
          gender: campaign.creatorRequirements.gender,
        },

        // Location Filter
        locationFilter: {
          locations: campaign.locationFilter.locations,
          isGlobal: campaign.locationFilter.isGlobal,
        },

        // Step 3 (из UI в categoryDetails)
        beautyDetails:
          campaign.category === "Beauty"
            ? campaign.categoryDetails.Beauty
            : undefined,
        foodDetails:
          campaign.category === "Food"
            ? campaign.categoryDetails.Food
            : undefined,
        beverageDetails:
          campaign.category === "Beverage"
            ? campaign.categoryDetails.Beverage
            : undefined,
        wellnessDetails:
          campaign.category === "Wellness & Supplements"
            ? campaign.categoryDetails["Wellness & Supplements"]
            : undefined,
        personalCareDetails:
          campaign.category === "Personal Care"
            ? campaign.categoryDetails["Personal Care"]
            : undefined,

        // Usage Terms & Commitments
        usageTerms: {
          usageRightsDuration: campaign.usageTerms.usageRightsDuration,
          lateSubmissionPenalty: campaign.usageTerms.lateSubmissionPenalty,
          paymentResponsibilityNotice:
            campaign.usageTerms.paymentResponsibilityNotice,
          usageRights: campaign.usageTerms.usageRights,
          usageRightsOther: campaign.usageTerms.usageRightsOther,
        },

        // Шаг 4 – доп. поля (надо держать в состоянии!)
        influencersReceive: (campaign.influencersReceive || "").trim(),
        participationRequirements: (
          campaign.participationRequirements || ""
        ).trim(),
        deadline: campaign.deadline, // ожидайте Date или ISO string
        recruitmentEndDate: campaign.recruitmentEndDate, // тоже
        status: campaign.status, // «Pending Review»

        // Не нужно: applicantsToShow, recruiting (ставится на бекенде)
      };

      console.log("Payload Paid Campaign:", payload);
      // 3) Отправка на бекенд
      const token = Cookie.get("AdminToken");
      const response = await axios.post(
        `${config.BACKEND_URL}/admin/campaigns/addCampaign`,
        { campaign: payload },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data.status === "success") {
        setShowSubmittedModal(true);
      } else {
        setError(response.data.message || "Failed to create campaign");
      }
    } catch (err) {
      console.error("Error submitting campaign:", err);
      setError(err.response?.data?.message || "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────────────────────────────
  // UPLOAD UTILITY (handles form data + progress)
  // ───────────────────────────────────────────────────
  const uploadFile = async (file, fieldKey) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `${config.BACKEND_URL}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({
              ...prev,
              [fieldKey]: percentCompleted,
            }));
          },
        }
      );

      if (response.data.imageUrl) {
        return response.data.imageUrl;
      }
      throw new Error("Upload failed");
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
    }
  };

  // ───────────────────────────────────────────────────
  // RENDER: Modal + Card Container
  // ───────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="p-6">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Create New Campaign
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {success && (
            <SuccessMessage
              message="Operation successful!"
              onClose={() => setSuccess(false)}
            />
          )}
          {error && (
            <div className="bg-red-700 text-red-100 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ──────────────────────────────────────────────── */}
            {/* STEP 1: Enter Campaign Info */}
            {/* ──────────────────────────────────────────────── */}
            {step === 1 && (
              <div>
                <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2 mb-4">
                  Step 1: Enter Campaign Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* LEFT COLUMN */}
                  <div>
                    <InputField
                      label="Campaign Title"
                      name="campaignTitle"
                      value={campaign.campaignTitle}
                      onChange={handleChange}
                      placeholder="e.g. Summer Glow Ampoule Campaign"
                      required
                    />

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={campaign.category}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="">Select one…</option>
                        {CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <InputField
                      label="Brand Name"
                      name="brandName"
                      value={campaign.brandName}
                      onChange={handleChange}
                      placeholder="e.g. Glow Beauty"
                      required
                    />

                    <InputField
                      label="Product Name"
                      name="productName"
                      value={campaign.productName}
                      onChange={handleChange}
                      placeholder="e.g. Niacindy Facial Glow Ampoule"
                      required
                    />

                    <InputField
                      label="Product Description"
                      name="productDescription"
                      value={campaign.productDescription}
                      onChange={handleChange}
                      placeholder="Briefly describe key features and benefits"
                      textarea
                      required
                    />

                    <div className="mt-4">
                      <FileUpload
                        label="Product Images (up to 4)"
                        onChange={handleProductImagesChange}
                        multiple
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {imagePreviews.productImages.map((src, i) => (
                          <div key={i} className="relative w-20 h-20">
                            <img
                              src={src}
                              alt={`Product ${i}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeProductImage(i)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-400"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <FileUpload
                        label="Brand Logo (1)"
                        onChange={handleBrandLogoChange}
                        preview={imagePreviews.brandLogo}
                        onRemove={removeBrandLogo}
                      />
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div>
                    <h4 className="text-base font-semibold text-gray-200 mb-2">
                      Select Number of Creators{" "}
                      <span className="text-red-500">*</span>
                    </h4>
                    <div className="space-y-2 mb-6">
                      {CREATOR_OPTIONS.map((opt) => (
                        <label
                          key={opt.value}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-md transition-colors"
                        >
                          <input
                            type="radio"
                            name="numCreators"
                            value={opt.value}
                            checked={campaign.numCreators === String(opt.value)}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-500 border-gray-600 focus:ring-blue-400"
                            required
                          />
                          <span className="text-gray-200">{opt.label}</span>
                        </label>
                      ))}
                    </div>

                    <h4 className="text-base font-semibold text-gray-200 mb-2">
                      Auto-Fill & Convenience (Optional)
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        // ➡️ Here you could pop open a "Load from previous campaign" modal
                        alert("Load from previous campaign (not implemented)");
                      }}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Load from Previous Campaign
                    </button>
                  </div>
                </div>

                {/* 🟠 Step 1 – Pricing Model */}
                <div className="mt-8 border-t border-gray-800 pt-6">
                  <h4 className="text-base font-semibold text-white mb-2">
                    Pricing Model <span className="text-red-500">*</span>
                  </h4>
                  <div className="flex space-x-6 mb-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pricingModel"
                        value="fixed"
                        checked={campaign.pricingModel === "fixed"}
                        onChange={() =>
                          setCampaign((prev) => ({
                            ...prev,
                            pricingModel: "fixed",
                            minBid: "",
                            maxBid: "",
                          }))
                        }
                        className="h-4 w-4 text-blue-500 border-gray-600 focus:ring-blue-400"
                        required
                      />
                      <span className="text-gray-200">Fixed Price</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pricingModel"
                        value="bidding"
                        checked={campaign.pricingModel === "bidding"}
                        onChange={() =>
                          setCampaign((prev) => ({
                            ...prev,
                            pricingModel: "bidding",
                            fixedPrice: "",
                          }))
                        }
                        className="h-4 w-4 text-blue-500 border-gray-600 focus:ring-blue-400"
                        required
                      />
                      <span className="text-gray-200">Bidding</span>
                    </label>
                  </div>
                  {campaign.pricingModel === "fixed" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price per creator (USD){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={5}
                        step={1}
                        value={campaign.fixedPrice}
                        onChange={(e) =>
                          setCampaign((prev) => ({
                            ...prev,
                            fixedPrice: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required={campaign.pricingModel === "fixed"}
                        placeholder="Minimum $5"
                      />
                    </div>
                  )}
                  {campaign.pricingModel === "bidding" && (
                    <div className="mb-4 flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Min Bid (USD) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min={1}
                          step={1}
                          value={campaign.minBid}
                          onChange={(e) =>
                            setCampaign((prev) => ({
                              ...prev,
                              minBid: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          required={campaign.pricingModel === "bidding"}
                          placeholder="Min $1"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Max Bid (USD) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min={1}
                          step={1}
                          value={campaign.maxBid}
                          onChange={(e) =>
                            setCampaign((prev) => ({
                              ...prev,
                              maxBid: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          required={campaign.pricingModel === "bidding"}
                          placeholder="Max $1+"
                        />
                      </div>
                    </div>
                  )}
                  <div className="text-gray-400 text-xs mb-4">
                    Creators will see either the exact fixed price or the
                    min–max bidding range.
                  </div>
                </div>

                {/* Requested Content per Creator */}
                <div className="mt-8 border-t border-gray-800 pt-6">
                  <h4 className="text-base font-semibold text-white mb-2">
                    Requested Content per Creator{" "}
                    <span className="text-red-500">*</span>
                  </h4>
                  <div className="flex space-x-4 mb-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Video(s)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={campaign.requestedContent.videos}
                        onChange={(e) =>
                          setCampaign((prev) => ({
                            ...prev,
                            requestedContent: {
                              ...prev.requestedContent,
                              videos: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="0"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Photo(s)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={campaign.requestedContent.photos}
                        onChange={(e) =>
                          setCampaign((prev) => ({
                            ...prev,
                            requestedContent: {
                              ...prev.requestedContent,
                              photos: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Optional Notes
                    </label>
                    <input
                      type="text"
                      value={campaign.requestedContent.notes}
                      onChange={(e) =>
                        setCampaign((prev) => ({
                          ...prev,
                          requestedContent: {
                            ...prev.requestedContent,
                            notes: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="e.g. Please include 1 product shot and 1 lifestyle scene."
                    />
                  </div>
                </div>

                {/* BUTTONS: Back (disabled) | Next | Save Draft */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-800 mt-6">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Save as Draft
                  </button>
                  <div className="space-x-4">
                    <button
                      type="button"
                      className="px-6 py-2 bg-gray-600 text-gray-300 rounded-lg cursor-not-allowed"
                      disabled
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={goToNext}
                      disabled={!validateStep1()}
                      className={`px-6 py-2 rounded-lg transition-colors ${
                        validateStep1()
                          ? "bg-blue-600 hover:bg-blue-500 text-white"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ──────────────────────────────────────────────── */}
            {/* STEP 2: Set Content Guidelines */}
            {/* ──────────────────────────────────────────────── */}
            {step === 2 && (
              <div>
                <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2 mb-4">
                  Step 2: Set Content Guidelines
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Content Platform <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-6">
                      {PLATFORM_OPTIONS.map((plat) => (
                        <label
                          key={plat}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-md"
                        >
                          <input
                            type="radio"
                            name="contentPlatform"
                            value={plat}
                            checked={campaign.contentPlatform === plat}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-500 border-gray-600 focus:ring-blue-400"
                            required
                          />
                          <span className="text-gray-200">{plat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <HashtagsInput
                    label="Required Hashtags"
                    inputValue={hashtagsInput}
                    hashtags={campaign.requiredHashtags}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setHashtagsInput(raw);

                      const arr = raw
                        .split(" ")
                        .map((word) => word.trim())
                        .filter((word) => word.length > 0)
                        .map((word) =>
                          word.startsWith("#") ? word : `#${word}`
                        );

                      setCampaign((prev) => ({
                        ...prev,
                        requiredHashtags: arr,
                      }));
                    }}
                    required
                  />

                  <InputField
                    label={
                      <>
                        @ Mention (Brand Handle){" "}
                        <span className="text-red-500">*</span>
                      </>
                    }
                    name="mentionHandle"
                    value={campaign.mentionHandle}
                    onChange={handleChange}
                    placeholder="e.g. @matchably.official"
                    required
                  />

                  <InputField
                    label="Tone & Message Guide (Optional)"
                    name="toneMessage"
                    value={campaign.toneMessage}
                    onChange={handleChange}
                    placeholder="e.g. Bright, positive tone"
                    textarea
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Upload Reference Content (Optional)
                    </label>
                    <div className="flex items-center space-x-4">
                      <FileUpload
                        label="Upload File"
                        onChange={handleReferenceFileChange}
                        preview={imagePreviews.referenceFile}
                        onRemove={removeReferenceFile}
                      />
                      <InputField
                        label="Or paste URL"
                        name="referenceContent"
                        value={campaign.referenceContent}
                        onChange={handleChange}
                        placeholder="e.g. https://www.youtube.com/..."
                      />
                    </div>
                  </div>
                </div>

                {/* 🟠 Step 2 – Creator Requirements */}
                <div className="mt-8 border-t border-gray-800 pt-6">
                  <h4 className="text-base font-semibold text-white mb-2">
                    Creator Requirements (Optional)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Follower Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Follower Count
                      </label>
                      <select
                        value={campaign.creatorRequirements.followerCount}
                        onChange={(e) =>
                          setCampaign((prev) => ({
                            ...prev,
                            creatorRequirements: {
                              ...prev.creatorRequirements,
                              followerCount: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {[
                          "Any",
                          "1K+",
                          "5K+",
                          "10K+",
                          "50K+",
                          "100K+",
                          "500K+",
                        ].map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Location Filter */}
                    <div className="md:col-span-2">
                      <UnifiedLocationSelector
                        selectedLocations={campaign.locationFilter}
                        onChange={(locationData) =>
                          setCampaign((prev) => ({
                            ...prev,
                            locationFilter: locationData,
                          }))
                        }
                      />
                    </div>
                    {/* Age Range */}
                    <div className="flex space-x-2 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Min Age
                        </label>
                        <input
                          type="number"
                          min={18}
                          max={65}
                          value={campaign.creatorRequirements.minAge}
                          onChange={(e) =>
                            setCampaign((prev) => ({
                              ...prev,
                              creatorRequirements: {
                                ...prev.creatorRequirements,
                                minAge: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="18"
                        />
                      </div>
                      <span className="text-gray-400 mb-2">–</span>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Max Age
                        </label>
                        <input
                          type="number"
                          min={18}
                          max={65}
                          value={campaign.creatorRequirements.maxAge}
                          onChange={(e) =>
                            setCampaign((prev) => ({
                              ...prev,
                              creatorRequirements: {
                                ...prev.creatorRequirements,
                                maxAge: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="65"
                        />
                      </div>
                    </div>
                    {/* Gender Preference */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Gender Preference
                      </label>
                      <select
                        value={campaign.creatorRequirements.gender}
                        onChange={(e) =>
                          setCampaign((prev) => ({
                            ...prev,
                            creatorRequirements: {
                              ...prev.creatorRequirements,
                              gender: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {["Any", "Female", "Male", "Other / Non-Binary"].map(
                          (opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-800 mt-6">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Save as Draft
                  </button>
                  <div className="space-x-4">
                    <button
                      type="button"
                      onClick={goToBack}
                      className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={goToNext}
                      disabled={!validateStep2()}
                      className={`px-6 py-2 rounded-lg transition-colors ${
                        validateStep2()
                          ? "bg-blue-600 hover:bg-blue-500 text-white"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ──────────────────────────────────────────────── */}
            {/* STEP 3: Input Category-Specific Details */}
            {/* ──────────────────────────────────────────────── */}
            {step === 3 && (
              <div>
                <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2 mb-4">
                  Step 3: Input Category-Specific Details
                </h3>

                {/* Only show the section for the selected category */}
                {campaign.category === "Beauty" && (
                  <div className="space-y-4">
                    {/* Product Type: Dropdown suggestions + manual entry */}
                    <div>
                      <label
                        htmlFor="beauty_productType"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Product Type (Optional)
                      </label>
                      <input
                        type="text"
                        id="beauty_productType"
                        list="beautyProductTypeOptions"
                        placeholder="e.g. Ampoule, Serum, Cream…"
                        value={campaign.categoryDetails.Beauty.productType}
                        onChange={(e) =>
                          handleCategoryDetailChange(
                            "Beauty",
                            "productType",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <datalist id="beautyProductTypeOptions">
                        {[
                          "Ampoule",
                          "Serum",
                          "Cream",
                          "Cleanser",
                          "Mask Pack",
                          "Sunscreen",
                        ].map((opt) => (
                          <option key={opt} value={opt} />
                        ))}
                      </datalist>
                    </div>

                    {/* Skin Type: Checkboxes + 'Other' manual input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Skin Type (Optional)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {[
                          "Oily",
                          "Dry",
                          "Sensitive",
                          "Combination",
                          "Acne-prone",
                          "Other",
                        ].map((stype) => (
                          <label
                            key={stype}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-md"
                          >
                            <input
                              type="checkbox"
                              checked={campaign.categoryDetails.Beauty.skinTypes.includes(
                                stype
                              )}
                              onChange={() => {
                                const arr =
                                  campaign.categoryDetails.Beauty.skinTypes;
                                const updated = arr.includes(stype)
                                  ? arr.filter((x) => x !== stype)
                                  : [...arr, stype];
                                handleCategoryDetailChange(
                                  "Beauty",
                                  "skinTypes",
                                  updated
                                );
                              }}
                              className="h-4 w-4 text-blue-500 border-gray-600 focus:ring-blue-400"
                            />
                            <span className="text-gray-200">{stype}</span>
                          </label>
                        ))}
                      </div>
                      {campaign.categoryDetails.Beauty.skinTypes.includes(
                        "Other"
                      ) && (
                        <input
                          type="text"
                          placeholder="Please specify other skin type"
                          value={
                            campaign.categoryDetails.Beauty.otherSkinType || ""
                          }
                          onChange={(e) =>
                            handleCategoryDetailChange(
                              "Beauty",
                              "otherSkinType",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      )}
                    </div>

                    {/* Key Ingredients: Text + auto-suggestions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Key Ingredients (Optional)
                      </label>
                      <input
                        type="text"
                        list="beautyIngredientOptions"
                        placeholder="e.g. Niacinamide, CICA, Hyaluronic Acid…"
                        value={campaign.categoryDetails.Beauty.keyIngredients}
                        onChange={(e) =>
                          handleCategoryDetailChange(
                            "Beauty",
                            "keyIngredients",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <datalist id="beautyIngredientOptions">
                        {[
                          "Niacinamide",
                          "CICA",
                          "Hyaluronic Acid",
                          "Retinol",
                          "Peptides",
                          "Tea Tree",
                          "Centella Asiatica",
                        ].map((ing) => (
                          <option key={ing} value={ing} />
                        ))}
                      </datalist>
                    </div>

                    {/* How to Use: Multi-line text area */}
                    <InputField
                      label="How to Use (Optional)"
                      name="beauty_howToUse"
                      value={campaign.categoryDetails.Beauty.howToUse}
                      onChange={(e) =>
                        handleCategoryDetailChange(
                          "Beauty",
                          "howToUse",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Apply after toner, morning & night"
                      textarea
                    />
                  </div>
                )}

                {campaign.category === "Food" && (
                  <div className="space-y-4">
                    {/* Preparation Method: Dropdown suggestions + manual entry */}
                    <div>
                      <label
                        htmlFor="food_preparationMethod"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Preparation Method (Optional)
                      </label>
                      <input
                        type="text"
                        id="food_preparationMethod"
                        list="foodPreparationOptions"
                        placeholder="e.g. Ready-to-Eat, Microwaveable, Requires Cooking…"
                        value={campaign.categoryDetails.Food.preparationMethod}
                        onChange={(e) =>
                          handleCategoryDetailChange(
                            "Food",
                            "preparationMethod",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <datalist id="foodPreparationOptions">
                        {[
                          "Ready-to-Eat",
                          "Microwaveable",
                          "Requires Cooking",
                          "Frozen Meal",
                        ].map((opt) => (
                          <option key={opt} value={opt} />
                        ))}
                      </datalist>
                    </div>

                    {/* Dietary Tag: Checkboxes + 'Other' manual input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Dietary Tag (Optional)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {[
                          "Vegan",
                          "Vegetarian",
                          "Keto",
                          "Gluten-Free",
                          "Organic",
                          "Other",
                        ].map((tag) => (
                          <label
                            key={tag}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-md"
                          >
                            <input
                              type="checkbox"
                              checked={campaign.categoryDetails.Food.dietaryTags.includes(
                                tag
                              )}
                              onChange={() => {
                                const arr =
                                  campaign.categoryDetails.Food.dietaryTags;
                                const updated = arr.includes(tag)
                                  ? arr.filter((x) => x !== tag)
                                  : [...arr, tag];
                                handleCategoryDetailChange(
                                  "Food",
                                  "dietaryTags",
                                  updated
                                );
                              }}
                              className="h-4 w-4 text-blue-500 border-gray-600 focus:ring-blue-400"
                            />
                            <span className="text-gray-200">{tag}</span>
                          </label>
                        ))}
                      </div>
                      {campaign.categoryDetails.Food.dietaryTags.includes(
                        "Other"
                      ) && (
                        <input
                          type="text"
                          placeholder="Please specify other dietary tag"
                          value={
                            campaign.categoryDetails.Food.otherDietaryTag || ""
                          }
                          onChange={(e) =>
                            handleCategoryDetailChange(
                              "Food",
                              "otherDietaryTag",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      )}
                    </div>

                    {/* Eating Scene: Dropdown suggestions + manual entry */}
                    <div>
                      <label
                        htmlFor="food_eatingScene"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Eating Scene (Optional)
                      </label>
                      <input
                        type="text"
                        id="food_eatingScene"
                        list="foodEatingSceneOptions"
                        placeholder="e.g. Solo Meal, Picnic, Family Dinner…"
                        value={campaign.categoryDetails.Food.eatingScene}
                        onChange={(e) =>
                          handleCategoryDetailChange(
                            "Food",
                            "eatingScene",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <datalist id="foodEatingSceneOptions">
                        {[
                          "Solo Meal",
                          "Picnic",
                          "Family Dinner",
                          "Party Food",
                          "Office Lunch",
                          "On-the-Go Snack",
                        ].map((opt) => (
                          <option key={opt} value={opt} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                )}

                {campaign.category === "Beverage" && (
                  <div className="space-y-4">
                    {/* Serving Type: Dropdown suggestions + manual entry */}
                    <div>
                      <label
                        htmlFor="beverage_servingType"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Serving Type (Optional)
                      </label>
                      <input
                        type="text"
                        id="beverage_servingType"
                        list="beverageServingTypeOptions"
                        placeholder="e.g. Bottle, Can, Powder Mix…"
                        value={campaign.categoryDetails.Beverage.servingType}
                        onChange={(e) =>
                          handleCategoryDetailChange(
                            "Beverage",
                            "servingType",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <datalist id="beverageServingTypeOptions">
                        {[
                          "Bottle",
                          "Can",
                          "Powder Mix",
                          "Concentrate",
                          "Stick Pack",
                        ].map((opt) => (
                          <option key={opt} value={opt} />
                        ))}
                      </datalist>
                    </div>

                    {/* Serving Temperature: Dropdown suggestions + manual entry */}
                    <div>
                      <label
                        htmlFor="beverage_servingTemperature"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Serving Temperature (Optional)
                      </label>
                      <input
                        type="text"
                        id="beverage_servingTemperature"
                        list="beverageServingTempOptions"
                        placeholder="e.g. Chilled, Room Temperature…"
                        value={
                          campaign.categoryDetails.Beverage.servingTemperature
                        }
                        onChange={(e) =>
                          handleCategoryDetailChange(
                            "Beverage",
                            "servingTemperature",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <datalist id="beverageServingTempOptions">
                        {["Chilled", "Room Temperature", "Hot", "With Ice"].map(
                          (opt) => (
                            <option key={opt} value={opt} />
                          )
                        )}
                      </datalist>
                    </div>

                    {/* Caffeine Content: Radio buttons */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Caffeine Content (Optional)
                      </label>
                      <div className="flex items-center space-x-4">
                        {[
                          "Contains Caffeine",
                          "Caffeine-Free",
                          "Low Caffeine",
                        ].map((opt) => (
                          <label
                            key={opt}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-md"
                          >
                            <input
                              type="radio"
                              name="beverage_caffeineContent"
                              value={opt}
                              checked={
                                campaign.categoryDetails.Beverage
                                  .caffeineContent === opt
                              }
                              onChange={() =>
                                handleCategoryDetailChange(
                                  "Beverage",
                                  "caffeineContent",
                                  opt
                                )
                              }
                              className="h-4 w-4 text-blue-500 border-gray-600 focus:ring-blue-400"
                            />
                            <span className="text-gray-200">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Dietary Tag: Checkboxes + 'Other' manual input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Dietary Tag (Optional)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {[
                          "Sugar-Free",
                          "Keto",
                          "Vegan",
                          "Organic",
                          "Other",
                        ].map((tag) => (
                          <label
                            key={tag}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-md"
                          >
                            <input
                              type="checkbox"
                              checked={campaign.categoryDetails.Beverage.dietaryTags.includes(
                                tag
                              )}
                              onChange={() => {
                                const arr =
                                  campaign.categoryDetails.Beverage.dietaryTags;
                                const updated = arr.includes(tag)
                                  ? arr.filter((x) => x !== tag)
                                  : [...arr, tag];
                                handleCategoryDetailChange(
                                  "Beverage",
                                  "dietaryTags",
                                  updated
                                );
                              }}
                              className="h-4 w-4 text-blue-500 border-gray-600 focus:ring-blue-400"
                            />
                            <span className="text-gray-200">{tag}</span>
                          </label>
                        ))}
                      </div>
                      {campaign.categoryDetails.Beverage.dietaryTags.includes(
                        "Other"
                      ) && (
                        <input
                          type="text"
                          placeholder="Please specify other dietary tag"
                          value={
                            campaign.categoryDetails.Beverage.otherDietaryTag ||
                            ""
                          }
                          onChange={(e) =>
                            handleCategoryDetailChange(
                              "Beverage",
                              "otherDietaryTag",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      )}
                    </div>
                  </div>
                )}

                {campaign.category === "Wellness & Supplements" && (
                  <div className="space-y-4">
                    {/* Product Type: Dropdown suggestions + manual entry */}
                    <div>
                      <label
                        htmlFor="wellness_productType"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Product Type (Optional)
                      </label>
                      <input
                        type="text"
                        id="wellness_productType"
                        list="wellnessProductTypeOptions"
                        placeholder="e.g. Vitamins, Collagen Jelly…"
                        value={
                          campaign.categoryDetails["Wellness & Supplements"]
                            .productType
                        }
                        onChange={(e) =>
                          handleCategoryDetailChange(
                            "Wellness & Supplements",
                            "productType",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <datalist id="wellnessProductTypeOptions">
                        {[
                          "Vitamins",
                          "Collagen Jelly",
                          "Sleep Aids",
                          "Digestive Health",
                          "Energy Gels",
                          "Protein",
                          "Multivitamins",
                          "Omega-3",
                          "Dietary Fiber",
                        ].map((opt) => (
                          <option key={opt} value={opt} />
                        ))}
                      </datalist>
                    </div>

                    {/* Target Function: Checkboxes + 'Other' manual input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Target Function (Optional)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {[
                          "Immune Boost",
                          "Skin Improvement",
                          "Sleep",
                          "Fatigue Recovery",
                          "Digestive Health",
                          "Weight Control",
                          "Eye Health",
                          "Antioxidant",
                          "Other",
                        ].map((func) => (
                          <label
                            key={func}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-md"
                          >
                            <input
                              type="checkbox"
                              checked={campaign.categoryDetails[
                                "Wellness & Supplements"
                              ].targetFunction.includes(func)}
                              onChange={() => {
                                const arr =
                                  campaign.categoryDetails[
                                    "Wellness & Supplements"
                                  ].targetFunction;
                                const updated = arr.includes(func)
                                  ? arr.filter((x) => x !== func)
                                  : [...arr, func];
                                handleCategoryDetailChange(
                                  "Wellness & Supplements",
                                  "targetFunction",
                                  updated
                                );
                              }}
                              className="h-4 w-4 text-blue-500 border-gray-600 focus:ring-blue-400"
                            />
                            <span className="text-gray-200">{func}</span>
                          </label>
                        ))}
                      </div>
                      {campaign.categoryDetails[
                        "Wellness & Supplements"
                      ].targetFunction.includes("Other") && (
                        <input
                          type="text"
                          placeholder="Please specify other function"
                          value={
                            campaign.categoryDetails["Wellness & Supplements"]
                              .otherTargetFunction || ""
                          }
                          onChange={(e) =>
                            handleCategoryDetailChange(
                              "Wellness & Supplements",
                              "otherTargetFunction",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      )}
                    </div>

                    {/* Form Type: Dropdown suggestions + manual entry */}
                    <div>
                      <label
                        htmlFor="wellness_formType"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Form Type (Optional)
                      </label>
                      <input
                        type="text"
                        id="wellness_formType"
                        list="wellnessFormTypeOptions"
                        placeholder="e.g. Tablet, Powder, Liquid…"
                        value={
                          campaign.categoryDetails["Wellness & Supplements"]
                            .formType
                        }
                        onChange={(e) =>
                          handleCategoryDetailChange(
                            "Wellness & Supplements",
                            "formType",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <datalist id="wellnessFormTypeOptions">
                        {[
                          "Jelly",
                          "Tablet",
                          "Powder",
                          "Liquid",
                          "Capsule",
                          "Stick Pack",
                        ].map((opt) => (
                          <option key={opt} value={opt} />
                        ))}
                      </datalist>
                    </div>

                    {/* Usage Timing: Dropdown suggestions + manual entry */}
                    <div>
                      <label
                        htmlFor="wellness_usageTiming"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Usage Timing (Optional)
                      </label>
                      <input
                        type="text"
                        id="wellness_usageTiming"
                        list="wellnessUsageTimingOptions"
                        placeholder="e.g. Morning, Evening…"
                        value={
                          campaign.categoryDetails["Wellness & Supplements"]
                            .usageTiming
                        }
                        onChange={(e) =>
                          handleCategoryDetailChange(
                            "Wellness & Supplements",
                            "usageTiming",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <datalist id="wellnessUsageTimingOptions">
                        {[
                          "Morning",
                          "Noon",
                          "Evening",
                          "Empty Stomach",
                          "Before Sleep",
                        ].map((opt) => (
                          <option key={opt} value={opt} />
                        ))}
                      </datalist>
                    </div>

                    {/* Flavor: Text + manual input */}
                    <div>
                      <label
                        htmlFor="wellness_flavor"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Flavor (Optional)
                      </label>
                      <input
                        type="text"
                        id="wellness_flavor"
                        placeholder="e.g. Strawberry, Orange…"
                        value={
                          campaign.categoryDetails["Wellness & Supplements"]
                            .flavor
                        }
                        onChange={(e) =>
                          handleCategoryDetailChange(
                            "Wellness & Supplements",
                            "flavor",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {/* Dietary Tag: Checkboxes + 'Other' manual input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Dietary Tag (Optional)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {[
                          "Vegan",
                          "Gluten-Free",
                          "Sugar-Free",
                          "Dairy-Free",
                          "NON-GMO",
                          "Other",
                        ].map((tag) => (
                          <label
                            key={tag}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-md"
                          >
                            <input
                              type="checkbox"
                              checked={campaign.categoryDetails[
                                "Wellness & Supplements"
                              ].dietaryTags.includes(tag)}
                              onChange={() => {
                                const arr =
                                  campaign.categoryDetails[
                                    "Wellness & Supplements"
                                  ].dietaryTags;
                                const updated = arr.includes(tag)
                                  ? arr.filter((x) => x !== tag)
                                  : [...arr, tag];
                                handleCategoryDetailChange(
                                  "Wellness & Supplements",
                                  "dietaryTags",
                                  updated
                                );
                              }}
                              className="h-4 w-4 text-blue-500 border-gray-600 focus:ring-blue-400"
                            />
                            <span className="text-gray-200">{tag}</span>
                          </label>
                        ))}
                      </div>
                      {campaign.categoryDetails[
                        "Wellness & Supplements"
                      ].dietaryTags.includes("Other") && (
                        <input
                          type="text"
                          placeholder="Please specify other dietary tag"
                          value={
                            campaign.categoryDetails["Wellness & Supplements"]
                              .otherDietaryTag || ""
                          }
                          onChange={(e) =>
                            handleCategoryDetailChange(
                              "Wellness & Supplements",
                              "otherDietaryTag",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      )}
                    </div>
                  </div>
                )}

                {campaign.category === "Personal Care" && (
                  <div className="space-y-4">
                    {/* Product Type: Dropdown suggestions + manual entry */}
                    <div>
                      <label
                        htmlFor="personal_productType"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Product Type (Optional)
                      </label>
                      <input
                        type="text"
                        id="personal_productType"
                        list="personalProductTypeOptions"
                        placeholder="e.g. Body Wash, Toothpaste, Deodorant…"
                        value={
                          campaign.categoryDetails["Personal Care"].productType
                        }
                        onChange={(e) =>
                          handleCategoryDetailChange(
                            "Personal Care",
                            "productType",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <datalist id="personalProductTypeOptions">
                        {[
                          "Body Wash",
                          "Toothpaste",
                          "Deodorant",
                          "Soap",
                          "Hand Cream",
                          "Feminine Products",
                          "Hand Wash",
                        ].map((opt) => (
                          <option key={opt} value={opt} />
                        ))}
                      </datalist>
                    </div>

                    {/* Skin/Body Area: Checkboxes + 'Other' manual input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Skin/Body Area (Optional)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {[
                          "Full Body",
                          "Hands",
                          "Oral",
                          "Underarms",
                          "Face",
                          "Feet",
                          "Other",
                        ].map((area) => (
                          <label
                            key={area}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-md"
                          >
                            <input
                              type="checkbox"
                              checked={campaign.categoryDetails[
                                "Personal Care"
                              ].skinBodyAreas.includes(area)}
                              onChange={() => {
                                const arr =
                                  campaign.categoryDetails["Personal Care"]
                                    .skinBodyAreas;
                                const updated = arr.includes(area)
                                  ? arr.filter((x) => x !== area)
                                  : [...arr, area];
                                handleCategoryDetailChange(
                                  "Personal Care",
                                  "skinBodyAreas",
                                  updated
                                );
                              }}
                              className="h-4 w-4 text-blue-500 border-gray-600 focus:ring-blue-400"
                            />
                            <span className="text-gray-200">{area}</span>
                          </label>
                        ))}
                      </div>
                      {campaign.categoryDetails[
                        "Personal Care"
                      ].skinBodyAreas.includes("Other") && (
                        <input
                          type="text"
                          placeholder="Please specify other area"
                          value={
                            campaign.categoryDetails["Personal Care"]
                              .otherSkinBodyArea || ""
                          }
                          onChange={(e) =>
                            handleCategoryDetailChange(
                              "Personal Care",
                              "otherSkinBodyArea",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      )}
                    </div>

                    {/* Key Ingredients: Text + auto-suggestions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Key Ingredients (Optional)
                      </label>
                      <input
                        type="text"
                        list="personalKeyIngredientsOptions"
                        placeholder="e.g. Aloe, Mint, Centella…"
                        value={
                          campaign.categoryDetails["Personal Care"]
                            .keyIngredients
                        }
                        onChange={(e) =>
                          handleCategoryDetailChange(
                            "Personal Care",
                            "keyIngredients",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <datalist id="personalKeyIngredientsOptions">
                        {[
                          "Tannin",
                          "Centella",
                          "Mint Oil",
                          "Eucalyptus",
                          "Aloe",
                        ].map((ing) => (
                          <option key={ing} value={ing} />
                        ))}
                      </datalist>
                    </div>

                    {/* Scent / Flavor: Free text */}
                    <div>
                      <label
                        htmlFor="personal_scentFlavor"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Scent / Flavor (Optional)
                      </label>
                      <input
                        type="text"
                        id="personal_scentFlavor"
                        placeholder="e.g. Lavender, Unscented…"
                        value={
                          campaign.categoryDetails["Personal Care"].scentFlavor
                        }
                        onChange={(e) =>
                          handleCategoryDetailChange(
                            "Personal Care",
                            "scentFlavor",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {/* Texture / Form: Dropdown suggestions + manual entry */}
                    <div>
                      <label
                        htmlFor="personal_textureForm"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Texture / Form (Optional)
                      </label>
                      <input
                        type="text"
                        id="personal_textureForm"
                        list="personalTextureFormOptions"
                        placeholder="e.g. Gel, Cream, Foam…"
                        value={
                          campaign.categoryDetails["Personal Care"].textureForm
                        }
                        onChange={(e) =>
                          handleCategoryDetailChange(
                            "Personal Care",
                            "textureForm",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <datalist id="personalTextureFormOptions">
                        {[
                          "Gel",
                          "Cream",
                          "Liquid",
                          "Foam",
                          "Pad",
                          "Solid",
                          "Mist",
                        ].map((opt) => (
                          <option key={opt} value={opt} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                )}

                {/* 🟠 Step 3 – Usage Terms & Creator Commitments */}
                <div className="mt-8 border-t border-gray-800 pt-6">
                  <h4 className="text-base font-semibold text-white mb-2">
                    Usage Terms & Creator Commitments
                  </h4>
                  {/* Usage Rights Duration */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Usage Rights Duration (Optional)
                    </label>
                    <input
                      type="text"
                      list="usageRightsDurationOptions"
                      value={campaign.usageTerms.usageRightsDuration}
                      onChange={(e) =>
                        setCampaign((prev) => ({
                          ...prev,
                          usageTerms: {
                            ...prev.usageTerms,
                            usageRightsDuration: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="e.g. 6 months, 1 year, Forever"
                    />
                    <datalist id="usageRightsDurationOptions">
                      {["6 months", "1 year", "2 years", "Forever"].map(
                        (opt) => (
                          <option key={opt} value={opt} />
                        )
                      )}
                    </datalist>
                  </div>
                  {/* Late Submission Penalty */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Late Submission Penalty (Optional, max 200 chars)
                    </label>
                    <input
                      type="text"
                      maxLength={200}
                      value={campaign.usageTerms.lateSubmissionPenalty}
                      onChange={(e) =>
                        setCampaign((prev) => ({
                          ...prev,
                          usageTerms: {
                            ...prev.usageTerms,
                            lateSubmissionPenalty: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="e.g. 20% deduction if more than 3 days late"
                    />
                  </div>
                  {/* Usage Rights (multi-checkbox) */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Usage Rights (Optional – Multiple Selection Allowed)
                    </label>
                    <div className="flex flex-wrap gap-4 mb-2">
                      {[
                        "Social Only (Instagram/TikTok feed, story)",
                        "Paid Ads (Meta/TikTok Spark Ads)",
                        "Website / Email Marketing",
                        "Other",
                      ].map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-md"
                        >
                          <input
                            type="checkbox"
                            checked={campaign.usageTerms.usageRights.includes(
                              opt
                            )}
                            onChange={() => {
                              const arr = campaign.usageTerms.usageRights;
                              const updated = arr.includes(opt)
                                ? arr.filter((x) => x !== opt)
                                : [...arr, opt];
                              setCampaign((prev) => ({
                                ...prev,
                                usageTerms: {
                                  ...prev.usageTerms,
                                  usageRights: updated,
                                },
                              }));
                            }}
                            className="h-4 w-4 text-blue-500 border-gray-600 focus:ring-blue-400"
                          />
                          <span className="text-gray-200">{opt}</span>
                        </label>
                      ))}
                    </div>
                    {campaign.usageTerms.usageRights.includes("Other") && (
                      <input
                        type="text"
                        placeholder="Please specify other usage rights"
                        value={campaign.usageTerms.usageRightsOther}
                        onChange={(e) =>
                          setCampaign((prev) => ({
                            ...prev,
                            usageTerms: {
                              ...prev.usageTerms,
                              usageRightsOther: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-800 mt-6">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Save as Draft
                  </button>
                  <div className="space-x-4">
                    <button
                      type="button"
                      onClick={goToBack}
                      className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={goToNext}
                      disabled={!validateStep3()}
                      className={`px-6 py-2 rounded-lg transition-colors ${
                        validateStep3()
                          ? "bg-blue-600 hover:bg-blue-500 text-white"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ──────────────────────────────────────────────── */}
            {/* STEP 4: Review & Submit */}
            {/* ──────────────────────────────────────────────── */}
            {step === 4 && (
              <div>
                <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2 mb-4">
                  Step 4: Review & Submit
                </h3>

                <div className="space-y-6 text-gray-200">
                  {/* Summary of Step 1 */}
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Campaign Info</h4>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                    <p>
                      <span className="font-semibold">Title:</span>{" "}
                      {campaign.campaignTitle}
                    </p>
                    <p>
                      <span className="font-semibold">Category:</span>{" "}
                      {campaign.category}
                    </p>
                    <p>
                      <span className="font-semibold">Brand Name:</span>{" "}
                      {campaign.brandName}
                    </p>
                    <p>
                      <span className="font-semibold">Product Name:</span>{" "}
                      {campaign.productName}
                    </p>
                    <p>
                      <span className="font-semibold">Description:</span>{" "}
                      {campaign.productDescription}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {imagePreviews.productImages.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`Preview ${i}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                    {imagePreviews.brandLogo && (
                      <div className="mt-2">
                        <span className="font-semibold">Brand Logo:</span>
                        <img
                          src={imagePreviews.brandLogo}
                          alt="Brand Logo Preview"
                          className="w-16 h-16 object-cover rounded-lg ml-2 inline-block"
                        />
                      </div>
                    )}
                    <p className="mt-2">
                      <span className="font-semibold"># Creators:</span>{" "}
                      {campaign.numCreators} (
                      {
                        CREATOR_OPTIONS.find(
                          (opt) => opt.value === Number(campaign.numCreators)
                        )?.applicantsToShow
                      }{" "}
                      applicants shown)
                    </p>
                  </div>

                  {/* Summary of Step 2 */}
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Content Guidelines</h4>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                    <p>
                      <span className="font-semibold">Platform:</span>{" "}
                      {campaign.contentPlatform}
                    </p>
                    <p>
                      <span className="font-semibold">Hashtags:</span>{" "}
                      {campaign.requiredHashtags.join(" ")}
                    </p>
                    <p>
                      <span className="font-semibold">@Mention:</span>{" "}
                      {campaign.mentionHandle}
                    </p>
                    {campaign.toneMessage && (
                      <p>
                        <span className="font-semibold">Tone Guide:</span>{" "}
                        {campaign.toneMessage}
                      </p>
                    )}
                    {campaign.referenceContent && (
                      <p>
                        <span className="font-semibold">Reference URL:</span>{" "}
                        <a
                          href={campaign.referenceContent}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:underline"
                        >
                          {campaign.referenceContent}
                        </a>
                      </p>
                    )}
                    {imagePreviews.referenceFile && (
                      <div className="mt-2">
                        <span className="font-semibold">Reference File:</span>
                        <img
                          src={imagePreviews.referenceFile}
                          alt="Reference Preview"
                          className="w-16 h-16 object-cover rounded-lg ml-2 inline-block"
                        />
                      </div>
                    )}
                  </div>

                  {/* Summary of Step 3 */}
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">
                        Category-Specific Details
                      </h4>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Edit
                      </button>
                    </div>

                    <p className="italic text-gray-400 mb-2">
                      (All fields below were optional; only showing those you
                      filled)
                    </p>

                    {campaign.category === "Beauty" && (
                      <div className="space-y-1">
                        {campaign.categoryDetails.Beauty.productType && (
                          <p>
                            <span className="font-semibold">Product Type:</span>{" "}
                            {campaign.categoryDetails.Beauty.productType}
                          </p>
                        )}
                        {campaign.categoryDetails.Beauty.skinTypes.length >
                          0 && (
                          <p>
                            <span className="font-semibold">Skin Types:</span>{" "}
                            {campaign.categoryDetails.Beauty.skinTypes.join(
                              ", "
                            )}
                          </p>
                        )}
                        {campaign.categoryDetails.Beauty.keyIngredients && (
                          <p>
                            <span className="font-semibold">
                              Key Ingredients:
                            </span>{" "}
                            {campaign.categoryDetails.Beauty.keyIngredients}
                          </p>
                        )}
                        {campaign.categoryDetails.Beauty.howToUse && (
                          <p>
                            <span className="font-semibold">How to Use:</span>{" "}
                            {campaign.categoryDetails.Beauty.howToUse}
                          </p>
                        )}
                        {!campaign.categoryDetails.Beauty.productType &&
                          campaign.categoryDetails.Beauty.skinTypes.length ===
                            0 &&
                          !campaign.categoryDetails.Beauty.keyIngredients &&
                          !campaign.categoryDetails.Beauty.howToUse && (
                            <p className="text-gray-400">
                              No Beauty details provided.
                            </p>
                          )}
                      </div>
                    )}

                    {campaign.category === "Food" && (
                      <div className="space-y-1">
                        {campaign.categoryDetails.Food.preparationMethod && (
                          <p>
                            <span className="font-semibold">
                              Preparation Method:
                            </span>{" "}
                            {campaign.categoryDetails.Food.preparationMethod}
                          </p>
                        )}
                        {campaign.categoryDetails.Food.dietaryTags.length >
                          0 && (
                          <p>
                            <span className="font-semibold">Dietary Tags:</span>{" "}
                            {campaign.categoryDetails.Food.dietaryTags.join(
                              ", "
                            )}
                          </p>
                        )}
                        {campaign.categoryDetails.Food.eatingScene && (
                          <p>
                            <span className="font-semibold">Eating Scene:</span>{" "}
                            {campaign.categoryDetails.Food.eatingScene}
                          </p>
                        )}
                        {!campaign.categoryDetails.Food.preparationMethod &&
                          campaign.categoryDetails.Food.dietaryTags.length ===
                            0 &&
                          !campaign.categoryDetails.Food.eatingScene && (
                            <p className="text-gray-400">
                              No Food details provided.
                            </p>
                          )}
                      </div>
                    )}

                    {campaign.category === "Beverage" && (
                      <div className="space-y-1">
                        {campaign.categoryDetails.Beverage.servingType && (
                          <p>
                            <span className="font-semibold">Serving Type:</span>{" "}
                            {campaign.categoryDetails.Beverage.servingType}
                          </p>
                        )}
                        {campaign.categoryDetails.Beverage
                          .servingTemperature && (
                          <p>
                            <span className="font-semibold">
                              Serving Temperature:
                            </span>{" "}
                            {
                              campaign.categoryDetails.Beverage
                                .servingTemperature
                            }
                          </p>
                        )}
                        {campaign.categoryDetails.Beverage.caffeineContent && (
                          <p>
                            <span className="font-semibold">
                              Caffeine Content:
                            </span>{" "}
                            {campaign.categoryDetails.Beverage.caffeineContent}
                          </p>
                        )}
                        {campaign.categoryDetails.Beverage.dietaryTags.length >
                          0 && (
                          <p>
                            <span className="font-semibold">Dietary Tags:</span>{" "}
                            {campaign.categoryDetails.Beverage.dietaryTags.join(
                              ", "
                            )}
                          </p>
                        )}
                        {!campaign.categoryDetails.Beverage.servingType &&
                          !campaign.categoryDetails.Beverage
                            .servingTemperature &&
                          !campaign.categoryDetails.Beverage.caffeineContent &&
                          campaign.categoryDetails.Beverage.dietaryTags
                            .length === 0 && (
                            <p className="text-gray-400">
                              No Beverage details provided.
                            </p>
                          )}
                      </div>
                    )}

                    {campaign.category === "Wellness & Supplements" && (
                      <div className="space-y-1">
                        {campaign.categoryDetails["Wellness & Supplements"]
                          .productType && (
                          <p>
                            <span className="font-semibold">Product Type:</span>{" "}
                            {
                              campaign.categoryDetails["Wellness & Supplements"]
                                .productType
                            }
                          </p>
                        )}
                        {campaign.categoryDetails["Wellness & Supplements"]
                          .targetFunction.length > 0 && (
                          <p>
                            <span className="font-semibold">
                              Target Function:
                            </span>{" "}
                            {campaign.categoryDetails[
                              "Wellness & Supplements"
                            ].targetFunction.join(", ")}
                          </p>
                        )}
                        {campaign.categoryDetails["Wellness & Supplements"]
                          .formType && (
                          <p>
                            <span className="font-semibold">Form Type:</span>{" "}
                            {
                              campaign.categoryDetails["Wellness & Supplements"]
                                .formType
                            }
                          </p>
                        )}
                        {campaign.categoryDetails["Wellness & Supplements"]
                          .usageTiming && (
                          <p>
                            <span className="font-semibold">Usage Timing:</span>{" "}
                            {
                              campaign.categoryDetails["Wellness & Supplements"]
                                .usageTiming
                            }
                          </p>
                        )}
                        {campaign.categoryDetails["Wellness & Supplements"]
                          .flavor && (
                          <p>
                            <span className="font-semibold">Flavor:</span>{" "}
                            {
                              campaign.categoryDetails["Wellness & Supplements"]
                                .flavor
                            }
                          </p>
                        )}
                        {campaign.categoryDetails["Wellness & Supplements"]
                          .dietaryTags.length > 0 && (
                          <p>
                            <span className="font-semibold">Dietary Tags:</span>{" "}
                            {campaign.categoryDetails[
                              "Wellness & Supplements"
                            ].dietaryTags.join(", ")}
                          </p>
                        )}
                        {!campaign.categoryDetails["Wellness & Supplements"]
                          .productType &&
                          campaign.categoryDetails["Wellness & Supplements"]
                            .targetFunction.length === 0 &&
                          !campaign.categoryDetails["Wellness & Supplements"]
                            .formType &&
                          !campaign.categoryDetails["Wellness & Supplements"]
                            .usageTiming &&
                          !campaign.categoryDetails["Wellness & Supplements"]
                            .flavor &&
                          campaign.categoryDetails["Wellness & Supplements"]
                            .dietaryTags.length === 0 && (
                            <p className="text-gray-400">
                              No Wellness & Supplements details provided.
                            </p>
                          )}
                      </div>
                    )}

                    {campaign.category === "Personal Care" && (
                      <div className="space-y-1">
                        {campaign.categoryDetails["Personal Care"]
                          .productType && (
                          <p>
                            <span className="font-semibold">Product Type:</span>{" "}
                            {
                              campaign.categoryDetails["Personal Care"]
                                .productType
                            }
                          </p>
                        )}
                        {campaign.categoryDetails["Personal Care"].skinBodyAreas
                          .length > 0 && (
                          <p>
                            <span className="font-semibold">
                              Skin/Body Areas:
                            </span>{" "}
                            {campaign.categoryDetails[
                              "Personal Care"
                            ].skinBodyAreas.join(", ")}
                          </p>
                        )}
                        {campaign.categoryDetails["Personal Care"]
                          .keyIngredients && (
                          <p>
                            <span className="font-semibold">
                              Key Ingredients:
                            </span>{" "}
                            {
                              campaign.categoryDetails["Personal Care"]
                                .keyIngredients
                            }
                          </p>
                        )}
                        {campaign.categoryDetails["Personal Care"]
                          .scentFlavor && (
                          <p>
                            <span className="font-semibold">
                              Scent / Flavor:
                            </span>{" "}
                            {
                              campaign.categoryDetails["Personal Care"]
                                .scentFlavor
                            }
                          </p>
                        )}
                        {campaign.categoryDetails["Personal Care"]
                          .textureForm && (
                          <p>
                            <span className="font-semibold">
                              Texture / Form:
                            </span>{" "}
                            {
                              campaign.categoryDetails["Personal Care"]
                                .textureForm
                            }
                          </p>
                        )}
                        {!campaign.categoryDetails["Personal Care"]
                          .productType &&
                          campaign.categoryDetails["Personal Care"]
                            .skinBodyAreas.length === 0 &&
                          !campaign.categoryDetails["Personal Care"]
                            .keyIngredients &&
                          !campaign.categoryDetails["Personal Care"]
                            .scentFlavor &&
                          !campaign.categoryDetails["Personal Care"]
                            .textureForm && (
                            <p className="text-gray-400">
                              No Personal Care details provided.
                            </p>
                          )}
                      </div>
                    )}
                  </div>

                  {/* Usage Rights Summary */}
                  {campaign.usageTerms.usageRights.length > 0 && (
                    <div className="bg-gray-800 p-4 rounded-lg mt-4">
                      <h4 className="font-semibold mb-2">Usage Rights</h4>
                      <p>
                        <span className="font-semibold">Usage Rights:</span>{" "}
                        {campaign.usageTerms.usageRights
                          .map((right) =>
                            right === "Other" &&
                            campaign.usageTerms.usageRightsOther
                              ? `Other: ${campaign.usageTerms.usageRightsOther}`
                              : right
                                  .replace(
                                    "Social Only (Instagram/TikTok feed, story)",
                                    "Social Only"
                                  )
                                  .replace(
                                    "Paid Ads (Meta/TikTok Spark Ads)",
                                    "Paid Ads"
                                  )
                                  .replace(
                                    "Website / Email Marketing",
                                    "Website/Email"
                                  )
                          )
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4 mt-6">
                    {/* <InputField
                      label={
                        <>
                          What influencers receive{" "}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      name="influencersReceive"
                      value={campaign.influencersReceive}
                      onChange={handleChange}
                      placeholder="e.g. Free product + $100 honorarium"
                    />

                    <InputField
                      label={
                        <>
                          Participation Requirements{" "}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      name="participationRequirements"
                      value={campaign.participationRequirements}
                      onChange={handleChange}
                      placeholder="e.g. Minimum 30-second video, tag us in story"
                      textarea
                    /> */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Application Deadline{" "}
                          <span className="text-red-500">*</span>
                          <span
                            className="ml-1 cursor-pointer"
                            title="Your campaign will be open for 7 days from admin approval."
                          >
                            ⓘ
                          </span>
                        </label>
                        <p class="text-sm text-blue-300">
                          Pending : Your campaign will be open for 7 days after
                          admin approval. (Exact date will appear here after
                          approval.)
                        </p>
                        <input
                          type="date"
                          value={campaign.deadline}
                          readOnly
                          className="hidden w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg border border-gray-700 cursor-not-allowed"
                          tabIndex={-1}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Recruitment End Date{" "}
                          <span className="text-red-500">*</span>
                          <span
                            className="ml-1 cursor-pointer"
                            title="You must select creators within 3 days after this date."
                          >
                            ⓘ
                          </span>
                        </label>
                        <p class="text-sm text-blue-300">
                          {" "}
                          You must select creators within 3 days after this
                          date.
                        </p>

                        <input
                          type="date"
                          value={campaign.recruitmentEndDate}
                          readOnly
                          className="hidden w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg border border-gray-700 cursor-not-allowed"
                          tabIndex={-1}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* FINAL BUTTONS */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-800 mt-6">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Save as Draft
                  </button>
                  <div className="space-x-4 flex ">
                    <button
                      type="button"
                      onClick={goToBack}
                      className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !validateStep4()}
                      className={`px-6 py-2 rounded-lg transition-colors flex items-center justify-center min-w-[120px] ${
                        loading || !validateStep4()
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-500 text-white"
                      }`}
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin inline-block mr-2">
                            ↻
                          </span>
                          Submitting…
                        </>
                      ) : (
                        "Submit for Review"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      {showSubmittedModal && (
        <CampaignSubmittedModal
          onClose={() => {
            setShowSubmittedModal(false);
            setShowModal(false); // close parent form modal
            onCampaignAdded?.();
          }}
        />
      )}
    </div>
  );
}
