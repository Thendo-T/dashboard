import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { ChartPieIcon, HomeIcon, UserIcon } from "@heroicons/react/16/solid";
import LoadingSpinner from "./loader"; // Ensure correct import path
import Swal from "sweetalert2"; // Import SweetAlert2

export default function SidebarHeader() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    setLoading(true); 
    setTimeout(() => {
      setLoading(false); 
      navigate("/landing");
    }, 2000);
  };

  const dashboardClick = () => {
    setLoading(true); 
    setTimeout(() => {
      setLoading(false); 
      navigate("/dashboard");
    }, 2000); 
  };

  const logoutClick = () => {
    // Show confirmation dialog using SweetAlert2
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true); 
        setTimeout(() => {
          setLoading(false); 
          navigate("/login");
        }, 2000); 
      }
    });
  };

  return (
    <div className="fixed top-0 left-0 h-full w-16 bg-gray-800 shadow-lg flex flex-col justify-between">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col items-center py-4">
          <div className="relative flex items-center mb-8 cursor-pointer" onClick={handleHomeClick}>
            <HomeIcon className="h-8 w-8 text-white transition-transform duration-200 hover:scale-110" />
            <span className="absolute left-16 bg-gray-700 text-white text-sm p-1 rounded opacity-0 transition-opacity duration-300 hover:opacity-100">
              Home
            </span>
          </div>
          <div className="relative flex items-center mb-8 cursor-pointer" onClick={dashboardClick}>
            <ChartPieIcon className="h-8 w-8 text-white transition-transform duration-200 hover:scale-110" />
            <span className="absolute left-16 bg-gray-700 text-white text-sm p-1 rounded opacity-0 transition-opacity duration-300 hover:opacity-100">
              Dashboard
            </span>
          </div>
        </div>
      )}
      <div className="relative flex flex-col items-center mb-4">
        <div className="cursor-pointer mb-2" onClick={logoutClick}> 
          <UserIcon className="h-8 w-8 text-white transition-transform duration-200 hover:scale-110" />
          <span className="absolute left-10 bg-gray-700 text-white text-sm p-1 rounded opacity-0 transition-opacity duration-300 hover:opacity-100">
            Logout
          </span>
        </div>
        <div className="flex items-center justify-center text-xl">
          logo
        </div>
      </div>
    </div>
  );
}
