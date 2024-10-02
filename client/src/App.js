import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
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
import ProfilePage from "./pages/Profile";
import BorrowingRequest from "./pages/BorrowingRequest";

function App() {
  // State to hold user profile data once logged in
  const [user, setUser] = useState(() => {
    // Load user from localStorage if available
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Save user to localStorage whenever it changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <Router>
      <AppContent user={user} setUser={setUser} />
    </Router>
  );
}

function AppContent({ user, setUser }) {
  const location = useLocation();
  const isSignInPage = location.pathname === "/login";

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <div className="app-container">
      {/* Sidebar will only be displayed if the user is logged in */}
      {!isSignInPage && user && <Sidebar user={user} onLogout={handleLogout} />}
      <div className="main-content">
        <Routes>
          {/* Pass setUser to handle login */}
          <Route path="/" element={<SignIn setUser={setUser} />} /> 
          <Route path="/email" element={<EmailRequestForm />} />
          <Route path="/borrower" element={<BorrowerForm />} />
          <Route path="/admin" element={<AdminForm />} />
          {user ? (
            <>
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/events" element={<Events />} />
              <Route path="/assets" element={<AssetList />} />
              <Route path="/borrowingrequest" element={<BorrowingRequest />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/profile" element={<ProfilePage user={user} />} />
              <Route path="/financetracking" element={<FinanceTracking />} />
              <Route path="/supplierlist" element={<SupplierList />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/" />} />
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
