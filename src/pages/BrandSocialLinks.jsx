// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaInstagram, FaTiktok } from "react-icons/fa";

// export default function BrandSocialLinks() {
//   const navigate = useNavigate();
//   const [urls, setUrls] = useState(["", "", ""]);
//   const [showPopup, setShowPopup] = useState(true);

//   const handleUrlChange = (index, value) => {
//     const newUrls = [...urls];
//     newUrls[index] = value.trim();
//     setUrls(newUrls);
//   };

//   const getPlatform = (url) => {
//     if (url.includes("instagram.com")) return "instagram";
//     if (url.includes("tiktok.com")) return "tiktok";
//     return null;
//   };

//   const isValidUrl = (url) => {
//     try {
//       const parsed = new URL(url);
//       return ["http:", "https:"].includes(parsed.protocol);
//     } catch {
//       return false;
//     }
//   };

//   const allValid = urls.every((u) => isValidUrl(u));

//   const handleSubmitUrls = () => {
//     console.log("Submitted URLs:", urls);
//     setShowPopup(false);

//     // Optionally send to backend
//     // fetch(`${config.BACKEND_URL}/brand/social-links`, {...})

//     // Then go to dashboard
//     setTimeout(() => navigate("/brand/dashboard"), 500);
//   };

//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center text-white">
//       <AnimatePresence>
//         {showPopup && (
//           <motion.div
//             className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <motion.div
//               className="bg-[#1f1f1f] p-8 rounded-2xl w-full max-w-lg shadow-xl relative"
//               initial={{ y: 80, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               exit={{ y: 80, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 90, damping: 15 }}
//             >
//               <h3 className="text-2xl font-semibold text-white text-center mb-6">
//                 Add Your Social Media URLs
//               </h3>

//               <div className="space-y-4">
//                 {urls.map((url, i) => {
//                   const platform = getPlatform(url);
//                   return (
//                     <div key={i} className="relative">
//                       <input
//                         type="url"
//                         placeholder={`Paste URL ${i + 1}`}
//                         value={url}
//                         onChange={(e) => handleUrlChange(i, e.target.value)}
//                         className="w-full px-4 py-2 pr-10 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                       />
//                       {platform && (
//                         <span className="absolute right-3 top-2.5 text-xl text-indigo-400">
//                           {platform === "instagram" ? (
//                             <FaInstagram />
//                           ) : (
//                             <FaTiktok />
//                           )}
//                         </span>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>

//               <button
//                 onClick={handleSubmitUrls}
//                 disabled={!allValid}
//                 className={`mt-6 w-full py-2 rounded-lg font-medium transition ${
//                   allValid
//                     ? "bg-indigo-600 hover:bg-indigo-700 text-white"
//                     : "bg-gray-700 text-gray-400 cursor-not-allowed"
//                 }`}
//               >
//                 OK
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Music2, CheckCircle } from "lucide-react";

export default function BrandSocialLinks() {
  const navigate = useNavigate();
  const [urls, setUrls] = useState(["", "", ""]);
  const [showPopup, setShowPopup] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value.trim();
    setUrls(newUrls);
  };

  const getPlatform = (url) => {
    if (url.includes("instagram.com")) return "instagram";
    if (url.includes("tiktok.com")) return "tiktok";
    return null;
  };

  const urlRegex =
    /^(https?:\/\/)?(www\.)?(tiktok\.com|instagram\.com)\/[^\s/$.?#].[^\s]*$/i;

  const isValid = urls.every((u) => urlRegex.test(u));

  const handleSubmitUrls = () => {
    setLoading(true);
    console.log("Submitted URLs:", urls);

    // Optionally send to backend here
    // fetch(`${config.BACKEND_URL}/brand/social-links`, {...})

    setTimeout(() => {
      setLoading(false);
      setShowPopup(false);
      navigate("/brand/dashboard");
    }, 800);
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
              {/* Step 1: Submit URLs */}
              <h2 className="text-center text-2xl font-bold text-white mb-4">
                Submit Your Content
              </h2>
              <p className="text-gray-300 text-sm mb-6 text-center leading-relaxed">
                Please submit 3 TikTok/Instagram content URLs.
              </p>

              <div className="space-y-4">
                {urls.map((url, index) => {
                  const platform = getPlatform(url);
                  const isFilled = urlRegex.test(url);

                  return (
                    <div key={index} className="relative">
                      <input
                        type="url"
                        placeholder={`Content URL ${index + 1}`}
                        value={url}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className={`w-full p-3 pr-10 rounded-xl bg-gray-800 text-white border ${
                          isFilled ? "border-green-500" : "border-gray-600"
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {platform === "instagram" && (
                          <Instagram className="w-5 h-5 text-pink-400" />
                        )}
                        {platform === "tiktok" && (
                          <Music2 className="w-5 h-5 text-green-400" />
                        )}
                        {isFilled && !platform && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                disabled={!isValid || loading}
                onClick={handleSubmitUrls}
                className={`w-full p-3 rounded-xl mt-6 font-semibold transition-colors duration-200 ${
                  isValid && !loading
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
              >
                {loading ? "Submitting..." : "Submit & Continue"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
