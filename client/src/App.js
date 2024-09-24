import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Events from "./pages/eventslist";
import AssetList from "./pages/assetlist";
import UserManagement from "./pages/usermanagement";
import FinanceTracking from "./pages/financetracking";
import SupplierList from "./pages/supplierlist";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/LoginPage";
import Sidebar from "./components/navbar/navbar";
import AdminForm from "./pages/AdminLogin";
import EmailRequestForm from "./pages/RequestPage";
import BorrowerForm from "./pages/BorrowerPage";

function App() {
  // State to hold user profile data once logged in
  const [user, setUser] = useState(null);

  return (
    <Router>
      <AppContent user={user} setUser={setUser} />
    </Router>
  );
}

function AppContent({ user, setUser }) {
  const location = useLocation();
  const isSignInPage = location.pathname === "/login";

  return (
    <div className="app-container">
      {/* Sidebar will only be displayed if the user is logged in */}
      {!isSignInPage && user && <Sidebar user={user} />}
      <div className="main-content">
        <Routes>
          {/* Pass setUser to handle login */}
          <Route path="/" element={<SignIn setUser={setUser} />} />

          <Route path="/email" element={<EmailRequestForm />} />
          <Route path="/borrower" element={<BorrowerForm />} />
          <Route path="/admin" element={<AdminForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/assets" element={<AssetList />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/financetracking" element={<FinanceTracking />} />
          <Route path="/supplierlist" element={<SupplierList />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
