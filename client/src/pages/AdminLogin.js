import { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import { Link, useNavigate } from "react-router-dom";

const clientId =
  "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

function AdminForm() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          clientId: clientId,
          scope: "",
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          setIsLoggedIn(authInstance.isSignedIn.get());
          authInstance.isSignedIn.listen(setIsLoggedIn);
        })
        .catch((error) => {
          console.error("Error initializing Google API:", error);
        });
    }

    gapi.load("client:auth2", start);
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    // Add further logic here for email handling
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

        <form onSubmit={handleEmailSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
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
              Enter your email
            </label>
          </div>

          {/* Password Field */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white text-lg font-medium py-3 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Sign In
          </button>
        </form>

        {/* Back to Login */}
        <Link to="/" className="mt-6 text-indigo-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default AdminForm;
