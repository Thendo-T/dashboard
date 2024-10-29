import { useState } from "react";
import LoadingSpinner from "../Utils/loader";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dashboardClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 200);
  };
  return (
    <div className="flex">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 flex-grow flex flex-col items-center justify-center text-white">
          <div className="flex flex-col items-center text-center p-4">
            <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
            <p className="text-lg mb-6">
              We provide the best solutions for your needs. Explore our features
              and services tailored just for you!
            </p>
            <div className="flex space-x-4">
              <button
                className="bg-white text-blue-500 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200"
                onClick={dashboardClick}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
