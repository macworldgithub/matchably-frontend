import { FiUpload, FiX } from "react-icons/fi";

export const FileUpload = ({ 
  label, 
  onChange, 
  onRemove, 
  preview, 
  progress = 0,
  required = false
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-contain rounded-lg mb-2 bg-gray-900"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
          >
            <FiX size={16} />
          </button>

          {/* Replace Image */}
          <label className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-500 cursor-pointer mt-2">
            <FiUpload size={16} />
            <span>Replace Image</span>
            <input
              type="file"
              accept="image/*"
              name="fileUpload"
              onChange={onChange}
              className="hidden"
              required={required && !preview}
            />
          </label>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-800 rounded-lg cursor-pointer bg-black hover:bg-gray-900 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FiUpload className="text-gray-400 mb-2" size={24} />
            <p className="text-sm text-gray-400">
              Click to upload or drag and drop
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            name="fileUpload"
            onChange={onChange}
            className="hidden"
            required={required}
          />
        </label>
      )}

      {progress > 0 && progress < 100 && (
        <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};
