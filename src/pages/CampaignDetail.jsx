import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAuthStore from "../state/atoms";
import { useNavigate } from "react-router-dom";
import config from "../config";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SubmitApplication from "../components/application/submitApplication";
import SuccessPopup from "../components/successPopup";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";
import { Accordion, AccordionGroup } from "../components/ui/Accordion";
import CopyButton from "../components/ui/CopyButton";
import {
  GiftIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  HashtagIcon,
  PhotoIcon,
  InformationCircleIcon,
  TagIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const CampaignDetail = () => {
  const [loading, setloading] = useState(true);
  const [campaign, setCampaign] = useState({});
  const Navigate = useNavigate();
  const { isLogin, User } = useAuthStore();
  const { campaignId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [instagramUrls, setInstagramUrls] = useState("");
  const [youtubeUrls, setYoutubeUrls] = useState("");
  const [tiktokUrls, setTiktokUrls] = useState("");
  const [allowReuse, setAllowReuse] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState(""); // "Approved", "Rejected", "Pending", ""
  const [appliedThisMonth, setAppliedThisMonth] = useState(0);
  const [campaignStatus, setCampaignStatus] = useState("Recruiting"); // or "Closed"
  const [bid, setBid] = useState("");
  const [bidError, setBidError] = useState("");

  const minFollowers = campaign?.min_required_followers;
  const creatorFollowers = User?.verified_follower_count;

  const isFollowerEligible =
    minFollowers == null ||
    (creatorFollowers != null && creatorFollowers >= minFollowers);

  const followerError =
    minFollowers != null &&
    (creatorFollowers == null || creatorFollowers < minFollowers)
      ? `You need at least ${minFollowers.toLocaleString()} verified followers to apply.`
      : null;

  useEffect(() => {
    if (appliedStatus === "Approved") {
      fetchSubmittedData();
    }
  }, [appliedStatus]);

  async function fetchSubmittedData() {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await axios.get(
        `${config.BACKEND_URL}/user/campaign-submission/${campaignId}`,
        {
          headers: {
            Authorization: token, // <-- THIS IS IMPORTANT
          },
        }
      );

      if (res.data.status === "success") {
        // setSubmittedUrls({
        //   instagram: res.data.data.instagram_urls,
        //   youtube: res.data.data.youtube_urls,
        //   tiktok: res.data.data.tiktok_urls,
        // });
      }
    } catch (err) {
      console.error(
        "Error fetching submitted content:",
        err.response?.data || err.message
      );
    }
  }

  const handleSubmitContent = async () => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    try {
      if (
        campaign?.campaignType === "paid" &&
        campaign?.pricingModel === "bidding"
      ) {
        const min = campaign.minBid || 1;
        const max = campaign.maxBid || 10000;
        const bidValue = Number(bid);
        if (isNaN(bidValue) || bidValue < min || bidValue > max) {
          setBidError(`Bid must be between $${min} and $${max}.`);
          return;
        }
        setBidError("");
      }

      const res = await axios.post(
        `${config.BACKEND_URL}/user/campaign-submission`,
        {
          campaign_id: campaignId,
          email: User.email,
          instagram_urls: instagramUrls.split(",").map((url) => url.trim()),
          youtube_urls: youtubeUrls.split(",").map((url) => url.trim()),
          tiktok_urls: tiktokUrls.split(",").map((url) => url.trim()),
          allow_brand_reuse: allowReuse,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert("Content submitted successfully!");

      // Show URLs after submit
      // setSubmittedUrls({
      //   instagram: instagramUrls.split(",").map((url) => url.trim()),
      //   youtube: youtubeUrls.split(",").map((url) => url.trim()),
      //   tiktok: tiktokUrls.split(",").map((url) => url.trim()),
      // });

      setShowSubmitModal(false); // close modal
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Something went wrong while submitting.");
    }
  };

  useEffect(() => {
    if (User?.email && campaignId) {
      getUserApplicationStatus();
    }
  }, [User, campaignId]);

  async function getUserApplicationStatus() {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const res = await axios.get(
        `${config.BACKEND_URL}/user/campaigns/appliedCampaigns`,
        {
          headers: {
            authorization: token,
          },
        }
      );

      if (res.data.status === "success") {
        setAppliedThisMonth(res.data.appliedThisMonth || 0);
        const found = res.data.campaigns.find(
          (c) => String(c.id) === String(campaignId)
        );
        if (found) {
          setAppliedStatus(found.applicationStatus);
        }
      }
    } catch (err) {
      console.error("Error fetching applied status:", err);
    }
  }

  useEffect(() => {
    getCampaign();
  }, [campaignId]);

  async function getCampaign() {
    try {
      const res = await axios.get(
        `${config.BACKEND_URL}/user/campaigns/${campaignId}/${User.email}`
      );
      if (res.data.status === "success") {
        console.log(res.data.campaign);
        const c = res.data.campaign;
        setCampaign(c);
        // setApplicantsCount(res.data.applicantsCount || 0);
        setCampaignStatus(res.data.campaignStatus || "Recruiting");
      }
    } catch {
      // error handling
    } finally {
      setloading(false);
    }
  }

  const handleOutsideClick = (e) => {
    if (e.target.id === "sidebar-overlay") {
      setIsOpen(false);
    }
  };

  let metaTags = [];

  if (campaign && !loading) {
    metaTags = [
      <meta name="robots" content="index, follow" key="robots" />,
      <meta
        property="og:title"
        content={campaign.campaignTitle || "N/A"}
        key="og-title"
      />,
      <meta
        property="og:description"
        content={campaign.productDescription || "N/A"}
        key="og-description"
      />,
    ];
  } else {
    metaTags = [
      <meta name="robots" content="noindex, nofollow" key="robots" />,
    ];
  }

  const categoryColors = {
    Beauty: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    Food: "bg-green-500/20 text-green-400 border-green-500/30",
    Beverage: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "Wellness & Supplements": "bg-teal-500/20 text-teal-300 border-teal-500/30",
    "Personal Care": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  return (
    <div className="min-h-[85vh] bg-black px-4 py-8">
      <Helmet>
        <title>{campaign.campaignTitle || "Campaign Details"}</title>
        {metaTags}
      </Helmet>
      {loading ? (
        <CampaignSkeleton />
      ) : (
        <div className="max-w-4xl mx-auto">
          <AccordionGroup>
            {/* 1️⃣ Campaign Overview - Always Open */}
            <Accordion title="Campaign Overview" alwaysOpen={true} icon="📋">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Campaign Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm FontNoto">Brand</p>
                    <div className="flex items-center gap-2">
                      {campaign.brandLogo && (
                        <img
                          src={campaign.brandLogo}
                          alt={campaign.brandName}
                          className="w-8 h-8 rounded-full object-cover border border-gray-600"
                        />
                      )}
                      <span className="text-white text-lg font-semibold FontNoto">
                        {campaign.brandName || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm FontNoto">Campaign</p>
                    <p className="text-white text-lg font-semibold FontNoto">
                      {campaign.campaignTitle || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm FontNoto">Product</p>
                    <p className="text-white text-lg font-semibold FontNoto">
                      {campaign.productName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm FontNoto">Category</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {campaign.category || "N/A"}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm FontNoto">Platform</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {campaign.contentFormat?.map((platform, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Key Details */}
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm FontNoto">Deadline</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <p className="text-white FontNoto">
                        {campaign.deadline
                          ? campaign.deadline.split("T")[0]
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {campaign.campaignType === "paid" ? (
                        <>
                          <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-semibold FontNoto">
                            Paid: $
                            {campaign.fixedPrice ||
                              `${campaign.minBid}-${campaign.maxBid}`}
                          </span>
                        </>
                      ) : (
                        <>
                          <GiftIcon className="w-5 h-5 text-yellow-400" />
                          <span className="text-yellow-400 font-semibold FontNoto">
                            Free Product
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm FontNoto">
                      Required Content
                    </p>
                    <p className="text-white FontNoto">
                      {campaign.requestedContent?.videos > 0 &&
                        `${campaign.requestedContent.videos} Video${
                          campaign.requestedContent.videos > 1 ? "s" : ""
                        }`}
                      {campaign.requestedContent?.videos > 0 &&
                        campaign.requestedContent?.photos > 0 &&
                        " + "}
                      {campaign.requestedContent?.photos > 0 &&
                        `${campaign.requestedContent.photos} Photo${
                          campaign.requestedContent.photos > 1 ? "s" : ""
                        }`}
                      {!campaign.requestedContent?.videos &&
                        !campaign.requestedContent?.photos &&
                        "1 Video Required"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm FontNoto">
                      Location Preference
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        {campaign.locationDisplay || "Global"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm FontNoto">Status</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        campaignStatus === "Closed"
                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : "bg-green-500/20 text-green-300 border border-green-500/30"
                      }`}
                    >
                      {campaignStatus}
                    </span>
                  </div>
                </div>
              </div>
            </Accordion>

            <div className="flex items-center gap-4 mb-6">
              {campaign.brandLogo && (
                <img
                  src={campaign.brandLogo}
                  alt={campaign.brandName}
                  className="w-12 h-12 rounded-full object-cover border border-gray-600"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white FontNoto">
                    {campaign.brandName}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      categoryColors[campaign.category] ||
                      "bg-gray-500/20 text-gray-300 border-gray-500/30"
                    }`}
                  >
                    {campaign.category}
                  </span>
                </div>
                <div className="text-lg text-white font-semibold FontNoto">
                  {campaign.campaignTitle}
                </div>
                <div className="text-gray-300 text-base FontNoto">
                  {campaign.productName}
                </div>
              </div>
            </div>

            <div className="flex gap-6 mb-6">
              {/* Main Image & Thumbnails */}
              <div>
                {campaign.productImages?.length > 0 && (
                  <>
                    <img
                      src={campaign.productImages[selectedImage]}
                      alt="Main Product"
                      className="w-48 h-48 object-cover rounded-lg cursor-pointer"
                      onClick={() => setShowLightbox(true)}
                    />
                    <div className="flex gap-2 mt-2">
                      {campaign.productImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className={`w-12 h-12 object-cover rounded cursor-pointer border ${
                            selectedImage === idx
                              ? "border-blue-400"
                              : "border-transparent"
                          }`}
                          onClick={() => setSelectedImage(idx)}
                        />
                      ))}
                    </div>
                  </>
                )}
                {/* Lightbox Modal */}
                {showLightbox && (
                  <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setShowLightbox(false)}
                  >
                    <img
                      src={campaign.productImages[selectedImage]}
                      alt="Enlarged"
                      className="max-w-full max-h-full rounded-lg"
                    />
                  </div>
                )}
              </div>
              {/* Product Highlights & Usage */}
              <div className="flex-1">
                <h3 className="text-white font-bold mb-2">
                  Product Highlights
                </h3>
                <ul className="list-disc ml-6 text-white">
                  {/* Beauty category */}
                  {campaign.category === "Beauty" && campaign.beautyDetails && (
                    <>
                      {campaign.beautyDetails.keyIngredients?.length > 0 && (
                        <li>
                          <b>Key Ingredients:</b>{" "}
                          {campaign.beautyDetails.keyIngredients.join(", ")}
                        </li>
                      )}
                      {campaign.beautyDetails.skinTypes?.length > 0 && (
                        <li>
                          <b>Skin Types:</b>{" "}
                          {campaign.beautyDetails.skinTypes.join(", ")}
                        </li>
                      )}
                      {campaign.beautyDetails.usageInstructions && (
                        <li>
                          <b>How to Use:</b>{" "}
                          {campaign.beautyDetails.usageInstructions}
                        </li>
                      )}
                      {campaign.beautyDetails.productType && (
                        <li>
                          <b>Product Type:</b>{" "}
                          {campaign.beautyDetails.productType}
                        </li>
                      )}
                      {campaign.beautyDetails.scent && (
                        <li>
                          <b>Scent:</b> {campaign.beautyDetails.scent}
                        </li>
                      )}
                      {campaign.beautyDetails.texture && (
                        <li>
                          <b>Texture:</b> {campaign.beautyDetails.texture}
                        </li>
                      )}
                      {campaign.beautyDetails.usageTiming && (
                        <li>
                          <b>Usage Timing:</b>{" "}
                          {campaign.beautyDetails.usageTiming}
                        </li>
                      )}
                    </>
                  )}
                  {/* Food category */}
                  {campaign.category === "Food" && campaign.foodDetails && (
                    <>
                      {campaign.foodDetails.preparationMethod && (
                        <li>
                          <b>Preparation Method:</b>{" "}
                          {campaign.foodDetails.preparationMethod}
                        </li>
                      )}
                      {campaign.foodDetails.dietaryTags?.length > 0 && (
                        <li>
                          <b>Dietary Tags:</b>{" "}
                          {campaign.foodDetails.dietaryTags.join(", ")}
                        </li>
                      )}
                      {campaign.foodDetails.eatingScene && (
                        <li>
                          <b>Eating Scene:</b>{" "}
                          {campaign.foodDetails.eatingScene}
                        </li>
                      )}
                    </>
                  )}
                  {/* Beverage category */}
                  {campaign.category === "Beverage" &&
                    campaign.beverageDetails && (
                      <>
                        {campaign.beverageDetails.servingType && (
                          <li>
                            <b>Serving Type:</b>{" "}
                            {campaign.beverageDetails.servingType}
                          </li>
                        )}
                        {campaign.beverageDetails.servingTemperature && (
                          <li>
                            <b>Serving Temperature:</b>{" "}
                            {campaign.beverageDetails.servingTemperature}
                          </li>
                        )}
                        {campaign.beverageDetails.caffeineContent && (
                          <li>
                            <b>Caffeine Content:</b>{" "}
                            {campaign.beverageDetails.caffeineContent}
                          </li>
                        )}
                        {campaign.beverageDetails.dietaryTags?.length > 0 && (
                          <li>
                            <b>Dietary Tags:</b>{" "}
                            {campaign.beverageDetails.dietaryTags.join(", ")}
                          </li>
                        )}
                      </>
                    )}
                  {/* Wellness & Supplements category */}
                  {campaign.category === "Wellness & Supplements" &&
                    campaign.wellnessDetails && (
                      <>
                        {campaign.wellnessDetails.productType && (
                          <li>
                            <b>Product Type:</b>{" "}
                            {campaign.wellnessDetails.productType}
                          </li>
                        )}
                        {campaign.wellnessDetails.targetFunctions?.length >
                          0 && (
                          <li>
                            <b>Target Functions:</b>{" "}
                            {campaign.wellnessDetails.targetFunctions.join(
                              ", "
                            )}
                          </li>
                        )}
                        {campaign.wellnessDetails.formType && (
                          <li>
                            <b>Form Type:</b>{" "}
                            {campaign.wellnessDetails.formType}
                          </li>
                        )}
                        {campaign.wellnessDetails.usageTiming && (
                          <li>
                            <b>Usage Timing:</b>{" "}
                            {campaign.wellnessDetails.usageTiming}
                          </li>
                        )}
                        {campaign.wellnessDetails.flavor && (
                          <li>
                            <b>Flavor:</b> {campaign.wellnessDetails.flavor}
                          </li>
                        )}
                        {campaign.wellnessDetails.dietaryTags?.length > 0 && (
                          <li>
                            <b>Dietary Tags:</b>{" "}
                            {campaign.wellnessDetails.dietaryTags.join(", ")}
                          </li>
                        )}
                      </>
                    )}
                  {/* Personal Care category */}
                  {campaign.category === "Personal Care" &&
                    campaign.personalCareDetails && (
                      <>
                        {campaign.personalCareDetails.productType && (
                          <li>
                            <b>Product Type:</b>{" "}
                            {campaign.personalCareDetails.productType}
                          </li>
                        )}
                        {campaign.personalCareDetails.useAreas?.length > 0 && (
                          <li>
                            <b>Use Areas:</b>{" "}
                            {campaign.personalCareDetails.useAreas.join(", ")}
                          </li>
                        )}
                        {campaign.personalCareDetails.keyIngredients?.length >
                          0 && (
                          <li>
                            <b>Key Ingredients:</b>{" "}
                            {campaign.personalCareDetails.keyIngredients.join(
                              ", "
                            )}
                          </li>
                        )}
                        {campaign.personalCareDetails.scent && (
                          <li>
                            <b>Scent:</b> {campaign.personalCareDetails.scent}
                          </li>
                        )}
                        {campaign.personalCareDetails.texture && (
                          <li>
                            <b>Texture:</b>{" "}
                            {campaign.personalCareDetails.texture}
                          </li>
                        )}
                        {campaign.personalCareDetails.usageInstructions && (
                          <li>
                            <b>How to Use:</b>{" "}
                            {campaign.personalCareDetails.usageInstructions}
                          </li>
                        )}
                      </>
                    )}
                  {/* Fallback: productDescription if no details */}
                  {!(
                    campaign.category &&
                    campaign[
                      `${campaign.category
                        .toLowerCase()
                        .replace(/ & | /g, "")}Details`
                    ]
                  ) &&
                    campaign.productDescription && (
                      <li>{campaign.productDescription}</li>
                    )}
                </ul>
              </div>
            </div>

            <Accordion title="Content Guidelines" alwaysOpen={true} icon="📝">
              <div className="space-y-6">
                {/* Hashtags */}
                {campaign.requiredHashtags?.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-400 text-sm FontNoto">
                        Required Hashtags
                      </p>
                      <CopyButton
                        text={campaign.requiredHashtags.join(" ")}
                        label="Copy All"
                        size="sm"
                        variant="secondary"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {campaign.requiredHashtags.map((hashtag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        >
                          <HashtagIcon className="w-3 h-3" />
                          {hashtag.replace("#", "")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Mention Handle */}
                {campaign.mentionHandle && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-400 text-sm FontNoto">@Mention</p>
                      <CopyButton
                        text={campaign.mentionHandle}
                        label="Copy"
                        size="sm"
                        variant="secondary"
                      />
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      @{campaign.mentionHandle?.replace("@", "")}
                    </span>
                  </div>
                )}
                {/* Tone Guide */}
                {campaign.toneGuide && (
                  <div>
                    <p className="text-gray-400 text-sm FontNoto mb-1">
                      Tone & Message Guide
                    </p>
                    <p className="text-white FontNoto">{campaign.toneGuide}</p>
                  </div>
                )}
                {/* Reference Content */}
                {campaign.referenceContent?.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-sm FontNoto mb-1">
                      Reference Content
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {campaign.referenceContent.map((ref, idx) =>
                        ref.match(/\.(jpeg|jpg|gif|png)$/) ? (
                          <img
                            key={idx}
                            src={ref}
                            alt="Reference"
                            className="w-16 h-16 object-cover rounded mr-2"
                          />
                        ) : (
                          <a
                            key={idx}
                            href={ref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline mr-2"
                          >
                            Reference Link
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Accordion>

            <Accordion
              title="View Product Details"
              icon={<TagIcon className="w-4 h-4" />}
            >
              <ul className="list-none ml-0 text-white">
                {campaign.beautyDetails?.productType && (
                  <li>
                    <b>Product Type:</b> {campaign.beautyDetails.productType}
                  </li>
                )}
                {campaign.beautyDetails?.skinTypes?.length > 0 && (
                  <li>
                    <b>Skin Type:</b>{" "}
                    {campaign.beautyDetails.skinTypes.join(", ")}
                  </li>
                )}
                {campaign.beautyDetails?.keyIngredients?.length > 0 && (
                  <li>
                    <b>Key Ingredients:</b>{" "}
                    {campaign.beautyDetails.keyIngredients.join(", ")}
                  </li>
                )}
                {campaign.beautyDetails?.usageInstructions && (
                  <li>
                    <b>Usage:</b> {campaign.beautyDetails.usageInstructions}
                  </li>
                )}
                {/* Repeat for other fields and categories as needed */}
              </ul>
            </Accordion>
          </AccordionGroup>

          {/*  Apply Now CTA - Fixed at bottom */}
          <div className="sticky bottom-6 mt-8 z-10">
            <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              {appliedStatus === "Approved" && (
                <Link to={`/AddPostUrl/${campaignId}`} className="block mb-4">
                  <button className="w-full bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition-colors">
                    Submit Content
                  </button>
                </Link>
              )}

              <button
                onClick={() => {
                  if (!isLogin) {
                    Navigate("/signin");
                    return;
                  }
                  setIsOpen(true);
                }}
                disabled={
                  !!appliedStatus ||
                  campaignStatus === "Closed" ||
                  appliedThisMonth >= 5
                }
                className={`w-full flex justify-center items-center font-semibold py-3 px-8 rounded-full transition-all duration-300 transform FontNoto
                  ${
                    appliedStatus === "Approved"
                      ? "bg-green-600 text-white cursor-default"
                      : appliedStatus === "Rejected"
                      ? "bg-red-600 text-white cursor-default"
                      : appliedStatus === "Pending"
                      ? "bg-yellow-400 text-black cursor-default"
                      : "text-black bg-[#facc15] hover:bg-[#ffb703] hover:scale-105 hover:shadow-lg"
                  } shadow-md`}
              >
                {appliedStatus === "Approved"
                  ? " Approved"
                  : appliedStatus === "Rejected"
                  ? "❌ Rejected"
                  : appliedStatus === "Pending"
                  ? "⏳ Pending"
                  : campaignStatus === "Closed"
                  ? "Campaign Closed"
                  : appliedThisMonth >= 5
                  ? "Limit Reached"
                  : " Apply to Campaign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000]">
          <div className="bg-[#1e1e1e] p-6 rounded-lg max-w-[500px] w-full shadow-xl">
            <h3 className="text-white text-xl font-semibold mb-4">
              Submit Your Content
            </h3>

            {!isFollowerEligible && (
              <div className="text-red-500 font-semibold mb-4">
                {followerError}
              </div>
            )}

            <label className="text-white block mb-1">
              Instagram URLs (comma-separated)
            </label>
            <input
              type="text"
              className="w-full p-2 mb-3 rounded bg-black/40 text-white border border-gray-500"
              value={instagramUrls}
              onChange={(e) => setInstagramUrls(e.target.value)}
            />

            <label className="text-white block mb-1">
              YouTube URLs (comma-separated)
            </label>
            <input
              type="text"
              className="w-full p-2 mb-3 rounded bg-black/40 text-white border border-gray-500"
              value={youtubeUrls}
              onChange={(e) => setYoutubeUrls(e.target.value)}
            />

            <label className="text-white block mb-1">
              TikTok URLs (comma-separated)
            </label>
            <input
              type="text"
              className="w-full p-2 mb-3 rounded bg-black/40 text-white border border-gray-500"
              value={tiktokUrls}
              onChange={(e) => setTiktokUrls(e.target.value)}
            />

            <label className="text-white flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={allowReuse}
                onChange={(e) => setAllowReuse(e.target.checked)}
              />
              I authorize the brand to reuse my submitted content.
            </label>

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

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-white px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitContent}
                className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {isOpen && (
        <div
          id="sidebar-overlay"
          className="fixed inset-0 bg-[#0000008a] bg-opacity-50 z-9999"
          onClick={handleOutsideClick}
        ></div>
      )}
      <SubmitApplication
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        campaignId={campaignId}
        setSuccess={setSuccess}
        campaign={campaign}
      ></SubmitApplication>
      <SuccessPopup
        show={success}
        onClose={() => {
          setAppliedStatus("Pending");
          setCampaign((prev) => ({ ...prev, applied: true }));
          setSuccess(false);
        }}
      ></SuccessPopup>
    </div>
  );
};

const CampaignSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="space-y-4">
        {/* Campaign Overview Skeleton */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              <div className="h-6 bg-gray-300 rounded w-2/3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              <div className="h-6 bg-gray-300 rounded w-2/3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        {/* Content Guidelines Skeleton */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-300 rounded-full w-20"></div>
              <div className="h-8 bg-gray-300 rounded-full w-24"></div>
              <div className="h-8 bg-gray-300 rounded-full w-16"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>

        {/* Additional Accordion Skeletons */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>

        {/* Apply Button Skeleton */}
        <div className="sticky bottom-6 mt-8">
          <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
            <div className="h-12 bg-gray-300 rounded-full w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
