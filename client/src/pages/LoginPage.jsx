import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; 
import axios from "axios";

const clientId = "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

function SignIn({ setUser }) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Credential Response Decoded:", decoded);

      // Check if the user exists in the database
      const response = await axios.post('http://localhost:5000/api/users/check', {
        
        email: decoded.email
      });

      if (response.data.exists) {
        // User exists, set user data and redirect to dashboard
        setUser(decoded);
        navigate('/dashboard');
      } else {
        // User doesn't exist, show error message
        setError("User not found. Please request access.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred during login. Please try again.");
    }
  };

  const handleLoginFailure = (error) => {
    console.error("Error logging in:", error);
    setError("Login failed. Please try again.");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('./ust-image.JPG')",
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      ></div>

      <div className="w-1/2 flex flex-col justify-center p-12 bg-white bg-opacity-90 absolute right-0 top-0 bottom-0"> 
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Google Login</h1>
        <p className="text-lg text-gray-600 mb-8">
          To access the UST-OSA Asset Management System, kindly sign in using
          your Google Account below. Click the "Login" button to sign in.
        </p>
        
        {error && <p className="text-red-500">{error}</p>}
       
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