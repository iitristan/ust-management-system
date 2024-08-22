import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </Router>
  );
}
