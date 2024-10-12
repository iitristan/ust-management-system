import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminForm({ setUser }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Use environment variables for admin credentials
  const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || "admin";
  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || "admin";

  useEffect(() => {
    const adminToken = sessionStorage.getItem('adminToken');
    if (adminToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simulate an API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Set admin token in sessionStorage
        sessionStorage.setItem('adminToken', 'admin-logged-in');
        // Set user in localStorage and update state
        const adminUser = { role: 'admin', email: ADMIN_EMAIL };
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
        navigate("/dashboard");
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div
        className="w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('./ust-image.JPG')" }}
      ></div>

      <div className="w-1/2 flex flex-col justify-center p-12 bg-white">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Admin Login</h1>
        <p className="text-lg text-gray-600 mb-8">
          Administrator Account for UST-OSA Asset Management System
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="block w-full border-b border-gray-300 bg-transparent text-lg text-gray-900 focus:border-indigo-500 focus:outline-none peer"
            />
            <label
              htmlFor="email"
              className="absolute left-0 top-3 text-gray-500 duration-300 transform -translate-y-6 scale-75 origin-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter your username
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="block w-full border-b border-gray-300 bg-transparent text-lg text-gray-900 focus:border-indigo-500 focus:outline-none peer"
            />
            <label
              htmlFor="password"
              className="absolute left-0 top-3 text-gray-500 duration-300 transform -translate-y-6 scale-75 origin-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter your password
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-indigo-600 text-white text-lg font-medium py-3 rounded-md hover:bg-indigo-700 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <Link to="/" className="mt-6 text-indigo-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default AdminForm;