import React from "react";
import { Link } from "react-router-dom";

const SubmitFeedback_Kfood = () => {
  return (
    <div className="bg-[var(--background)] flex items-center justify-center p-4 min-h-[80vh]">
      <div className="bg-[#1a1a1a] shadow-lg rounded-2xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-[#eef7ff] mb-4 text-center FontNoto">
          Submit Your Product Feedback for K-food
        </h1>

        {/* Link to K-Beauty feedback */}
        <div className="text-center mb-4">
          <p className="text-gray-300">
            Want to give feedback for <strong>K-Beauty</strong>?{" "}
            <Link
              to="/ProductFeedback/K-Beauty"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-200"
            >
              Click here
            </Link>
          </p>
        </div>

        {/* Google Form Embed for K-Food */}
        <div className="w-full h-[300px] border rounded-lg overflow-hidden">
          <iframe
            title="Feedback Form"
            src="https://docs.google.com/forms/d/e/1FAIpQLSdMeqW4QbN5LZP6J7rSlIxo5EV_dCs7VjOI7XqKRzHx4Fmrow/viewform?embedded=true"
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            className="rounded-lg"
            allowFullScreen
          ></iframe>
        </div>

        <p className="text-gray-300 text-center mt-4">
          Thank you for your valuable feedback! Your insights help us grow.
        </p>
      </div>
    </div>
  );
};

const SubmitFeedback_Kbeauty = () => {
  return (
    <div className="bg-[var(--background)] flex items-center justify-center p-4 min-h-[80vh]">
      <div className="bg-[#1a1a1a] shadow-lg rounded-2xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-[#eef7ff] mb-4 text-center FontNoto">
          Submit Your Product Feedback for K-Beauty
        </h1>

        {/* Link to K-Beauty feedback */}
        <div className="text-center mb-4">
          <p className="text-gray-300">
            Want to give feedback for <strong>K-food</strong>?{" "}
            <Link
              to="/ProductFeedback/K-Food"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-200"
            >
              Click here
            </Link>
          </p>
        </div>

        {/* Google Form Embed for K-Food */}
        <div className="w-full h-[300px] border rounded-lg overflow-hidden">
          <iframe
            title="Feedback Form"
            src="https://docs.google.com/forms/d/e/1FAIpQLSdMeqW4QbN5LZP6J7rSlIxo5EV_dCs7VjOI7XqKRzHx4Fmrow/viewform?embedded=true"
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            className="rounded-lg"
            allowFullScreen
          ></iframe>
        </div>

        <p className="text-gray-300 text-center mt-4">
          Thank you for your valuable feedback! Your insights help us grow.
        </p>
      </div>
    </div>
  );
};

export {
  SubmitFeedback_Kfood,
  SubmitFeedback_Kbeauty
};
