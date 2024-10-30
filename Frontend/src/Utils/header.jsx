import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChartPieIcon,
  HomeIcon,
  UserIcon,
  CogIcon,
} from "@heroicons/react/16/solid"; // Import CogIcon
import LoadingSpinner from "./loader"; // Ensure correct import path
import Swal from "sweetalert2"; // Import SweetAlert2
import axios from "axios";

export default function SidebarHeader() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/landing");
    }, 200);
  };

  const dashboardClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 200);
  };

  const settingsClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/settings"); // Change this to the actual route for settings
    }, 200);
  };

  const logoutClick = async () => {
    // Show confirmation dialog using SweetAlert2
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        // Update the database to set isLoggedIn to false
        await axios.post("http://localhost:5000/auth/logout"); // Create this endpoint
        setLoading(false);
        navigate("/");
      }
    });
  };

  return (
    <div className="fixed top-0 left-0 h-full w-16 bg-gray-800 shadow-lg flex flex-col justify-between">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col items-center py-4">
          <div
            className="relative flex items-center mb-8 cursor-pointer"
            onClick={handleHomeClick}
          >
            <HomeIcon className="h-8 w-8 text-white transition-transform duration-200 hover:scale-110" />
          </div>
          <div
            className="relative flex items-center mb-8 cursor-pointer"
            onClick={dashboardClick}
          >
            <ChartPieIcon className="h-8 w-8 text-white transition-transform duration-200 hover:scale-110" />
          </div>
          {/* New Cog Icon Menu Item */}
        </div>
      )}
      <div className="relative flex flex-col items-center mb-4">
        <div className="cursor-pointer mb-2" onClick={logoutClick}>
          <UserIcon className="h-8 w-8 text-white transition-transform duration-200 hover:scale-110" />
        </div>
        <div
          className="relative flex flex-col items-center mb-4 cursor-pointer mb-2"
          onClick={settingsClick}
        >
          <CogIcon className="h-8 w-8 text-white transition-transform duration-200 hover:scale-110" />
        </div>
        <div className="flex items-center cursor-pointer mb-2 justify-center text-xl">
          logo
        </div>
      </div>
    </div>
  );
}
