import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const Accordion = ({ 
  title, 
  children, 
  defaultOpen = false, 
  alwaysOpen = false,
  className = "",
  titleClassName = "",
  contentClassName = "",
  icon = null
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || alwaysOpen);

  const toggleAccordion = () => {
    if (!alwaysOpen) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden ${className}`}>
      <button
        onClick={toggleAccordion}
        className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors duration-200 ${
          alwaysOpen 
            ? "cursor-default" 
            : "hover:bg-white/5 cursor-pointer"
        } ${titleClassName}`}
        disabled={alwaysOpen}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-xl">{icon}</span>}
          <h3 className="text-lg font-semibold text-[#E0FFFA] FontNoto">
            {title}
          </h3>
        </div>
        {!alwaysOpen && (
          <span className="text-gray-400 transition-transform duration-200">
            {isOpen ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </span>
        )}
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className={`px-6 pb-6 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

const AccordionGroup = ({ children, className = "" }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
};

export { Accordion, AccordionGroup };
