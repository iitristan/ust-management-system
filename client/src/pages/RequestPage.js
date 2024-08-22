import { useState, useEffect } from "react";
import Login from "../components/login";
import Logout from "../components/logout";
import Dashboard from "./DashboardPage";
import { gapi } from "gapi-script";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const clientId =
  "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

function EmailRequestForm() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

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
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Request Access
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          To access the UST-OSA Asset Management System, kindly input your email
          to be granted access to the website by the administrator of this
          website.
        </p>

        <form onSubmit={handleEmailSubmit} className="mb-8">
          <div className="relative border-b border-gray-300 focus-within:border-indigo-500">
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="block w-full appearance-none focus:outline-none bg-transparent text-lg text-gray-900 focus:ring-0 peer"
            />
            <label
              htmlFor="email"
              className="absolute left-0 top-0 text-gray-500 duration-300 transform -translate-y-6 scale-75 origin-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter your email
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 w-full py-2 text-white bg-indigo-600 hover:bg-indigo-700 font-semibold text-lg rounded-md"
          >
            Request Access
          </button>
        </form>

        <Link to="/" className="mt-6 text-indigo-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default EmailRequestForm;
