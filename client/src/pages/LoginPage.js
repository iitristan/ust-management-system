import { useState, useEffect } from "react";
import Login from "../components/login";
import Logout from "../components/logout";
import Dashboard from "./DashboardPage";
import { gapi } from "gapi-script";

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
      </div>
    </div>
  );
}

export default SignIn;
