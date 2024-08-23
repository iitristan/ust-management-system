import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import EmailRequestForm from "./pages/RequestPage";
import AdminForm from "./pages/AdminLogin";
import BorrowerPage from "./pages/BorrowerPage"
import Events from "./pages/Events";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/email" element={<EmailRequestForm />} />
        <Route path="/admin" element={<AdminForm />} />
        <Route path="/borrower" element={<BorrowerPage />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </Router>
  );
}
