export const InputField = ({ 
    label, 
    name, 
    value, 
    onChange, 
    placeholder, 
    type = "text", 
    required = false,
    textarea = false
  }) => {
    const commonClasses = "w-full px-4 py-3 bg-black text-white rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600";
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {/* {required && <span className="text-red-500 ml-1">*</span>} */}
        </label>
        {textarea ? (
          <textarea
            name={name}
            placeholder={placeholder}
            className={`${commonClasses} min-h-[120px]`}
            value={value}
            onChange={onChange}
            required={required}
          />
        ) : (
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            className={commonClasses}
            value={value}
            onChange={onChange}
            required={required}
          />
        )}
      </div>
    );
  };