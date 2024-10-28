const LoadingSpinner = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="animate-spin rounded-full border-4 border-t-4 border-gray-700 border-t-transparent h-16 w-16 mb-2"></div>
        <span className="text-gray-700"></span>
      </div>
    );
  };
  
  export default LoadingSpinner;
  