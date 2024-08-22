import { useState, useEffect } from "react";
import Login from "../components/login";
import Logout from "../components/logout";
import Dashboard from "./DashboardPage";
import { gapi } from "gapi-script";
import { Link } from "react-router-dom";
import EmailRequestForm from "./RequestPage";

const clientId =
  "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

function SignIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  return (
    <div className="flex h-screen">
      <div
        className="w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('./ust-image.JPG')" }}
      ></div>

      <div className="w-1/2 flex flex-col justify-center p-12 bg-white">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Google Login</h1>
        <p className="text-lg text-gray-600 mb-8">
          To access the UST-OSA Asset Management System, kindly sign in using
          your Google Account below. Click the "Login" button to sign in.
        </p>
        {isLoggedIn ? <Dashboard /> : <Login setIsLoggedIn={setIsLoggedIn} />}
        {isLoggedIn && (
          <div className="mt-4">
            <Logout setIsLoggedIn={setIsLoggedIn} />
          </div>
        )}
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
