import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Events from "./pages/eventslist";
import AssetList from "./pages/assetlist";
import UserManagement from "./pages/usermanagement";
import FinanceTracking from "./pages/financetracking";
import SupplierList from "./pages/supplierlist";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/navbar/navbar";

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
      <Navbar />
      <Routes>
      <Route path="/events" element={<Events />} />
      <Route path="/assets" element={<AssetList />} />
      <Route path="/usermanagement" element={<UserManagement />} />
      <Route path="/financetracking" element={<FinanceTracking />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/supplierlist" element={<SupplierList />} />
      </Routes>
      </Router>
  );
}

