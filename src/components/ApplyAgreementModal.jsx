import { useState } from "react";

export default function ApplyAgreementModal({ isOpen, onClose, onAgree }) {
  const [checked, setChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-[#2f2f2f]/95 backdrop-blur-md text-white w-full max-w-lg rounded-xl shadow-2xl border border-gray-600 p-6 space-y-5">
        
        <h2 className="text-xl font-bold text-center text-white">
          Matchably Campaign Participation Agreement
        </h2>

        <div className="text-sm border border-gray-600 p-4 rounded-md max-h-80 overflow-y-auto bg-[#383838] text-gray-200">
          <ul className="list-disc pl-5 space-y-2">
            <li>Submit content within 7–14 days after receiving the product.</li>
            <li>Use the product solely for content creation.</li>
            <li>The product is gifted only if content is submitted.</li>
            <li>Failure to submit requires return within 7 days at your expense.</li>
            <li>Matchably and the brand may reuse your content for marketing.</li>
          </ul>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="agree"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="w-4 h-4 accent-yellow-500"
          />
          <label htmlFor="agree" className="text-sm text-gray-200">
            I have read and agree to the terms above.
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={() => {
              setChecked(false);
              onClose();
            }}
            className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setChecked(false);
              onAgree();
            }}
            disabled={!checked}
            className={`px-4 py-2 text-sm rounded-md text-white transition ${
              checked
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-yellow-300 cursor-not-allowed"
            }`}
          >
            I Agree and Apply
          </button>
        </div>
      </div>
    </div>
  );
}
