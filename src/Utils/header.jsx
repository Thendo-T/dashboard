import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { ArrowUpCircleIcon, ChartPieIcon, HomeIcon, UserIcon } from "@heroicons/react/16/solid";
import LoadingSpinner from "./loader"; // Ensure correct import path

export default function Headers() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsExpanded(true);
  };

  const handleHomeClick = () => {
    navigate("/landing");
  };

  const dasboardClick = () => {
    navigate("/dashboard");
  };

  const logoutClick = () => {
    setLoading(true); 
    setTimeout(() => {
      setLoading(false); 
      navigate("/login");
    }, 2000); 
  };

  return (
    <div className="bg-slate-100">
      {loading ? (
          <LoadingSpinner />
        ) : (
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-1/7 p-8 flex flex-col items-center">
        
          <>
            {isExpanded ? (
              <div className="flex space-x-4">
                <div 
                  className="relative flex items-center" 
                  onMouseEnter={() => setHoveredIcon("home")} 
                  onMouseLeave={() => setHoveredIcon(null)} 
                  onClick={handleHomeClick} // Add onClick to HomeIcon wrapper
                >
                  <HomeIcon className="h-8 w-8 text-blue-500 transition-transform duration-200 hover:scale-125 cursor-pointer" />
                  {hoveredIcon === "home" && ( // Show tooltip when hovering over HomeIcon
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-700 text-white text-sm p-1 rounded opacity-100 transition-opacity duration-300">
                      Home
                    </span>
                  )}
                </div>
                <div 
                  className="relative flex items-center" 
                  onMouseEnter={() => setHoveredIcon("chart")} 
                  onMouseLeave={() => setHoveredIcon(null)} 
                  onClick={dasboardClick} // Add onClick to ChartPieIcon wrapper
                >
                  <ChartPieIcon className="h-8 w-8 text-blue-500 transition-transform duration-200 hover:scale-125 cursor-pointer" />
                  {hoveredIcon === "chart" && ( // Show tooltip when hovering over ChartPieIcon
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-700 text-white text-sm p-1 rounded opacity-100 transition-opacity duration-300">
                      Dashboard
                    </span>
                  )}
                </div>
                <div 
                  className="relative flex items-center" 
                  onMouseEnter={() => setHoveredIcon("user")} 
                  onMouseLeave={() => setHoveredIcon(null)} 
                  onClick={logoutClick} // Add onClick to UserIcon wrapper
                >
                  <UserIcon className="h-8 w-8 text-blue-500 transition-transform duration-200 hover:scale-125 cursor-pointer" />
                  {hoveredIcon === "user" && (  // Show tooltip when hovering over UserIcon
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-700 text-white text-sm p-1 rounded opacity-100 transition-opacity duration-300">
                      Logout
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div 
                className="relative flex items-center" 
                onMouseEnter={() => setHoveredIcon("arrow")} 
                onMouseLeave={() => setHoveredIcon(null)} 
              >
                <ArrowUpCircleIcon
                  className="h-8 w-8 text-blue-500 mt-auto transition-transform duration-200 hover:scale-125 cursor-pointer"
                  onClick={handleClick}
                />
                {hoveredIcon === "arrow" && (  // Show tooltip when hovering over ArrowUpCircleIcon
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-700 text-white text-sm p-1 rounded opacity-100 transition-opacity duration-300">
                    Open Menu
                  </span>
                )}
              </div>
            )}
          </>
        
      </div>
      )}
    </div>
  );
}
