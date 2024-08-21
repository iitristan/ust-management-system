import { useEffect } from "react";
import { gapi } from "gapi-script";
import LogoutButton from "../components/logout";

const clientId =
  "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

function Dashboard() {
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
    <div className="Dashboard">
      <header className="App-header">
        <h1>ok</h1>
        <p>SHESH</p>
        <LogoutButton />
      </header>
    
    </div>
  );
}

export default Dashboard;
