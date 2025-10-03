import { FiCheck } from "react-icons/fi";

export const SuccessMessage = ({ message = "Operation completed successfully!", onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-green-600 rounded-full p-4 mb-4">
        <FiCheck size={48} className="text-white" />
      </div>
      <h3 className="text-2xl font-semibold text-white mb-2">Success!</h3>
      <p className="text-gray-300 mb-6">{message}</p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
      >
        Close
      </button>
    </div>
  );
};