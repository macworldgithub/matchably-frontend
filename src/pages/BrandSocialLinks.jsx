import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaTiktok } from "react-icons/fa";

export default function BrandSocialLinks() {
  const navigate = useNavigate();
  const [urls, setUrls] = useState(["", "", ""]);
  const [showPopup, setShowPopup] = useState(true);

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value.trim();
    setUrls(newUrls);
  };

  const getPlatform = (url) => {
    if (url.includes("instagram.com")) return "instagram";
    if (url.includes("tiktok.com")) return "tiktok";
    return null;
  };

  const isValidUrl = (url) => {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const allValid = urls.every((u) => isValidUrl(u));

  const handleSubmitUrls = () => {
    console.log("Submitted URLs:", urls);
    setShowPopup(false);

    // Optionally send to backend
    // fetch(`${config.BACKEND_URL}/brand/social-links`, {...})

    // Then go to dashboard
    setTimeout(() => navigate("/brand/dashboard"), 500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-[#1f1f1f] p-8 rounded-2xl w-full max-w-lg shadow-xl relative"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 15 }}
            >
              <h3 className="text-2xl font-semibold text-white text-center mb-6">
                Add Your Social Media URLs
              </h3>

              <div className="space-y-4">
                {urls.map((url, i) => {
                  const platform = getPlatform(url);
                  return (
                    <div key={i} className="relative">
                      <input
                        type="url"
                        placeholder={`Paste URL ${i + 1}`}
                        value={url}
                        onChange={(e) => handleUrlChange(i, e.target.value)}
                        className="w-full px-4 py-2 pr-10 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      {platform && (
                        <span className="absolute right-3 top-2.5 text-xl text-indigo-400">
                          {platform === "instagram" ? (
                            <FaInstagram />
                          ) : (
                            <FaTiktok />
                          )}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleSubmitUrls}
                disabled={!allValid}
                className={`mt-6 w-full py-2 rounded-lg font-medium transition ${
                  allValid
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
