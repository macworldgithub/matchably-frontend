import { useEffect } from 'react';

const SuccessPopup = ({ onClose, show }) => {
  // Close popup after 5 seconds if user doesn't interact
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10000 bg-[#000000ba] bg-opacity-50">
      <div className="bg-[#232323] rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          {/* Success Message */}
          <h3 className="text-xl font-semibold text-gray-300 mb-2 FontNoto">Successfully Applied!</h3>
          <p className="text-gray-400  FontLato text-center mb-6">
            Your application has been submitted successfully.
          </p>
          
          {/* Action Buttons */}
          <div className="flex space-x-2 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-2 border FontLato border-gray-300 rounded-md text-gray-300 hover:bg-[black] transition"
            >
              Close
            </button>
            <a
              href="/UserApplyCampaign" // Replace with your actual account route
              className="flex-1 py-2 px-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-center FontLato"
            >
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;