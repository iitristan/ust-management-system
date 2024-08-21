import "./App.css";
import { useState, useEffect } from "react";
import LoginButton from "./components/login";
import LogoutButton from "./components/logout";
import Dashboard from "./pages/DashboardPage";
import { gapi } from "gapi-script";

const clientId =
  "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

function App() {
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

  // var accessToken = gapi.auth.getToken().access_token;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Google Login</h1>
        <p>
          {" "}
          To access the UST-OSA Asset Management System, kindly sign in using
          your Google Account below: Click the "Login" button to sign in
        </p>
        {isLoggedIn ? (
          <Dashboard />
        ) : (
          <LoginButton setIsLoggedIn={setIsLoggedIn} />
        )}
        {isLoggedIn && <LogoutButton setIsLoggedIn={setIsLoggedIn} />}
      </header>
    </div>
  );
}

export default App;

// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import SignIn from "./pages/Login";
// import Dashboard from "./pages/DashboardPage";

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route index element={<SignIn />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="*" element={<h1>Page not found</h1>} />
//       </Routes>
//     </Router>
//   );
// }
