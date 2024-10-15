import { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function EmailRequestForm() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [requestStatus, setRequestStatus] = useState(""); // State for request status

  const saveUserToDatabase = async (userData) => {
    try {
      console.log("Sending user data:", userData);
      const response = await axios.post(`${process.env.API_URL}/api/users`, {
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        hd: userData.hd,
        access: false,
        role_name: "user", // Set role_name dynamically if needed
        color: "#FFFFFF" // Set color dynamically if needed
      });

      if (response.status === 201) {
        console.log("User saved successfully");
        setIsLoggedIn(true);
        setRequestStatus("Your request has been sent. Please wait for approval."); // Update request status
      } else {
        console.error("Failed to save user:", response.data.message);
        setRequestStatus("Please wait for your approval, pending."); // Update request status if there's an issue
      }
    } catch (error) {
      console.error("Error saving user to the database:", error);
      setRequestStatus("There was an error processing your request."); // Handle error scenario
    }
  };

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
          To access the UST-OSA Asset Management System, please sign in with your Google account.
          Your request will be sent to the administrator for approval.
        </p>

        {requestStatus && ( // Conditionally render the request status
          <p className="text-lg text-gray-800 mb-4">{requestStatus}</p>
        )}

        <GoogleOAuthProvider clientId={clientId}>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
        </GoogleOAuthProvider>
        
        <Link to="/" className="mt-6 text-indigo-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default EmailRequestForm;
