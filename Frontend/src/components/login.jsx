import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Utils/loader"; 
import axios from "axios"; 
import Swal from 'sweetalert2'; 

export default function Login() {
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState(""); 
  const [name, setName] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [passwordError, setPasswordError] = useState(""); // Track password errors

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/;
    return passwordRegex.test(password);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
  
    // Check if password meets criteria
    if (!validatePassword(password)) {
      setPasswordError("Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.");
      setLoading(false);
      return;
    } else {
      setPasswordError(""); // Clear error if validation passes
    }

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const response = await axios.post(`http://localhost:5000${endpoint}`, {
        email,
        name: isLogin ? undefined : name,
        password,
      });
  
      console.log(response.data.message);
      setLoading(false);
  
      if (isLogin) {
        navigate("/landing");
      } else {
        Swal.fire({
          title: "Registration Successful!",
          text: "You can now log in.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setIsLogin(true);
          setEmail("");
          setPassword("");
          setName(""); 
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "An error occurred. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Register"}
        </h2>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="John@Doe.com"
                className="w-full p-2 border border-gray-300 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="current-password"
              />
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
              disabled={loading}
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
        )}

        <p className="text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="text-blue-500 ml-1"
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail("");
              setPassword(""); 
              if (isLogin) setName("");
            }}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
