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
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-lg text-gray-600 mb-8">Welcome to your dashboard!</p>
        <LogoutButton />
      </header>
    </div>
  );
}

export default Dashboard;
