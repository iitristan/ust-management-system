import { useState } from "react";
import Dashboard from "./Dashboard";
import { Link } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

const clientId = "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

function SignIn({ setUser }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const checkUserEmailExists = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users?email=${email}`);
      return response.data.exists; // Assuming the API returns { exists: true/false }
    } catch (error) {
      console.error("Error checking user email:", error);
      return false; // Default to false on error
    }
  };

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Credential Response Decoded:", decoded);
      const emailExists = await checkUserEmailExists(decoded.email);

      if (!emailExists) {
        setUserInfo(decoded);
        setIsLoggedIn(true);
        setUser(decoded);
        navigate("/dashboard");
      } else {
        console.log("User email does not exist in the database.");
      }
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
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Google Login</h1>
        <p className="text-lg text-gray-600 mb-8">
          To access the UST-OSA Asset Management System, kindly sign in using
          your Google Account below. Click the "Login" button to sign in.
        </p>
       
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
            />
          </GoogleOAuthProvider>
        <div className="flex flex-col gap-4 mt-8">
          <Link
            to="/email"
            className="inline-block text-center text-white bg-blue-600 hover:bg-blue-700 font-medium py-3 px-6 rounded transition duration-300"
          >
            No Access Yet? Request Access
          </Link>

          <Link
            to="/admin"
            className="inline-block text-center text-white bg-gray-600 hover:bg-gray-700 font-medium py-3 px-6 rounded transition duration-300"
          >
            Admin? Click here
          </Link>

          <Link
            to="/borrower"
            className="inline-block text-center text-white bg-green-600 hover:bg-green-700 font-medium py-3 px-6 rounded transition duration-300"
          >
            Borrow here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
