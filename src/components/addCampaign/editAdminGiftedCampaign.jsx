// src/components/admin/EditCampaignWizard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import config from "../../config";

import { InputField } from "./InputField";
import { FileUpload } from "./FileUpload";
import { HashtagsInput } from "./HashtagsInput";
import { SuccessMessage } from "../SuccessMessage";
import UnifiedLocationSelector from "../brand/addCampaign/UnifiedLocationSelector";
import { LoaderCircle } from "lucide-react";
import { useCompaign } from "../../state/atoms";

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

export default function EditCampaignWizard({
  setShowModal,
  campaignData,
  index,
}) {
  const { Campaigns, EditCampaign } = useCompaign();
  const campaignId = campaignData?._id;
  console.log("[EditCampaignWizard] campaignId:", campaignData);

  // ───────────────────────────────────────────────
  // STATE: a single "campaign" object containing ALL fields
  // ───────────────────────────────────────────────────
  const [campaign, setCampaign] = useState({
    // Step 1: Campaign Info
    campaignTitle: campaignData?.campaignTitle || "",
    category: campaignData?.campaignIndustry || "",
    brandName: campaignData?.brandName || "",
    productName: campaignData?.productName || "",
    productDescription: campaignData?.productDescription || "",
    brandLogo: campaignData?.brandLogo || null, // can be either a File or a URL‐string
    productImages: campaignData?.productImages || [], // array of File or URL‐string
    numCreators: campaignData?.creatorCount || campaignData?.recruiting || "", // "10" / "15" / "20"

    // Step 2: Content Guidelines
    contentPlatform: campaignData?.contentFormat || [],
    requiredHashtags: campaignData?.requiredHashtags || [], // [ "#skincare", "#glow" ]
    mentionHandle: campaignData?.mentionHandle || "", // "@matchably.official"
    toneMessage: campaignData?.toneMessage || "", // optional
    referenceContent: campaignData?.referenceContent || "", // optional URL
    referenceFile: campaignData?.referenceFile || null, // optional File

    // Step 3: Category‐Specific (all optional)
    categoryDetails: {
      Beauty: {
        productType: campaignData?.categoryDetails?.Beauty?.productType || "",
        skinTypes: campaignData?.categoryDetails?.Beauty?.skinTypes || [],
        keyIngredients:
          campaignData?.categoryDetails?.Beauty?.keyIngredients || "",
        howToUse: campaignData?.categoryDetails?.Beauty?.howToUse || "",
      },
      Food: {
        preparationMethod:
          campaignData?.categoryDetails?.Food?.preparationMethod || "",
        dietaryTags: campaignData?.categoryDetails?.Food?.dietaryTags || [],
        eatingScene: campaignData?.categoryDetails?.Food?.eatingScene || "",
      },
      Beverage: {
        servingType: campaignData?.categoryDetails?.Beverage?.servingType || "",
        servingTemperature:
          campaignData?.categoryDetails?.Beverage?.servingTemperature || "",
        caffeineContent:
          campaignData?.categoryDetails?.Beverage?.caffeineContent || "",
        dietaryTags: campaignData?.categoryDetails?.Beverage?.dietaryTags || [],
      },
      "Wellness & Supplements": {
        productType:
          campaignData?.categoryDetails?.["Wellness & Supplements"]
            ?.productType || "",
        targetFunction:
          campaignData?.categoryDetails?.["Wellness & Supplements"]
            ?.targetFunction || [],
        formType:
          campaignData?.categoryDetails?.["Wellness & Supplements"]?.formType ||
          "",
        usageTiming:
          campaignData?.categoryDetails?.["Wellness & Supplements"]
            ?.usageTiming || "",
        flavor:
          campaignData?.categoryDetails?.["Wellness & Supplements"]?.flavor ||
          "",
        dietaryTags:
          campaignData?.categoryDetails?.["Wellness & Supplements"]
            ?.dietaryTags || [],
      },
      "Personal Care": {
        productType:
          campaignData?.categoryDetails?.["Personal Care"]?.productType || "",
        skinBodyAreas:
          campaignData?.categoryDetails?.["Personal Care"]?.skinBodyAreas || [],
        keyIngredients:
          campaignData?.categoryDetails?.["Personal Care"]?.keyIngredients ||
          "",
        scentFlavor:
          campaignData?.categoryDetails?.["Personal Care"]?.scentFlavor || "",
        textureForm:
          campaignData?.categoryDetails?.["Personal Care"]?.textureForm || "",
      },
    },

    // Step 4: final status
    status: campaignData?.status || "Active", // "Active" / "Draft" / "Completed"

    // Location Filter
    locationFilter: {
      locations: campaignData?.locationFilter?.locations || [],
      isGlobal:
        campaignData?.locationFilter?.isGlobal ??
        campaignData?.locationFilter?.locations?.length === 0,
    },
  });

  // ───────────────────────────────────────────────────
  // STEP CONTROL + UI STATE
  // ───────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    brandLogo: 0,
    productImages: 0,
    referenceFile: 0,
  });
  const [imagePreviews, setImagePreviews] = useState({
    brandLogo: null, // Data URL if user picks a new file; otherwise URL‐string
    productImages: [], // array of Data URLs or URL‐strings
    referenceFile: null, // Data URL if user picks a new reference image/file
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // ───────────────────────────────────────────────────
  // PRE‐FILL FORM: When the component mounts or Campaigns change,
  // copy the existing campaign→ local state so the user can edit it.
  // ───────────────────────────────────────────────────
  useEffect(() => {
    console.log("[EditCampaignWizard] campaignId:", campaignId);
    console.log("[EditCampaignWizard] Campaigns array:", Campaigns);

    const selected = campaignData;
    if (!selected) return;
    console.log("[EditCampaignWizard] selected object:", selected);
    // Populate the full campaign state, including step 4 fields
    setCampaign({
      // Step 1: Campaign Info
      campaignTitle: selected.campaignTitle || "",
      category: selected.campaignIndustry || "",
      brandName: selected.brandName || "",
      productName: selected.productName || "",
      productDescription: selected.productDescription || "",
      // For files, keep URL strings; new File uploads handled in handlers
      brandLogo: selected.brandLogo || null,
      productImages: Array.isArray(selected.productImages)
        ? selected.productImages
        : [],
      numCreators:
        selected.numCreators != null ? String(selected.numCreators) : "", // ensure it's a string

      // Step 2: Content Guidelines
      contentPlatform: Array.isArray(selected.contentPlatform)
        ? selected.contentPlatform
        : [],
      requiredHashtags: Array.isArray(selected.requiredHashtags)
        ? selected.requiredHashtags
        : [],
      mentionHandle: selected.mentionHandle || "",
      toneMessage: selected.toneMessage || "",
      referenceContent: selected.referenceContent || "",
      referenceFile: selected.referenceFile || null, // we only have URL, treat as preview

      // Step 3: Category-Specific Details
      categoryDetails: selected.categoryDetails
        ? { ...selected.categoryDetails }
        : {
            Beauty: {
              productType: "",
              skinTypes: [],
              keyIngredients: "",
              howToUse: "",
            },
            Food: { preparationMethod: "", dietaryTags: [], eatingScene: "" },
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

      // Step 4: Review & Submit fields
      influencersReceive: selected.influencersReceive || "",
      participationRequirements: selected.participationRequirements || "",
      deadline: selected.deadline ? selected.deadline.slice(0, 10) : "",
      recruitmentEndDate: selected.recruitmentEndDate
        ? selected.recruitmentEndDate.slice(0, 10)
        : "",

      // Final status
      status: selected.status || "Active",

      // Location Filter - load existing data
      locationFilter: {
        locations: selected.locationFilter?.locations || [],
        isGlobal:
          selected.locationFilter?.isGlobal ??
          selected.locationFilter?.locations?.length === 0,
      },
    });

    console.log(
      "[EditCampaignWizard] ddd campaign state after pre-fill:",
      selected
    );
    // Set up previews (URLs or Data URLs)
    setImagePreviews({
      brandLogo: selected.brandLogo || null,
      productImages: Array.isArray(selected.productImages)
        ? selected.productImages
        : [],
      referenceFile: selected.referenceFile || null,
    });
  }, [campaignData, campaignId]);

  // ───────────────────────────────────────────────────
  // Add a useEffect to set deadlines automatically when entering Step 4 if not already set
  useEffect(() => {
    if (step === 4) {
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
  }, [step]);

  // ───────────────────────────────────────────────────
  // HANDLERS FOR "CHANGE" EVENTS
  // ───────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert numeric fields if needed
    const numberFields = ["numCreators"];
    setCampaign((prev) => ({
      ...prev,
      [name]: numberFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleHashtagsChange = (e) => {
    const raw = e.target.value;
    const arr = raw
      .split(" ")
      .filter((tag) => tag.startsWith("#") && tag.length > 1);
    setCampaign((prev) => ({
      ...prev,
      requiredHashtags: arr,
    }));
  };

  // ───────────────────────────────────────────────────
  // IMAGE UPLOAD (Brand Logo, Product Images, Reference File)
  // Previews show a forced 1:1 thumbnail via CSS
  // ───────────────────────────────────────────────────
  const handleBrandLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCampaign((prev) => ({
      ...prev,
      brandLogo: file,
    }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev) => ({
        ...prev,
        brandLogo: reader.result,
      }));
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

  const removeBrandLogo = () => {
    setCampaign((prev) => ({ ...prev, brandLogo: null }));
    setImagePreviews((prev) => ({ ...prev, brandLogo: null }));
    setUploadProgress((prev) => ({ ...prev, brandLogo: 0 }));
  };

  const removeProductImage = (i) => {
    setCampaign((prev) => {
      const arr = [...prev.productImages];
      arr.splice(i, 1);
      return { ...prev, productImages: arr };
    });
    setImagePreviews((prev) => {
      const arr = [...prev.productImages];
      arr.splice(i, 1);
      return { ...prev, productImages: arr };
    });
  };

  const removeReferenceFile = () => {
    setCampaign((prev) => ({ ...prev, referenceFile: null }));
    setImagePreviews((prev) => ({ ...prev, referenceFile: null }));
    setUploadProgress((prev) => ({ ...prev, referenceFile: 0 }));
  };

  // ───────────────────────────────────────────────────
  // CATEGORY‐SPECIFIC FIELD HANDLER (Step 3)
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
  // VALIDATION FOR "Next" BUTTON
  // (Step 1 and Step 2 must be fully filled; Step 3 is optional)
  // ───────────────────────────────────────────────────
  const validateStep1 = () => {
    return (
      campaign.campaignTitle.trim() !== "" &&
      campaign.category.trim() !== "" &&
      campaign.brandName.trim() !== "" &&
      campaign.productName.trim() !== "" &&
      campaign.productDescription.trim() !== "" &&
      campaign.numCreators !== ""
    );
  };

  const validateStep2 = () => {
    return (
      campaign.contentPlatform.length > 0 &&
      campaign.requiredHashtags.length > 0 &&
      campaign.mentionHandle.trim() !== ""
    );
  };

  const validateStep3 = () => {
    // Everything in Step 3 is optional → always returns true
    return true;
  };

  // ───────────────────────────────────────────────────
  // STEP NAVIGATION HANDLERS
  // ───────────────────────────────────────────────────
  const goToNext = () => setStep((prev) => prev + 1);
  const goToBack = () => setStep((prev) => prev - 1);

  const handleSaveDraft = () => {
    // You could implement a "save draft" API here; for now, just show a success banner.
    toast.info("Draft saved locally.", { theme: "dark", autoClose: 1000 });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1000);
  };

  // ───────────────────────────────────────────────────
  // UPLOAD UTILITY: Upload a single File,
  // return the resulting URL string.
  // ───────────────────────────────────────────────────
  const uploadFile = async (file, key) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const resp = await axios.post(`${config.BACKEND_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setUploadProgress((prev) => ({ ...prev, [key]: pct }));
        },
      });
      if (resp.data.imageUrl) return resp.data.imageUrl;
      throw new Error("Upload failed");
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
    }
  };

  // ───────────────────────────────────────────────────
  // FINAL SUBMIT: Put everything to your "editCampaign" endpoint
  // ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Handle brand logo upload
      let brandLogoUrl = campaign.brandLogo;
      if (campaign.brandLogo && typeof campaign.brandLogo !== "string") {
        brandLogoUrl = await handleUpload(campaign.brandLogo);
      }

      // Handle product image uploads
      let productImageUrls = [];
      for (const image of campaign.productImages || []) {
        if (typeof image === "string") {
          productImageUrls.push(image); // already uploaded
        } else {
          const url = await handleUpload(image);
          productImageUrls.push(url);
        }
      }

      // Prepare payload
      const formPayload = {
        campaignTitle: campaign.campaignTitle,
        brandName: campaign.brandName,
        productDescription: campaign.productDescription,
        contentFormat: campaign.contentFormat,
        requiredHashtags: campaign.requiredHashtags,
        recruiting: campaign.recruiting,
        influencersReceive: campaign.influencersReceive,
        campaignIndustry: campaign.campaignIndustry,
        deadline: campaign.deadline,
        recruitmentEndDate: campaign.recruitmentEndDate, // new
        status: campaign.status, // new
        participationRequirements: campaign.participationRequirements,
        brandLogo: brandLogoUrl,
        productImages: productImageUrls,
        creatorCount: campaign.creatorCount || campaign.numCreators, // ensure it's a string

        // Location Filter
        locationFilter: {
          locations: campaign.locationFilter.locations,
          isGlobal: campaign.locationFilter.isGlobal,
        },
      };

      const token = Cookie.get("AdminToken");
      const response = await axios.post(
        `${config.BACKEND_URL}/admin/campaigns/editCampaign/${campaignData.id}`,
        { campaign: formPayload },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data.status === "success") {
        await EditCampaign(index, formPayload);
        toast.success("Campaign updated successfully", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          setShowModal(false);
        }, 500);
      } else {
        setError(response.data.message || "Failed to update campaign");
      }
    } catch (error) {
      console.error("Error submitting campaign:", error);
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────────────────────────────
  // RENDER: Modal with four steps
  // ───────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="p-6">
          {/* HEADER */}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Edit Campaign</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {success && (
            <SuccessMessage
              message="Campaign updated!"
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
            {/* STEP 1: Campaign Info */}
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
                            checked={campaign.numCreators === opt.value}
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
                        // Placeholder for "Load from Previous Campaign"
                        toast.info(
                          "Load from Previous Campaign not implemented",
                          {
                            theme: "dark",
                          }
                        );
                      }}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Load from Previous Campaign
                    </button>
                  </div>
                </div>

                {/* BUTTONS */}
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
                            checked={campaign.contentPlatform.includes(plat)}
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
                    inputValue={campaign.requiredHashtags.join(" ")}
                    hashtags={campaign.requiredHashtags}
                    onChange={handleHashtagsChange}
                    required
                  />

                  {/* Location Filter */}
                  <div className="mt-6 p-4 border border-gray-700 rounded-lg">
                    <UnifiedLocationSelector
                      selectedLocations={campaign.locationFilter}
                      onChange={(newLocationFilter) =>
                        setCampaign((prev) => ({
                          ...prev,
                          locationFilter: newLocationFilter,
                        }))
                      }
                    />
                  </div>

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
            {/* STEP 3: Input Category‐Specific Details */}
            {/* ──────────────────────────────────────────────── */}
            {step === 3 && (
              <div>
                <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2 mb-4">
                  Step 3: Input Category‐Specific Details
                </h3>

                {campaign.category === "Beauty" && (
                  <div className="space-y-4">
                    <InputField
                      label="Product Type (Optional)"
                      name="beauty_productType"
                      value={campaign.categoryDetails.Beauty.productType}
                      onChange={(e) =>
                        handleCategoryDetailChange(
                          "Beauty",
                          "productType",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Ampoule, Serum, Cream…"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Skin Type (Optional)
                      </label>
                      <div className="flex flex-wrap gap-2">
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
                                const already =
                                  campaign.categoryDetails.Beauty.skinTypes.includes(
                                    stype
                                  );
                                const updated = already
                                  ? campaign.categoryDetails.Beauty.skinTypes.filter(
                                      (x) => x !== stype
                                    )
                                  : [
                                      ...campaign.categoryDetails.Beauty
                                        .skinTypes,
                                      stype,
                                    ];
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
                    </div>

                    <InputField
                      label="Key Ingredients (Optional)"
                      name="beauty_keyIngredients"
                      value={campaign.categoryDetails.Beauty.keyIngredients}
                      onChange={(e) =>
                        handleCategoryDetailChange(
                          "Beauty",
                          "keyIngredients",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Niacinamide, CICA, Hyaluronic Acid…"
                    />

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
                    <InputField
                      label="Preparation Method (Optional)"
                      name="food_preparationMethod"
                      value={campaign.categoryDetails.Food.preparationMethod}
                      onChange={(e) =>
                        handleCategoryDetailChange(
                          "Food",
                          "preparationMethod",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Ready‐to‐Eat, Requires Cooking…"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Dietary Tag (Optional)
                      </label>
                      <div className="flex flex-wrap gap-2">
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
                                const already = arr.includes(tag);
                                const updated = already
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
                    </div>

                    <InputField
                      label="Eating Scene (Optional)"
                      name="food_eatingScene"
                      value={campaign.categoryDetails.Food.eatingScene}
                      onChange={(e) =>
                        handleCategoryDetailChange(
                          "Food",
                          "eatingScene",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Family Dinner, Picnic…"
                    />
                  </div>
                )}

                {campaign.category === "Beverage" && (
                  <div className="space-y-4">
                    <InputField
                      label="Serving Type (Optional)"
                      name="beverage_servingType"
                      value={campaign.categoryDetails.Beverage.servingType}
                      onChange={(e) =>
                        handleCategoryDetailChange(
                          "Beverage",
                          "servingType",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Bottle, Powder Mix…"
                    />

                    <InputField
                      label="Serving Temperature (Optional)"
                      name="beverage_servingTemperature"
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
                      placeholder="e.g. Chilled, Room Temperature…"
                    />

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

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Dietary Tag (Optional)
                      </label>
                      <div className="flex flex-wrap gap-2">
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
                                const already = arr.includes(tag);
                                const updated = already
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
                    </div>
                  </div>
                )}

                {campaign.category === "Wellness & Supplements" && (
                  <div className="space-y-4">
                    <InputField
                      label="Product Type (Optional)"
                      name="wellness_productType"
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
                      placeholder="e.g. Vitamins, Collagen Jelly…"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Target Function (Optional)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Immune Boost",
                          "Sleep",
                          "Digestive Health",
                          "Energy",
                          "Other",
                        ].map((f) => (
                          <label
                            key={f}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-md"
                          >
                            <input
                              type="checkbox"
                              checked={campaign.categoryDetails[
                                "Wellness & Supplements"
                              ].targetFunction.includes(f)}
                              onChange={() => {
                                const arr =
                                  campaign.categoryDetails[
                                    "Wellness & Supplements"
                                  ].targetFunction;
                                const already = arr.includes(f);
                                const updated = already
                                  ? arr.filter((x) => x !== f)
                                  : [...arr, f];
                                handleCategoryDetailChange(
                                  "Wellness & Supplements",
                                  "targetFunction",
                                  updated
                                );
                              }}
                              className="h-4 w-4 text-blue-500 border-gray-600 focus:ring-blue-400"
                            />
                            <span className="text-gray-200">{f}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <InputField
                      label="Form Type (Optional)"
                      name="wellness_formType"
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
                      placeholder="e.g. Tablet, Powder, Liquid…"
                    />

                    <InputField
                      label="Usage Timing (Optional)"
                      name="wellness_usageTiming"
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
                      placeholder="e.g. Morning, Evening…"
                    />

                    <InputField
                      label="Flavor (Optional)"
                      name="wellness_flavor"
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
                      placeholder="e.g. Strawberry, Lemon…"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Dietary Tag (Optional)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["Vegan", "Gluten-Free", "Sugar-Free", "Other"].map(
                          (tag) => (
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
                                  const already = arr.includes(tag);
                                  const updated = already
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
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {campaign.category === "Personal Care" && (
                  <div className="space-y-4">
                    <InputField
                      label="Product Type (Optional)"
                      name="personal_productType"
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
                      placeholder="e.g. Body Wash, Deodorant…"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Skin/Body Area (Optional)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Full Body",
                          "Hands",
                          "Oral",
                          "Underarms",
                          "Face",
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
                                const already = arr.includes(area);
                                const updated = already
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
                    </div>

                    <InputField
                      label="Key Ingredients (Optional)"
                      name="personal_keyIngredients"
                      value={
                        campaign.categoryDetails["Personal Care"].keyIngredients
                      }
                      onChange={(e) =>
                        handleCategoryDetailChange(
                          "Personal Care",
                          "keyIngredients",
                          e.target.value
                        )
                      }
                      placeholder="e.g. Aloe, Mint, Centella…"
                    />

                    <InputField
                      label="Scent / Flavor (Optional)"
                      name="personal_scentFlavor"
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
                      placeholder="e.g. Lavender, Unscented…"
                    />

                    <InputField
                      label="Texture / Form (Optional)"
                      name="personal_textureForm"
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
                      placeholder="e.g. Gel, Cream, Foam…"
                    />
                  </div>
                )}

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
                  {/* REVIEW: Step 1 */}
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
                      {campaign.numCreators} ({" "}
                      {
                        CREATOR_OPTIONS.find(
                          (opt) => opt.value === Number(campaign.numCreators)
                        )?.applicantsToShow
                      }{" "}
                      applicants shown )
                    </p>
                  </div>

                  {/* REVIEW: Step 2 */}
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

                  {/* REVIEW: Step 3 */}
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">
                        Category‐Specific Details
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
                    <select
                      value={campaign.status}
                      onChange={(e) =>
                        setCampaign((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="bg-gray-900 border border-gray-600 px-3 py-2 rounded-lg text-white w-full"
                    >
                      <option value="Active">🟢 Active</option>
                      <option value="Inactive">🔴 Inactive</option>
                    </select>
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
                  <div className="space-x-4 flex">
                    <button
                      type="button"
                      onClick={goToBack}
                      className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-2 rounded-lg transition-colors flex items-center justify-center min-w-[120px] ${
                        loading
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-500 text-white"
                      }`}
                    >
                      {loading ? (
                        <>
                          <LoaderCircle
                            className="animate-spin text-gray-200"
                            size={20}
                          />
                          Updating…
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
    </div>
  );
}
