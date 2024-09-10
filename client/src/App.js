import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/SignIn";
import Events from "./components/events/eventslist";
import AssetList from "./pages/assetlist";
import { useEffect } from "react";
import { gapi } from "gapi-script";

const clientId =
  "1072140054426-iucuc7c784kr4bvat2nkv8mvd865005s.apps.googleusercontent.com";

export default function App() {
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
    <Router>
      <Routes>
      <Route index element={<SignIn />} />
      <Route path="/events" element={<Events />} />
      <Route path="/assets" element={<AssetList />} />
      </Routes>
      </Router>
  );
}

