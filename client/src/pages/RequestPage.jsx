import { useState } from "react";
import Dashboard from "./Dashboard";
import { Link } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode"; // Corrected import
import axios from "axios"; // Import axios to replace fetch

const clientId = "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

function EmailRequestForm() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [email, setEmail] = useState("");

  const saveUserToDatabase = async (userData) => {
    try {
      console.log("Sending user data:", userData);
      const response = await axios.post("http://localhost:5000/api/users", {
        name: userData.name,
        email: userData.email,
        role: "user", // default role
        picture: userData.picture,
        hd: userData.hd
      });

      if (response.status === 201) {
        console.log("User saved successfully");
      } else {
        console.error("Failed to save user:", response.data.message);
      }
    } catch (error) {
      console.error("Error saving user to the database:", error);
    }
  };

  // Handle login success and trigger saving the user to the database
  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Credential Response Decoded:", decoded);
      setUserInfo(decoded);
      saveUserToDatabase(decoded);
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  };

  const handleLoginFailure = (error) => {
    console.error("Error logging in:", error);
    setIsLoggedIn(false);
  };

  return (
    <div className="relative flex h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('./ust-image.JPG')" }}
      ></div>

      <div className="relative w-1/2 ml-auto flex flex-col justify-center p-12 bg-white bg-opacity-90 z-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Request Access</h1>
        <p className="text-lg text-gray-600 mb-8">
          To access the UST-OSA Asset Management System, kindly input your email
          to be granted access to the website by the administrator of this
          website.
        </p>

        {isLoggedIn ? (
          <Dashboard userInfo={userInfo} />
        ) : (
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
            />
          </GoogleOAuthProvider>
        )}


        <Link to="/" className="mt-6 text-indigo-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default EmailRequestForm;