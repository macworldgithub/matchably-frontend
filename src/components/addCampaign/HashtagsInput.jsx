export const HashtagsInput = ({ 
    label, 
    inputValue, 
    hashtags, 
    onChange, 
    required = false 
  }) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          value={inputValue}
          placeholder="#skincare #organic #beauty"
          className="w-full px-4 py-3 bg-black text-white rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          onChange={onChange}
          required={required}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {hashtags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  };