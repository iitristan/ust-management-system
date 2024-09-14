import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Events from "./pages/eventslist";
import AssetList from "./pages/assetlist";
import UserManagement from "./pages/usermanagement";
import FinanceTracking from "./pages/financetracking";
import SupplierList from "./pages/supplierlist";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/navbar/navbar";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/assets" element={<AssetList />} />
            <Route path="/usermanagement" element={<UserManagement />} />
            <Route path="/financetracking" element={<FinanceTracking />} />
            <Route path="/supplierlist" element={<SupplierList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

