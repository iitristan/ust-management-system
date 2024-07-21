import "./App.css";
import LoginButton from "./components/login";
import LogoutButton from "./components/logout";
import { useEffect } from "react";
import { gapi } from "gapi-script";

const clientId =
  "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

function App() {
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }

    gapi.load("client:auth2", start);
  });


  return (
    <div className="App">
      <header className="App-header">
        <h1>Google Login</h1>
        <LoginButton />
        <LogoutButton />
      </header>
    </div>
  );
}

export default App;
