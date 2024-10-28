import { useState } from "react";
import { ArrowUpCircleIcon, ChartPieIcon, HomeIcon, UserIcon } from "@heroicons/react/16/solid";

export default function Headers() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // State to track hover status

  const handleClick = () => {
    setIsExpanded(true);
  };

  return (
    <div className="bg-slate-100">
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-1/7 p-8 flex flex-col items-center">
        {isExpanded ? (
          <div className="flex space-x-4">
            <HomeIcon className="h-8 w-8 text-blue-500 transition-transform duration-200 hover:scale-125 cursor-pointer" />
            <ChartPieIcon className="h-8 w-8 text-blue-500 transition-transform duration-200 hover:scale-125 cursor-pointer" />
            <UserIcon className="h-8 w-8 text-blue-500 transition-transform duration-200 hover:scale-125 cursor-pointer" />
          </div>
        ) : (
          <div 
            className="relative flex items-center" 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)} // Track hover state
          >
            <ArrowUpCircleIcon
              className="h-8 w-8 text-blue-500 mt-auto transition-transform duration-200 hover:scale-125 cursor-pointer"
              onClick={handleClick}
            />
            {isHovered && ( // Show tooltip only when hovered
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-700 text-white text-sm p-1 rounded opacity-100 transition-opacity duration-300">
                Open Menu
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
