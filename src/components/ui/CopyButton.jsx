import { useState } from "react";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";

const CopyButton = ({ 
  text, 
  label = "Copy", 
  className = "",
  size = "sm",
  variant = "primary"
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  const variantClasses = {
    primary: "bg-yellow-400 hover:bg-yellow-500 text-black",
    secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
    ghost: "hover:bg-white/10 text-gray-300 hover:text-white"
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {copied ? (
        <>
          <CheckIcon className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <ClipboardIcon className="w-4 h-4" />
          {label}
        </>
      )}
    </button>
  );
};

export default CopyButton;
